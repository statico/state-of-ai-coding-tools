import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getCurrentWeekPassword(): Promise<string | null> {
  const now = new Date()
  
  // First, deactivate all passwords
  await prisma.weeklyPassword.updateMany({
    where: { isActive: true },
    data: { isActive: false }
  })
  
  // Find and activate the current week's password
  const currentPassword = await prisma.weeklyPassword.findFirst({
    where: {
      weekStart: { lte: now },
      weekEnd: { gte: now }
    }
  })
  
  if (currentPassword) {
    // Mark it as active
    await prisma.weeklyPassword.update({
      where: { id: currentPassword.id },
      data: { isActive: true }
    })
    
    return currentPassword.password
  }
  
  return null
}

export async function validateWeeklyPassword(inputPassword: string): Promise<boolean> {
  const currentPassword = await getCurrentWeekPassword()
  return currentPassword === inputPassword
}

export async function getActiveWeeklyPassword() {
  const activePassword = await prisma.weeklyPassword.findFirst({
    where: { isActive: true }
  })
  
  if (!activePassword) {
    // If no active password, get the current one
    return getCurrentWeekPassword()
  }
  
  // Check if the active password is still valid
  const now = new Date()
  if (activePassword.weekStart <= now && activePassword.weekEnd >= now) {
    return activePassword.password
  }
  
  // If not valid, get the current one
  return getCurrentWeekPassword()
}