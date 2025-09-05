import { PrismaClient, QuestionType, Experience } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting fake responses seed...')

  // Get all questions
  const questions = await prisma.question.findMany({
    include: {
      options: true,
    },
    orderBy: { orderIndex: 'asc' },
  })

  if (questions.length === 0) {
    console.log('❌ No questions found. Please run the main seed first.')
    return
  }

  // Create fake user sessions with responses
  const numSessions = 50 // Create 50 fake survey responses

  for (let i = 0; i < numSessions; i++) {
    // Create a user session
    const sessionId = faker.string.uuid()
    const session = await prisma.userSession.create({
      data: {
        id: sessionId,
        demographicData: {
          source: 'fake_seed',
          userAgent: faker.internet.userAgent(),
        },
        completedAt: faker.date.recent({ days: 30 }),
      },
    })

    console.log(`Creating responses for session ${i + 1}/${numSessions}...`)

    // Create responses for each question
    for (const question of questions) {
      let responseData: any = {
        sessionId: session.id,
        questionId: question.id,
      }

      switch (question.type) {
        case QuestionType.SINGLE_CHOICE:
        case QuestionType.DEMOGRAPHIC:
          // Pick a random option
          if (question.options.length > 0) {
            const randomOption = faker.helpers.arrayElement(question.options)
            responseData.optionId = randomOption.id
          }
          break

        case QuestionType.MULTIPLE_CHOICE:
          // Pick 1-3 random options
          if (question.options.length > 0) {
            const numOptions = faker.number.int({
              min: 1,
              max: Math.min(3, question.options.length),
            })
            const selectedOptions = faker.helpers.arrayElements(
              question.options,
              numOptions
            )

            // Create a response for each selected option
            for (const option of selectedOptions) {
              await prisma.response.create({
                data: {
                  sessionId: session.id,
                  questionId: question.id,
                  optionId: option.id,
                },
              })
            }
            continue // Skip the single create at the end
          }
          break

        case QuestionType.RATING:
          // Generate a rating between 1-5, weighted towards higher ratings
          const ratingOptions = [
            { value: 1, weight: 5 },
            { value: 2, weight: 10 },
            { value: 3, weight: 20 },
            { value: 4, weight: 30 },
            { value: 5, weight: 35 },
          ]
          const rating = faker.helpers.weightedArrayElement(ratingOptions)
          responseData.ratingValue = rating
          break

        case QuestionType.TEXT:
          // Generate some fake feedback text
          const feedbackOptions = [
            'Great tool, very helpful for my daily work!',
            'Could use more features, but overall satisfied.',
            'The UI needs improvement, but functionality is good.',
            'Excellent experience, would recommend to others.',
            'Some bugs need fixing, but shows promise.',
            'Very intuitive and easy to use.',
            'Performance could be better.',
            'Love the AI integration features!',
            'Needs better documentation.',
            'Game changer for productivity!',
          ]
          responseData.textValue = faker.helpers.arrayElement(feedbackOptions)
          break

        case QuestionType.EXPERIENCE:
          // Generate experience based on tool popularity
          // Weight based on tool name (popular tools more likely to be known/used)
          let experienceWeights = [
            { value: Experience.NEVER_HEARD, weight: 10 },
            { value: Experience.WANT_TO_TRY, weight: 20 },
            { value: Experience.NOT_INTERESTED, weight: 15 },
            { value: Experience.WOULD_USE_AGAIN, weight: 40 },
            { value: Experience.WOULD_NOT_USE, weight: 15 },
          ]

          if (
            question.title.includes('GitHub Copilot') ||
            question.title.includes('ChatGPT')
          ) {
            // Very popular
            experienceWeights = [
              { value: Experience.NEVER_HEARD, weight: 5 },
              { value: Experience.WANT_TO_TRY, weight: 15 },
              { value: Experience.NOT_INTERESTED, weight: 10 },
              { value: Experience.WOULD_USE_AGAIN, weight: 50 },
              { value: Experience.WOULD_NOT_USE, weight: 20 },
            ]
          } else if (
            question.title.includes('VS Code') ||
            question.title.includes('React')
          ) {
            // Extremely popular
            experienceWeights = [
              { value: Experience.NEVER_HEARD, weight: 2 },
              { value: Experience.WANT_TO_TRY, weight: 10 },
              { value: Experience.NOT_INTERESTED, weight: 8 },
              { value: Experience.WOULD_USE_AGAIN, weight: 60 },
              { value: Experience.WOULD_NOT_USE, weight: 20 },
            ]
          } else if (
            question.title.includes('Cursor') ||
            question.title.includes('Claude')
          ) {
            // Growing popularity
            experienceWeights = [
              { value: Experience.NEVER_HEARD, weight: 15 },
              { value: Experience.WANT_TO_TRY, weight: 30 },
              { value: Experience.NOT_INTERESTED, weight: 15 },
              { value: Experience.WOULD_USE_AGAIN, weight: 30 },
              { value: Experience.WOULD_NOT_USE, weight: 10 },
            ]
          } else if (
            question.title.includes('Devin') ||
            question.title.includes('CodeGeeX')
          ) {
            // Less known
            experienceWeights = [
              { value: Experience.NEVER_HEARD, weight: 40 },
              { value: Experience.WANT_TO_TRY, weight: 30 },
              { value: Experience.NOT_INTERESTED, weight: 20 },
              { value: Experience.WOULD_USE_AGAIN, weight: 8 },
              { value: Experience.WOULD_NOT_USE, weight: 2 },
            ]
          }

          responseData.experience =
            faker.helpers.weightedArrayElement(experienceWeights)
          break

        case QuestionType.WRITE_IN:
          // Occasionally add write-in values
          if (faker.datatype.boolean({ probability: 0.3 })) {
            responseData.writeInValue = faker.lorem.sentence()
          }
          break
      }

      // Create the response (except for multiple choice which we handled above)
      if (question.type !== QuestionType.MULTIPLE_CHOICE) {
        await prisma.response.create({ data: responseData })
      }
    }
  }

  // Update experience metrics based on the new responses
  console.log('📊 Updating experience metrics...')

  const experienceQuestions = questions.filter(
    q => q.type === QuestionType.EXPERIENCE
  )

  for (const question of experienceQuestions) {
    const responses = await prisma.response.findMany({
      where: { questionId: question.id },
    })

    const counts = {
      neverHeardCount: 0,
      wantToTryCount: 0,
      notInterestedCount: 0,
      wouldUseAgainCount: 0,
      wouldNotUseCount: 0,
    }

    responses.forEach(response => {
      switch (response.experience) {
        case Experience.NEVER_HEARD:
          counts.neverHeardCount++
          break
        case Experience.WANT_TO_TRY:
          counts.wantToTryCount++
          break
        case Experience.NOT_INTERESTED:
          counts.notInterestedCount++
          break
        case Experience.WOULD_USE_AGAIN:
          counts.wouldUseAgainCount++
          break
        case Experience.WOULD_NOT_USE:
          counts.wouldNotUseCount++
          break
      }
    })

    const total = responses.length
    const heardCount = total - counts.neverHeardCount
    const usedCount = counts.wouldUseAgainCount + counts.wouldNotUseCount

    await prisma.experienceMetric.upsert({
      where: { toolName: question.title },
      create: {
        toolName: question.title,
        category: question.category,
        ...counts,
        awarenessRate: total > 0 ? heardCount / total : 0,
        adoptionRate: total > 0 ? usedCount / total : 0,
        satisfactionRate:
          usedCount > 0 ? counts.wouldUseAgainCount / usedCount : 0,
        totalResponses: total,
      },
      update: {
        ...counts,
        awarenessRate: total > 0 ? heardCount / total : 0,
        adoptionRate: total > 0 ? usedCount / total : 0,
        satisfactionRate:
          usedCount > 0 ? counts.wouldUseAgainCount / usedCount : 0,
        totalResponses: total,
      },
    })
  }

  const totalSessions = await prisma.userSession.count()
  const totalResponses = await prisma.response.count()

  console.log(`\n🎉 Seed completed!`)
  console.log(`   - Created ${numSessions} user sessions`)
  console.log(`   - Created ${totalResponses} survey responses`)
  console.log(
    `   - Updated experience metrics for ${experienceQuestions.length} tools`
  )
}

main()
  .catch(e => {
    console.error('Error seeding fake responses:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
