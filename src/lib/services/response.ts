import { prisma } from '@/lib/prisma'
import type { Response, UserSession, Experience, Prisma } from '@prisma/client'

export class ResponseService {
  static async create(data: {
    surveyId: number
    sessionId: string
    questionId: number
    optionId?: number
    textValue?: string
    ratingValue?: number
    writeInValue?: string
    experience?: Experience
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
    writeInValue?: string
    experience?: Experience
  }): Promise<Response> {
    // For multiple choice questions, we need to be more specific to avoid duplicates
    const whereClause = data.optionId
      ? {
          surveyId: data.surveyId,
          sessionId: data.sessionId,
          questionId: data.questionId,
          optionId: data.optionId,
        }
      : {
          surveyId: data.surveyId,
          sessionId: data.sessionId,
          questionId: data.questionId,
        }

    const existing = await prisma.response.findFirst({
      where: whereClause,
    })

    if (existing) {
      return await prisma.response.update({
        where: { id: existing.id },
        data: {
          optionId: data.optionId,
          textValue: data.textValue,
          ratingValue: data.ratingValue,
          writeInValue: data.writeInValue,
          experience: data.experience,
        },
      })
    } else {
      return this.create(data)
    }
  }

  // Helper method to clear existing responses for a question (useful for multiple choice)
  static async clearQuestionResponses(
    surveyId: number,
    sessionId: string,
    questionId: number
  ): Promise<void> {
    await prisma.response.deleteMany({
      where: {
        surveyId,
        sessionId,
        questionId,
      },
    })
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

  static async getAggregatedResults(surveyId: number): Promise<
    Array<{
      questionId: number
      questionTitle: string
      questionType: string
      results: Array<{
        optionId?: number
        optionLabel?: string
        count: number
        percentage: number
        experience?: string
      }>
    }>
  > {
    const responses = await prisma.response.findMany({
      where: { surveyId },
      include: {
        question: true,
        option: true,
      },
    })

    // Group by question
    const grouped = responses.reduce(
      (acc, response) => {
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
      },
      {} as Record<
        number,
        {
          questionId: number
          questionTitle: string
          questionType: string
          responses: Array<(typeof responses)[number]>
        }
      >
    )

    // Calculate aggregated results
    return Object.values(grouped).map(group => {
      const totalResponses = group.responses.length

      if (
        group.questionType === 'SINGLE_CHOICE' ||
        group.questionType === 'MULTIPLE_CHOICE'
      ) {
        // Count by option
        const optionCounts = group.responses.reduce(
          (
            acc: Record<
              string,
              {
                optionId: number | null
                optionLabel: string
                count: number
              }
            >,
            response
          ) => {
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
          },
          {}
        )

        const results = Object.values(optionCounts).map(option => ({
          optionId: option.optionId ?? undefined,
          optionLabel: option.optionLabel,
          count: option.count,
          percentage:
            totalResponses > 0 ? (option.count / totalResponses) * 100 : 0,
        }))

        return {
          questionId: group.questionId,
          questionTitle: group.questionTitle,
          questionType: group.questionType,
          results,
        }
      } else if (group.questionType === 'RATING') {
        // Calculate rating distribution
        const ratingCounts = group.responses.reduce(
          (acc: Record<number, number>, response) => {
            const rating = response.ratingValue
            if (rating !== null) {
              acc[rating] = (acc[rating] || 0) + 1
            }
            return acc
          },
          {}
        )

        const results = Object.entries(ratingCounts).map(([rating, count]) => ({
          optionId: parseInt(rating),
          optionLabel: `${rating} stars`,
          count: count as number,
          percentage:
            totalResponses > 0 ? ((count as number) / totalResponses) * 100 : 0,
        }))

        return {
          questionId: group.questionId,
          questionTitle: group.questionTitle,
          questionType: group.questionType,
          results,
        }
      } else if (group.questionType === 'EXPERIENCE') {
        // For experience questions, aggregate by experience value
        const experienceCounts = group.responses.reduce(
          (acc: Record<string, number>, response) => {
            const exp = response.experience || 'NO_RESPONSE'
            acc[exp] = (acc[exp] || 0) + 1
            return acc
          },
          {}
        )

        const results = Object.entries(experienceCounts).map(
          ([experience, count]) => ({
            optionLabel: experience,
            count: count as number,
            percentage:
              totalResponses > 0
                ? ((count as number) / totalResponses) * 100
                : 0,
            experience,
          })
        )

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
          results: [
            {
              optionLabel: 'Text responses',
              count: totalResponses,
              percentage: 100,
            },
          ],
        }
      }
    })
  }
}

export class UserSessionService {
  static async create(data: {
    id: string
    surveyId?: number | null
    demographicData?: Record<string, unknown> | null
    progress?: Record<string, unknown> | null
  }): Promise<UserSession> {
    return await prisma.userSession.create({
      data: {
        id: data.id,
        surveyId: data.surveyId ?? null,
        demographicData: data.demographicData as Prisma.InputJsonValue,
        progress: data.progress as Prisma.InputJsonValue,
      },
    })
  }

  static async findById(id: string): Promise<UserSession | null> {
    return await prisma.userSession.findUnique({
      where: { id },
    })
  }

  static async updateProgress(
    id: string,
    progress: Record<string, unknown>
  ): Promise<UserSession> {
    return await prisma.userSession.update({
      where: { id },
      data: { progress: progress as Prisma.InputJsonValue },
    })
  }

  static async markCompleted(id: string): Promise<UserSession> {
    return await prisma.userSession.update({
      where: { id },
      data: { completedAt: new Date() },
    })
  }
}
