import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getUTCDay()
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1)
  d.setUTCDate(diff)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

function getWeekEnd(weekStart: Date): Date {
  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6)
  weekEnd.setUTCHours(23, 59, 59, 999)
  return weekEnd
}

async function seedWeeklyPasswords() {
  console.log('🔑 Seeding weekly passwords...')

  // Clear existing passwords
  await prisma.weeklyPassword.deleteMany()

  // Generate passwords for 3 years (156 weeks)
  const passwords = []
  const startDate = getWeekStart(new Date())

  for (let i = 0; i < 156; i++) {
    const weekStart = new Date(startDate)
    weekStart.setUTCDate(weekStart.getUTCDate() + i * 7)

    const weekEnd = getWeekEnd(weekStart)

    // Generate a readable password using faker
    const password = faker.word.words(2).toLowerCase().replace(/\s+/g, '-')

    passwords.push({
      password,
      weekStart,
      weekEnd,
      isActive: i === 0, // Only the current week is active
    })
  }

  // Insert all passwords
  const created = await prisma.weeklyPassword.createMany({
    data: passwords,
  })

  console.log(`✅ Created ${created.count} weekly passwords`)

  // Show the current week's password
  const currentPassword = passwords[0]
  console.log(`\n📅 Current week's password: "${currentPassword.password}"`)
  console.log(`   Valid from: ${currentPassword.weekStart.toISOString()}`)
  console.log(`   Valid until: ${currentPassword.weekEnd.toISOString()}`)
}

seedWeeklyPasswords()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
