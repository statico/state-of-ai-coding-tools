import { PrismaClient } from '@prisma/client'
import { seedAIToolQuestions } from './seed-ai-tools'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with questions...')

  // Seed questions
  await seedAIToolQuestions()

  console.log('✨ Database seeded with questions successfully!')
}

main()
  .catch(e => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
