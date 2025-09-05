import { PrismaClient, QuestionType, Experience } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.response.deleteMany()
  await prisma.userSession.deleteMany()
  await prisma.questionOption.deleteMany()
  await prisma.question.deleteMany()
  await prisma.experienceMetric.deleteMany()
  await prisma.experienceTrend.deleteMany()

  console.log('✅ Cleared existing data')

  // Create demographic questions
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

  // Create AI coding tools questions
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

  // Create development tools questions
  const devTools = [
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

  const devToolQuestions = await Promise.all(
    devTools.map((tool, index) =>
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

  console.log(`✅ Created ${devTools.length} editor questions`)

  // Create framework questions
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

  // Create opinion questions
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

  // Create some initial experience metrics with sample data
  const sampleMetrics = await Promise.all([
    prisma.experienceMetric.create({
      data: {
        toolName: 'GitHub Copilot',
        category: 'ai_tools',
        neverHeardCount: 50,
        wantToTryCount: 200,
        notInterestedCount: 30,
        wouldUseAgainCount: 450,
        wouldNotUseCount: 70,
        awarenessRate: 0.9375,
        adoptionRate: 0.65,
        satisfactionRate: 0.865,
        totalResponses: 800,
      },
    }),
    prisma.experienceMetric.create({
      data: {
        toolName: 'Cursor',
        category: 'ai_tools',
        neverHeardCount: 150,
        wantToTryCount: 350,
        notInterestedCount: 50,
        wouldUseAgainCount: 200,
        wouldNotUseCount: 50,
        awarenessRate: 0.8125,
        adoptionRate: 0.3125,
        satisfactionRate: 0.8,
        totalResponses: 800,
      },
    }),
    prisma.experienceMetric.create({
      data: {
        toolName: 'React',
        category: 'frameworks',
        neverHeardCount: 5,
        wantToTryCount: 95,
        notInterestedCount: 100,
        wouldUseAgainCount: 500,
        wouldNotUseCount: 100,
        awarenessRate: 0.99375,
        adoptionRate: 0.75,
        satisfactionRate: 0.833,
        totalResponses: 800,
      },
    }),
    prisma.experienceMetric.create({
      data: {
        toolName: 'VS Code',
        category: 'editors',
        neverHeardCount: 2,
        wantToTryCount: 18,
        notInterestedCount: 30,
        wouldUseAgainCount: 700,
        wouldNotUseCount: 50,
        awarenessRate: 0.9975,
        adoptionRate: 0.9375,
        satisfactionRate: 0.933,
        totalResponses: 800,
      },
    }),
  ])

  console.log('✅ Created sample experience metrics')

  // Create trend data for the last 3 months
  const now = new Date()
  const months = [
    new Date(now.getFullYear(), now.getMonth() - 2, 1),
    new Date(now.getFullYear(), now.getMonth() - 1, 1),
    new Date(now.getFullYear(), now.getMonth(), 1),
  ]

  const trendData = []
  for (const metric of sampleMetrics) {
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

  // Count total questions
  const totalQuestions = await prisma.question.count()
  console.log(
    `\n🎉 Seed completed! Created ${totalQuestions} questions in total.`
  )
}

main()
  .catch(e => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
