import { PrismaClient } from '@prisma/client'
import { seedAIToolQuestions } from './seed-ai-tools'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with survey and questions...')

  // Create an active survey for the current week
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(now.getDate() - ((now.getDay() + 6) % 7)) // Start of week (Monday)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6) // End of week (Sunday)
  endDate.setHours(23, 59, 59, 999)

  // Create survey
  const survey = await prisma.survey.create({
    data: {
      title: 'AI Coding Tools Weekly Survey',
      description:
        'Share your experience with AI-powered coding tools and development practices',
      password: 'before-where', // Using the current week's password
      startDate,
      endDate,
      isActive: true,
    },
  })

  console.log(`✅ Created survey: ${survey.title}`)
  console.log(`   Valid from: ${startDate.toISOString()}`)
  console.log(`   Valid until: ${endDate.toISOString()}`)

  // Seed questions
  await seedAIToolQuestions()

  console.log('✨ Database seeded successfully!')
}

main()
  .catch(e => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
