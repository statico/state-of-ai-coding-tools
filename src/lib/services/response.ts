import { prisma } from '@/lib/prisma'
import type { Response, UserSession } from '@prisma/client'

export class ResponseService {
  static async create(data: {
    surveyId: number
    sessionId: string
    questionId: number
    optionId?: number
    textValue?: string
    ratingValue?: number
  }): Promise<Response> {
    return await prisma.response.create({
      data,
    })
  }

  static async createOrUpdate(data: {
    surveyId: number
    sessionId: string
    questionId: number
    optionId?: number
    textValue?: string
    ratingValue?: number
  }): Promise<Response> {
    const existing = await prisma.response.findFirst({
      where: {
        surveyId: data.surveyId,
        sessionId: data.sessionId,
        questionId: data.questionId,
      },
    })

    if (existing) {
      return await prisma.response.update({
        where: { id: existing.id },
        data: {
          optionId: data.optionId,
          textValue: data.textValue,
          ratingValue: data.ratingValue,
        },
      })
    } else {
      return this.create(data)
    }
  }

  static async findBySurvey(surveyId: number): Promise<Response[]> {
    return await prisma.response.findMany({
      where: { surveyId },
      orderBy: { createdAt: 'asc' },
    })
  }

  static async findBySession(sessionId: string): Promise<Response[]> {
    return await prisma.response.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    })
  }

  static async getAggregatedResults(surveyId: number): Promise<Array<{
    questionId: number
    questionTitle: string
    questionType: string
    results: Array<{
      optionId?: number
      optionLabel?: string
      count: number
      percentage: number
    }>
  }>> {
    const responses = await prisma.response.findMany({
      where: { surveyId },
      include: {
        question: true,
        option: true,
      },
    })

    // Group by question
    const grouped = responses.reduce((acc, response) => {
      const questionId = response.questionId
      if (!acc[questionId]) {
        acc[questionId] = {
          questionId,
          questionTitle: response.question.title,
          questionType: response.question.type,
          responses: [],
        }
      }
      acc[questionId].responses.push(response)
      return acc
    }, {} as Record<number, any>)

    // Calculate aggregated results
    return Object.values(grouped).map((group: any) => {
      const totalResponses = group.responses.length
      
      if (group.questionType === 'SINGLE_CHOICE' || group.questionType === 'MULTIPLE_CHOICE') {
        // Count by option
        const optionCounts = group.responses.reduce((acc: Record<string, any>, response: any) => {
          const key = response.optionId?.toString() || 'null'
          if (!acc[key]) {
            acc[key] = {
              optionId: response.optionId,
              optionLabel: response.option?.label || 'No answer',
              count: 0,
            }
          }
          acc[key].count++
          return acc
        }, {})

        const results = Object.values(optionCounts).map((option: any) => ({
          ...option,
          percentage: totalResponses > 0 ? (option.count / totalResponses) * 100 : 0,
        }))

        return {
          questionId: group.questionId,
          questionTitle: group.questionTitle,
          questionType: group.questionType,
          results,
        }
      } else if (group.questionType === 'RATING') {
        // Calculate rating distribution
        const ratingCounts = group.responses.reduce((acc: Record<number, number>, response: any) => {
          const rating = response.ratingValue
          if (rating !== null) {
            acc[rating] = (acc[rating] || 0) + 1
          }
          return acc
        }, {})

        const results = Object.entries(ratingCounts).map(([rating, count]) => ({
          optionId: parseInt(rating),
          optionLabel: `${rating} stars`,
          count: count as number,
          percentage: totalResponses > 0 ? ((count as number) / totalResponses) * 100 : 0,
        }))

        return {
          questionId: group.questionId,
          questionTitle: group.questionTitle,
          questionType: group.questionType,
          results,
        }
      } else {
        // For text questions, just return count
        return {
          questionId: group.questionId,
          questionTitle: group.questionTitle,
          questionType: group.questionType,
          results: [{
            optionLabel: 'Text responses',
            count: totalResponses,
            percentage: 100,
          }],
        }
      }
    })
  }
}

export class UserSessionService {
  static async create(data: {
    id: string
    surveyId?: number
    demographicData?: any
    progress?: any
  }): Promise<UserSession> {
    return await prisma.userSession.create({
      data,
    })
  }

  static async findById(id: string): Promise<UserSession | null> {
    return await prisma.userSession.findUnique({
      where: { id },
    })
  }

  static async updateProgress(id: string, progress: any): Promise<UserSession> {
    return await prisma.userSession.update({
      where: { id },
      data: { progress },
    })
  }

  static async markCompleted(id: string): Promise<UserSession> {
    return await prisma.userSession.update({
      where: { id },
      data: { completedAt: new Date() },
    })
  }
}