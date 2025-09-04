import { prisma } from '@/lib/prisma'
import type { Survey } from '@prisma/client'

export class SurveyService {
  static async create(data: {
    title: string
    description?: string
    password: string
    startDate: Date
    endDate: Date
    isActive?: boolean
  }): Promise<Survey> {
    return await prisma.survey.create({
      data,
    })
  }

  static async findById(id: number): Promise<Survey | null> {
    return await prisma.survey.findUnique({
      where: { id },
    })
  }

  static async findActive(): Promise<Survey[]> {
    const now = new Date()
    return await prisma.survey.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async getCurrentSurvey(): Promise<Survey | null> {
    const now = new Date()
    return await prisma.survey.findFirst({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async update(id: number, data: Partial<Survey>): Promise<Survey> {
    return await prisma.survey.update({
      where: { id },
      data,
    })
  }

  static async verifyPassword(id: number, password: string): Promise<boolean> {
    const survey = await prisma.survey.findUnique({
      where: { id },
      select: { password: true },
    })

    return survey?.password === password
  }
}
