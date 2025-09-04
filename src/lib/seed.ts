import { QuestionService } from './services/question'
import { SurveyService } from './services/survey'
import { QuestionType } from '@prisma/client'

const aiCodingTools = [
  'GitHub Copilot',
  'ChatGPT',
  'Claude',
  'Cursor',
  'Codeium',
  'Amazon CodeWhisperer',
  'Sourcegraph Cody',
  'JetBrains AI Assistant',
  'Tabnine',
  'Replit Ghostwriter',
  'Other',
]

const programmingLanguages = [
  'JavaScript/TypeScript',
  'Python',
  'Java',
  'C#',
  'C/C++',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'Other',
]

const experienceLevels = [
  'Less than 1 year',
  '1-2 years',
  '3-5 years',
  '6-10 years',
  '11-15 years',
  'More than 15 years',
]

const companySizes = [
  'Just me (freelancer/solo)',
  '2-10 people',
  '11-50 people',
  '51-200 people',
  '201-1000 people',
  'More than 1000 people',
]

export async function seedDatabase() {
  console.log('Starting database seeding...')

  // Create a sample survey
  const survey = await SurveyService.create({
    title: 'State of AI Coding Tools',
    description: 'Weekly survey about AI coding tool usage and preferences',
    password: process.env.SURVEY_PASSWORD || 'survey2024',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2030-12-31'),
    isActive: true,
  })

  console.log(`Created survey: ${survey.title}`)

  // Create demographic questions
  const experienceQuestion = await QuestionService.create({
    title: 'How many years of programming experience do you have?',
    description: 'Please select your total years of professional programming experience',
    type: QuestionType.SINGLE_CHOICE,
    category: 'demographics',
    orderIndex: 1,
    isRequired: true,
    isActive: true,
  })

  for (let i = 0; i < experienceLevels.length; i++) {
    await QuestionService.createOption({
      questionId: experienceQuestion.id,
      value: experienceLevels[i].toLowerCase().replace(/\s+/g, '_'),
      label: experienceLevels[i],
      description: undefined,
      orderIndex: i + 1,
      isActive: true,
    })
  }

  const companySizeQuestion = await QuestionService.create({
    title: 'What is the size of your current company/organization?',
    description: 'Please select the size that best describes your current workplace',
    type: QuestionType.SINGLE_CHOICE,
    category: 'demographics',
    orderIndex: 2,
    isRequired: true,
    isActive: true,
  })

  for (let i = 0; i < companySizes.length; i++) {
    await QuestionService.createOption({
      questionId: companySizeQuestion.id,
      value: companySizes[i].toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, ''),
      label: companySizes[i],
      description: undefined,
      orderIndex: i + 1,
      isActive: true,
    })
  }

  // Create AI tool usage questions
  const toolUsageQuestion = await QuestionService.create({
    title: 'Which AI coding tools do you currently use? (Select all that apply)',
    description: 'Please select all the AI coding tools that you actively use in your development workflow',
    type: QuestionType.MULTIPLE_CHOICE,
    category: 'tools',
    orderIndex: 1,
    isRequired: true,
    isActive: true,
  })

  for (let i = 0; i < aiCodingTools.length; i++) {
    await QuestionService.createOption({
      questionId: toolUsageQuestion.id,
      value: aiCodingTools[i].toLowerCase().replace(/\s+/g, '_'),
      label: aiCodingTools[i],
      description: undefined,
      orderIndex: i + 1,
      isActive: true,
    })
  }

  const primaryLanguageQuestion = await QuestionService.create({
    title: 'What is your primary programming language?',
    description: 'Please select the programming language you use most frequently',
    type: QuestionType.SINGLE_CHOICE,
    category: 'tools',
    orderIndex: 2,
    isRequired: true,
    isActive: true,
  })

  for (let i = 0; i < programmingLanguages.length; i++) {
    await QuestionService.createOption({
      questionId: primaryLanguageQuestion.id,
      value: programmingLanguages[i].toLowerCase().replace(/[\/\s]/g, '_'),
      label: programmingLanguages[i],
      description: undefined,
      orderIndex: i + 1,
      isActive: true,
    })
  }

  const satisfactionQuestion = await QuestionService.create({
    title: 'How satisfied are you with AI coding tools overall?',
    description: 'Rate your overall satisfaction with AI coding tools on a scale of 1-5',
    type: QuestionType.RATING,
    category: 'satisfaction',
    orderIndex: 1,
    isRequired: true,
    isActive: true,
  })

  // For rating questions, we don't need options as they're handled differently
  for (let i = 1; i <= 5; i++) {
    await QuestionService.createOption({
      questionId: satisfactionQuestion.id,
      value: i.toString(),
      label: `${i} star${i > 1 ? 's' : ''}`,
      description: i === 1 ? 'Very dissatisfied' : i === 5 ? 'Very satisfied' : undefined,
      orderIndex: i,
      isActive: true,
    })
  }

  await QuestionService.create({
    title: 'What improvements would you like to see in AI coding tools?',
    description: 'Please share any feedback or suggestions for improving AI coding tools',
    type: QuestionType.TEXT,
    category: 'feedback',
    orderIndex: 1,
    isRequired: false,
    isActive: true,
  })

  console.log('Database seeding completed successfully!')
  console.log(`Survey ID: ${survey.id}`)
  console.log(`Survey Password: ${survey.password}`)
}

if (require.main === module) {
  seedDatabase().then(() => {
    console.log('Seeding finished!')
    process.exit(0)
  }).catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })
}