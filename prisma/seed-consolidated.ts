import { PrismaClient, QuestionType, Experience } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

interface SeedOptions {
  clearData?: boolean
  createQuestions?: boolean
  createFakeResponses?: boolean
  numberOfResponses?: number
}

async function clearExistingData() {
  console.log('🧹 Clearing existing data...')
  await prisma.response.deleteMany()
  await prisma.userSession.deleteMany()
  await prisma.questionOption.deleteMany()
  await prisma.question.deleteMany()
  await prisma.experienceMetric.deleteMany()
  await prisma.experienceTrend.deleteMany()
  console.log('✅ Cleared existing data')
}

async function createDemographicQuestions() {
  console.log('👥 Creating demographic questions...')

  const demographics = await Promise.all([
    prisma.question.create({
      data: {
        title: 'Years of Professional Experience',
        description:
          'How many years have you been working professionally in software development?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 1,
        isRequired: false,
        options: {
          create: [
            { value: 'less_than_1', label: 'Less than 1 year', orderIndex: 1 },
            { value: '1_2', label: '1-2 years', orderIndex: 2 },
            { value: '3_5', label: '3-5 years', orderIndex: 3 },
            { value: '6_10', label: '6-10 years', orderIndex: 4 },
            { value: '11_20', label: '11-20 years', orderIndex: 5 },
            { value: 'over_20', label: 'Over 20 years', orderIndex: 6 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Company Size',
        description: 'How many people work at your company?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 2,
        isRequired: false,
        options: {
          create: [
            {
              value: 'solo',
              label: 'Just me (freelancer/consultant)',
              orderIndex: 1,
            },
            { value: '2_10', label: '2-10 employees', orderIndex: 2 },
            { value: '11_50', label: '11-50 employees', orderIndex: 3 },
            { value: '51_100', label: '51-100 employees', orderIndex: 4 },
            { value: '101_500', label: '101-500 employees', orderIndex: 5 },
            { value: '501_1000', label: '501-1000 employees', orderIndex: 6 },
            { value: 'over_1000', label: 'Over 1000 employees', orderIndex: 7 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Primary Development Area',
        description: 'What type of development do you primarily focus on?',
        type: QuestionType.MULTIPLE_CHOICE,
        category: 'demographics',
        orderIndex: 3,
        isRequired: false,
        options: {
          create: [
            { value: 'frontend', label: 'Frontend Development', orderIndex: 1 },
            { value: 'backend', label: 'Backend Development', orderIndex: 2 },
            {
              value: 'fullstack',
              label: 'Full-Stack Development',
              orderIndex: 3,
            },
            { value: 'mobile', label: 'Mobile Development', orderIndex: 4 },
            { value: 'devops', label: 'DevOps/Infrastructure', orderIndex: 5 },
            { value: 'data', label: 'Data Engineering/Science', orderIndex: 6 },
            { value: 'ml', label: 'Machine Learning/AI', orderIndex: 7 },
            { value: 'embedded', label: 'Embedded Systems', orderIndex: 8 },
            { value: 'games', label: 'Game Development', orderIndex: 9 },
            { value: 'other', label: 'Other', orderIndex: 10 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Location',
        description: 'Where are you located?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 4,
        isRequired: false,
        options: {
          create: [
            { value: 'north_america', label: 'North America', orderIndex: 1 },
            { value: 'europe', label: 'Europe', orderIndex: 2 },
            { value: 'asia', label: 'Asia', orderIndex: 3 },
            { value: 'south_america', label: 'South America', orderIndex: 4 },
            { value: 'africa', label: 'Africa', orderIndex: 5 },
            { value: 'oceania', label: 'Oceania', orderIndex: 6 },
          ],
        },
      },
    }),
  ])

  console.log('✅ Created demographic questions')
  return demographics
}

async function createAIToolQuestions() {
  console.log('🤖 Creating AI tool questions...')

  const aiTools = [
    'GitHub Copilot',
    'Cursor',
    'Claude (Anthropic)',
    'ChatGPT',
    'Amazon CodeWhisperer',
    'Codeium',
    'Tabnine',
    'Replit AI',
    'Sourcegraph Cody',
    'CodeGeeX',
    'Continue',
    'Aider',
    'Windsurf',
    'v0 by Vercel',
    'bolt.new',
    'Lovable',
    'Replit Agent',
    'Devin',
  ]

  const aiToolQuestions = await Promise.all(
    aiTools.map((tool, index) =>
      prisma.question.create({
        data: {
          title: tool,
          description: `What's your experience with ${tool}?`,
          type: QuestionType.EXPERIENCE,
          category: 'ai_tools',
          orderIndex: 100 + index,
          isRequired: false,
        },
      })
    )
  )

  console.log(`✅ Created ${aiTools.length} AI tool questions`)
  return aiToolQuestions
}

async function createEditorQuestions() {
  console.log('📝 Creating editor questions...')

  const editors = [
    'VS Code',
    'IntelliJ IDEA',
    'Visual Studio',
    'Vim/Neovim',
    'Sublime Text',
    'WebStorm',
    'Xcode',
    'Android Studio',
    'Emacs',
    'Zed',
  ]

  const editorQuestions = await Promise.all(
    editors.map((tool, index) =>
      prisma.question.create({
        data: {
          title: tool,
          description: `What's your experience with ${tool}?`,
          type: QuestionType.EXPERIENCE,
          category: 'editors',
          orderIndex: 200 + index,
          isRequired: false,
        },
      })
    )
  )

  console.log(`✅ Created ${editors.length} editor questions`)
  return editorQuestions
}

async function createFrameworkQuestions() {
  console.log('🛠️ Creating framework questions...')

  const frameworks = [
    'React',
    'Vue.js',
    'Angular',
    'Svelte',
    'Next.js',
    'Nuxt',
    'Express',
    'NestJS',
    'Django',
    'Flask',
    'FastAPI',
    'Ruby on Rails',
    'Spring Boot',
    'ASP.NET',
    'Laravel',
  ]

  const frameworkQuestions = await Promise.all(
    frameworks.map((framework, index) =>
      prisma.question.create({
        data: {
          title: framework,
          description: `What's your experience with ${framework}?`,
          type: QuestionType.EXPERIENCE,
          category: 'frameworks',
          orderIndex: 300 + index,
          isRequired: false,
        },
      })
    )
  )

  console.log(`✅ Created ${frameworks.length} framework questions`)
  return frameworkQuestions
}

async function createOpinionQuestions() {
  console.log('💭 Creating opinion questions...')

  const opinionQuestions = await Promise.all([
    prisma.question.create({
      data: {
        title: 'AI Impact on Productivity',
        description:
          'How much have AI coding tools improved your productivity?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'opinions',
        orderIndex: 400,
        isRequired: false,
        options: {
          create: [
            {
              value: 'significant_increase',
              label: 'Significantly increased (>50%)',
              orderIndex: 1,
            },
            {
              value: 'moderate_increase',
              label: 'Moderately increased (20-50%)',
              orderIndex: 2,
            },
            {
              value: 'slight_increase',
              label: 'Slightly increased (<20%)',
              orderIndex: 3,
            },
            { value: 'no_change', label: 'No change', orderIndex: 4 },
            { value: 'decreased', label: 'Actually decreased', orderIndex: 5 },
            { value: 'not_using', label: 'Not using AI tools', orderIndex: 6 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Most Important AI Feature',
        description:
          'Which AI coding assistant feature is most valuable to you?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'opinions',
        orderIndex: 401,
        isRequired: false,
        options: {
          create: [
            {
              value: 'autocomplete',
              label: 'Code autocompletion',
              orderIndex: 1,
            },
            {
              value: 'generation',
              label: 'Code generation from comments',
              orderIndex: 2,
            },
            {
              value: 'chat',
              label: 'Chat/conversation interface',
              orderIndex: 3,
            },
            {
              value: 'refactoring',
              label: 'Code refactoring suggestions',
              orderIndex: 4,
            },
            {
              value: 'debugging',
              label: 'Bug detection and fixes',
              orderIndex: 5,
            },
            {
              value: 'documentation',
              label: 'Documentation generation',
              orderIndex: 6,
            },
            { value: 'testing', label: 'Test generation', orderIndex: 7 },
            { value: 'review', label: 'Code review', orderIndex: 8 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Biggest AI Tool Concern',
        description: 'What concerns you most about AI coding tools?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'opinions',
        orderIndex: 402,
        isRequired: false,
        options: {
          create: [
            {
              value: 'security',
              label: 'Security/privacy of code',
              orderIndex: 1,
            },
            { value: 'quality', label: 'Code quality concerns', orderIndex: 2 },
            {
              value: 'dependency',
              label: 'Over-reliance on AI',
              orderIndex: 3,
            },
            { value: 'job', label: 'Job security', orderIndex: 4 },
            { value: 'cost', label: 'Cost/pricing', orderIndex: 5 },
            {
              value: 'accuracy',
              label: 'Accuracy of suggestions',
              orderIndex: 6,
            },
            {
              value: 'learning',
              label: 'Impact on learning/skill development',
              orderIndex: 7,
            },
            { value: 'none', label: 'No major concerns', orderIndex: 8 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'AI Adoption Timeline',
        description:
          'When do you think AI will write the majority of production code?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'opinions',
        orderIndex: 403,
        isRequired: false,
        options: {
          create: [
            { value: 'already', label: 'It already does', orderIndex: 1 },
            { value: '1_year', label: 'Within 1 year', orderIndex: 2 },
            { value: '2_3_years', label: 'Within 2-3 years', orderIndex: 3 },
            { value: '5_years', label: 'Within 5 years', orderIndex: 4 },
            { value: '10_years', label: 'Within 10 years', orderIndex: 5 },
            { value: 'more_10', label: 'More than 10 years', orderIndex: 6 },
            { value: 'never', label: 'Never', orderIndex: 7 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Additional Comments',
        description:
          "Any other thoughts on AI coding tools you'd like to share?",
        type: QuestionType.TEXT,
        category: 'opinions',
        orderIndex: 404,
        isRequired: false,
      },
    }),
  ])

  console.log('✅ Created opinion questions')
  return opinionQuestions
}

async function createFakeResponses(numberOfSessions: number = 50) {
  console.log(`🎭 Creating ${numberOfSessions} fake survey responses...`)

  const questions = await prisma.question.findMany({
    include: { options: true },
    orderBy: { orderIndex: 'asc' },
  })

  if (questions.length === 0) {
    console.log('❌ No questions found. Please create questions first.')
    return
  }

  for (let i = 0; i < numberOfSessions; i++) {
    const sessionId = faker.string.uuid()
    const session = await prisma.userSession.create({
      data: {
        id: sessionId,
        demographicData: {
          source: 'seed',
          userAgent: faker.internet.userAgent(),
        },
        completedAt: faker.date.recent({ days: 30 }),
      },
    })

    console.log(
      `  Creating responses for session ${i + 1}/${numberOfSessions}...`
    )

    for (const question of questions) {
      let responseData: any = {
        sessionId: session.id,
        questionId: question.id,
      }

      switch (question.type) {
        case QuestionType.SINGLE_CHOICE:
        case QuestionType.DEMOGRAPHIC:
          if (question.options.length > 0) {
            const randomOption = faker.helpers.arrayElement(question.options)
            responseData.optionId = randomOption.id
          }
          break

        case QuestionType.MULTIPLE_CHOICE:
          if (question.options.length > 0) {
            const numOptions = faker.number.int({
              min: 1,
              max: Math.min(3, question.options.length),
            })
            const selectedOptions = faker.helpers.arrayElements(
              question.options,
              numOptions
            )

            for (const option of selectedOptions) {
              await prisma.response.create({
                data: {
                  sessionId: session.id,
                  questionId: question.id,
                  optionId: option.id,
                },
              })
            }
            continue
          }
          break

        case QuestionType.RATING:
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
          let experienceWeights = [
            { value: Experience.NEVER_HEARD, weight: 10 },
            { value: Experience.WANT_TO_TRY, weight: 20 },
            { value: Experience.NOT_INTERESTED, weight: 15 },
            { value: Experience.WOULD_USE_AGAIN, weight: 40 },
            { value: Experience.WOULD_NOT_USE, weight: 15 },
          ]

          // Adjust weights based on tool popularity
          if (
            question.title.includes('GitHub Copilot') ||
            question.title.includes('ChatGPT')
          ) {
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
          if (faker.datatype.boolean({ probability: 0.3 })) {
            responseData.writeInValue = faker.lorem.sentence()
          }
          break
      }

      if (question.type !== QuestionType.MULTIPLE_CHOICE) {
        await prisma.response.create({ data: responseData })
      }
    }
  }

  console.log('✅ Created fake responses')
}

async function updateExperienceMetrics() {
  console.log('📊 Updating experience metrics...')

  const experienceQuestions = await prisma.question.findMany({
    where: { type: QuestionType.EXPERIENCE },
  })

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

  console.log(
    `✅ Updated experience metrics for ${experienceQuestions.length} tools`
  )
}

async function createTrendData() {
  console.log('📈 Creating trend data...')

  const metrics = await prisma.experienceMetric.findMany()
  const now = new Date()
  const months = [
    new Date(now.getFullYear(), now.getMonth() - 2, 1),
    new Date(now.getFullYear(), now.getMonth() - 1, 1),
    new Date(now.getFullYear(), now.getMonth(), 1),
  ]

  const trendData = []
  for (const metric of metrics) {
    for (let i = 0; i < months.length; i++) {
      const baseAwareness = metric.awarenessRate || 0.5
      const baseAdoption = metric.adoptionRate || 0.3
      const baseSatisfaction = metric.satisfactionRate || 0.7

      trendData.push(
        prisma.experienceTrend.create({
          data: {
            toolName: metric.toolName,
            category: metric.category,
            month: months[i],
            awarenessRate: baseAwareness - 0.05 * (2 - i),
            adoptionRate: baseAdoption - 0.03 * (2 - i),
            satisfactionRate: baseSatisfaction + 0.02 * i,
            changeFromPrev: i === 0 ? null : 0.02,
            distribution: {
              neverHeard: metric.neverHeardCount,
              wantToTry: metric.wantToTryCount,
              notInterested: metric.notInterestedCount,
              wouldUseAgain: metric.wouldUseAgainCount,
              wouldNotUse: metric.wouldNotUseCount,
            },
          },
        })
      )
    }
  }

  await Promise.all(trendData)
  console.log('✅ Created trend data')
}

export async function seed(options: SeedOptions = {}) {
  const {
    clearData = true,
    createQuestions = true,
    createFakeResponses: shouldCreateResponses = true,
    numberOfResponses = 50,
  } = options

  console.log('🌱 Starting consolidated database seed...')
  console.log('   Options:', {
    clearData,
    createQuestions,
    createFakeResponses: shouldCreateResponses,
    numberOfResponses,
  })

  try {
    if (clearData) {
      await clearExistingData()
    }

    if (createQuestions) {
      await createDemographicQuestions()
      await createAIToolQuestions()
      await createEditorQuestions()
      await createFrameworkQuestions()
      await createOpinionQuestions()
    }

    if (shouldCreateResponses) {
      await createFakeResponses(numberOfResponses)
      await updateExperienceMetrics()
      await createTrendData()
    }

    const totalQuestions = await prisma.question.count()
    const totalSessions = await prisma.userSession.count()
    const totalResponses = await prisma.response.count()
    const totalMetrics = await prisma.experienceMetric.count()

    console.log('\n🎉 Seed completed successfully!')
    console.log(`   📋 Questions: ${totalQuestions}`)
    console.log(`   👤 Sessions: ${totalSessions}`)
    console.log(`   📝 Responses: ${totalResponses}`)
    console.log(`   📊 Metrics: ${totalMetrics}`)

    return {
      questions: totalQuestions,
      sessions: totalSessions,
      responses: totalResponses,
      metrics: totalMetrics,
    }
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const options: SeedOptions = {}

  // Parse command line arguments
  if (args.includes('--no-clear')) {
    options.clearData = false
  }
  if (args.includes('--no-questions')) {
    options.createQuestions = false
  }
  if (args.includes('--no-responses')) {
    options.createFakeResponses = false
  }
  const responsesIndex = args.indexOf('--responses')
  if (responsesIndex !== -1 && args[responsesIndex + 1]) {
    options.numberOfResponses = parseInt(args[responsesIndex + 1], 10)
  }

  await seed(options)
}

// Only run main if this file is executed directly
if (require.main === module) {
  main()
    .catch(e => {
      console.error('Error in seed script:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
