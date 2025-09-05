#!/usr/bin/env tsx
/**
 * Seed script to generate fake survey responses for testing
 * This creates responses for previous weeks to test the results visualization
 */

import { prisma } from '@/lib/prisma'
import { faker } from '@faker-js/faker'
import { Experience } from '@prisma/client'

// Use random seed to avoid UUID conflicts on repeated runs
// Remove or uncomment the line below for consistent data
// faker.seed(42)

const NUM_WEEKS = 8 // Generate data for past 8 weeks
const MIN_RESPONSES_PER_WEEK = 15
const MAX_RESPONSES_PER_WEEK = 40

// Company sizes for demographics
const COMPANY_SIZES = [
  'Solo developer',
  '2-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-1000 employees',
  '1000+ employees',
]

// Years of experience options
const EXPERIENCE_YEARS = [
  'Less than 1 year',
  '1-2 years',
  '3-5 years',
  '6-10 years',
  '11-20 years',
  '20+ years',
]

// Roles
const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps/Infrastructure',
  'Data Scientist',
  'ML Engineer',
  'Mobile Developer',
  'Tech Lead',
  'Engineering Manager',
  'Other',
]

async function seedFakeResponses() {
  console.log('🎲 Starting fake data seeding...')

  try {
    // Get the current survey
    const survey = await prisma.survey.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    if (!survey) {
      throw new Error(
        'No active survey found. Please run the main seed script first.'
      )
    }

    console.log(`📊 Found survey: ${survey.title}`)

    // Get all questions with their options
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      include: { options: { where: { isActive: true } } },
      orderBy: { orderIndex: 'asc' },
    })

    console.log(`❓ Found ${questions.length} questions`)

    // Generate responses for past weeks
    const now = new Date()
    for (let week = 0; week < NUM_WEEKS; week++) {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - (week + 1) * 7)

      const numResponses = faker.number.int({
        min: MIN_RESPONSES_PER_WEEK,
        max: MAX_RESPONSES_PER_WEEK,
      })

      console.log(
        `\n📅 Week ${week + 1} (${weekStart.toDateString()}): Generating ${numResponses} responses`
      )

      for (let i = 0; i < numResponses; i++) {
        // Create a user session
        const sessionId = faker.string.uuid()
        // Generate a date for this response within the week
        const responseDate = faker.date.between({
          from: weekStart,
          to: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
        })

        const session = await prisma.userSession.create({
          data: {
            id: sessionId,
            surveyId: survey.id,
            completedAt: responseDate,
            createdAt: responseDate,
            demographicData: {
              yearsOfExperience: faker.helpers.arrayElement(EXPERIENCE_YEARS),
              companySize: faker.helpers.arrayElement(COMPANY_SIZES),
              role: faker.helpers.arrayElement(ROLES),
            },
          },
        })

        // Generate responses for each question
        for (const question of questions) {
          switch (question.type) {
            case 'DEMOGRAPHIC':
              // Skip - handled in session demographicData
              break

            case 'SINGLE_CHOICE':
              if (question.options.length > 0) {
                const option = faker.helpers.arrayElement(question.options)
                await prisma.response.create({
                  data: {
                    surveyId: survey.id,
                    sessionId: session.id,
                    questionId: question.id,
                    optionId: option.id,
                    createdAt: responseDate,
                  },
                })
              }
              break

            case 'MULTIPLE_CHOICE':
              if (question.options.length > 0) {
                // Select 1-4 random options
                const numSelections = faker.number.int({
                  min: 1,
                  max: Math.min(4, question.options.length),
                })
                const selectedOptions = faker.helpers.arrayElements(
                  question.options,
                  numSelections
                )

                for (const option of selectedOptions) {
                  await prisma.response.create({
                    data: {
                      surveyId: survey.id,
                      sessionId: session.id,
                      questionId: question.id,
                      optionId: option.id,
                      createdAt: responseDate,
                    },
                  })
                }

                // Sometimes add an "Other" response
                if (faker.datatype.boolean({ probability: 0.15 })) {
                  await prisma.response.create({
                    data: {
                      surveyId: survey.id,
                      sessionId: session.id,
                      questionId: question.id,
                      writeInValue: faker.helpers.arrayElement([
                        'Custom internal tool',
                        'Proprietary company solution',
                        'Open source alternative',
                        'Self-built solution',
                        'Legacy system',
                      ]),
                      createdAt: responseDate,
                    },
                  })
                }
              }
              break

            case 'RATING':
              // Weighted towards higher ratings
              const rating = faker.helpers.weightedArrayElement([
                { weight: 0.05, value: 1 },
                { weight: 0.1, value: 2 },
                { weight: 0.2, value: 3 },
                { weight: 0.35, value: 4 },
                { weight: 0.3, value: 5 },
              ])
              await prisma.response.create({
                data: {
                  surveyId: survey.id,
                  sessionId: session.id,
                  questionId: question.id,
                  ratingValue: rating,
                  createdAt: responseDate,
                },
              })
              break

            case 'TEXT':
              // Generate fake feedback text
              if (faker.datatype.boolean({ probability: 0.7 })) {
                // 70% response rate for text
                const feedbackOptions = [
                  'The AI tools have significantly improved my productivity.',
                  'Still figuring out the best way to integrate these tools into my workflow.',
                  'Context switching between tools is a challenge.',
                  'Would love to see better IDE integration.',
                  'The cost of multiple subscriptions adds up quickly.',
                  'AI suggestions are getting better but still need human review.',
                  'Great for boilerplate but struggles with complex logic.',
                  'Helps me learn new frameworks and languages faster.',
                  'Privacy and security concerns with code being sent to cloud.',
                  'Game changer for repetitive tasks and documentation.',
                ]
                await prisma.response.create({
                  data: {
                    surveyId: survey.id,
                    sessionId: session.id,
                    questionId: question.id,
                    textValue: faker.helpers.arrayElement(feedbackOptions),
                    createdAt: responseDate,
                  },
                })
              }
              break

            case 'EXPERIENCE':
              // Generate experience responses with realistic distribution
              const experienceWeights = {
                [Experience.NEVER_HEARD]: 0.1,
                [Experience.WANT_TO_TRY]: 0.15,
                [Experience.NOT_INTERESTED]: 0.1,
                [Experience.WOULD_USE_AGAIN]: 0.45,
                [Experience.WOULD_NOT_USE]: 0.2,
              }

              // Adjust weights based on tool popularity (assuming title contains tool name)
              const adjustedWeights = { ...experienceWeights }
              if (
                question.title.toLowerCase().includes('copilot') ||
                question.title.toLowerCase().includes('cursor')
              ) {
                // Popular tools - more likely to have heard of and used
                adjustedWeights[Experience.NEVER_HEARD] = 0.02
                adjustedWeights[Experience.WOULD_USE_AGAIN] = 0.6
              } else if (
                question.title.toLowerCase().includes('claude') ||
                question.title.toLowerCase().includes('chatgpt')
              ) {
                // Very popular AI models
                adjustedWeights[Experience.NEVER_HEARD] = 0.01
                adjustedWeights[Experience.WOULD_USE_AGAIN] = 0.65
              }

              const experience = faker.helpers.weightedArrayElement(
                Object.entries(adjustedWeights).map(([value, weight]) => ({
                  weight,
                  value: value as Experience,
                }))
              )

              await prisma.response.create({
                data: {
                  surveyId: survey.id,
                  sessionId: session.id,
                  questionId: question.id,
                  experience,
                  createdAt: responseDate,
                },
              })

              // Sometimes add a write-in value for tools
              if (faker.datatype.boolean({ probability: 0.08 })) {
                await prisma.response.create({
                  data: {
                    surveyId: survey.id,
                    sessionId: session.id,
                    questionId: question.id,
                    writeInValue: faker.helpers.arrayElement([
                      'Considering switching to this',
                      'Testing in a sandbox environment',
                      'Waiting for enterprise version',
                      'Need team approval first',
                    ]),
                    createdAt: responseDate,
                  },
                })
              }
              break

            case 'WRITE_IN':
              // Optional write-in responses
              if (faker.datatype.boolean({ probability: 0.3 })) {
                await prisma.response.create({
                  data: {
                    surveyId: survey.id,
                    sessionId: session.id,
                    questionId: question.id,
                    writeInValue: faker.lorem.sentence(),
                    createdAt: responseDate,
                  },
                })
              }
              break
          }
        }

        if ((i + 1) % 10 === 0) {
          process.stdout.write('.')
        }
      }
      console.log(' ✓')
    }

    // Get summary statistics
    const totalSessions = await prisma.userSession.count({
      where: { surveyId: survey.id },
    })
    const totalResponses = await prisma.response.count({
      where: { surveyId: survey.id },
    })

    console.log('\n✅ Fake data seeding completed!')
    console.log(`📈 Statistics:`)
    console.log(`   - Total sessions: ${totalSessions}`)
    console.log(`   - Total responses: ${totalResponses}`)
    console.log(
      `   - Average responses per session: ${Math.round(totalResponses / totalSessions)}`
    )
  } catch (error) {
    console.error('❌ Error seeding fake responses:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding function
if (require.main === module) {
  seedFakeResponses()
    .then(() => {
      console.log('🎉 Fake response seeding finished!')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Seeding failed:', error)
      process.exit(1)
    })
}

export { seedFakeResponses }
