import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { QuestionService } from '@/lib/services/question'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const weeksParam = searchParams.get('weeks')
    const weeks = weeksParam ? parseInt(weeksParam, 10) : 12

    // Get all active questions with their options
    const questionsWithOptions = await QuestionService.getAllWithOptions()

    // Get all surveys to map to weeks (reserved for future use)
    // const surveys = await prisma.survey.findMany({
    //   orderBy: { createdAt: 'desc' },
    //   take: weeks,
    // })

    // Create week range data
    const trendData = []
    const today = new Date()

    for (let i = 0; i < weeks; i++) {
      const weekOffset = weeks - i - 1
      const weekStart = new Date(today)
      const dayOfWeek = today.getDay()
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      weekStart.setDate(today.getDate() - daysToMonday - weekOffset * 7)
      weekStart.setHours(0, 0, 0, 0)

      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      // Get all responses for this week
      const responses = await prisma.response.findMany({
        where: {
          createdAt: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
        include: {
          question: true,
        },
      })

      // Get unique session count for response count
      const uniqueSessions = new Set(responses.map(r => r.sessionId))

      // Process data for each question
      const weekData: Record<string, number | string> = {
        week: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        responses: uniqueSessions.size,
      }

      // For each question, calculate metrics
      for (const { question, options } of questionsWithOptions) {
        const questionResponses = responses.filter(
          r => r.questionId === question.id
        )

        if (questionResponses.length === 0) {
          weekData[`q_${question.id}_total`] = 0
          continue
        }

        weekData[`q_${question.id}_total`] = questionResponses.length

        // Calculate metrics based on question type
        switch (question.type) {
          case 'SINGLE_CHOICE':
          case 'DEMOGRAPHIC':
            // Track the most popular option percentage
            const optionCounts: Record<number, number> = {}
            questionResponses.forEach(r => {
              if (r.optionId) {
                optionCounts[r.optionId] = (optionCounts[r.optionId] || 0) + 1
              }
            })

            // Store percentages for each option
            options.forEach(opt => {
              const count = optionCounts[opt.id] || 0
              const percentage =
                questionResponses.length > 0
                  ? Math.round((count / questionResponses.length) * 100)
                  : 0
              weekData[`q_${question.id}_opt_${opt.id}`] = percentage
            })
            break

          case 'MULTIPLE_CHOICE':
            // Track selection count for each option
            // Multiple choice questions store each selected option as a separate response
            const multiOptionCounts: Record<number, number> = {}
            questionResponses.forEach(r => {
              if (r.optionId) {
                multiOptionCounts[r.optionId] =
                  (multiOptionCounts[r.optionId] || 0) + 1
              }
            })

            options.forEach(opt => {
              const count = multiOptionCounts[opt.id] || 0
              const percentage =
                questionResponses.length > 0
                  ? Math.round((count / questionResponses.length) * 100)
                  : 0
              weekData[`q_${question.id}_opt_${opt.id}`] = percentage
            })
            break

          case 'RATING':
            // Calculate average rating
            const ratings = questionResponses
              .map(r => r.ratingValue)
              .filter(r => r !== null) as number[]

            if (ratings.length > 0) {
              const avgRating =
                ratings.reduce((a, b) => a + b, 0) / ratings.length
              weekData[`q_${question.id}_avg`] = Math.round(avgRating * 10) / 10
            } else {
              weekData[`q_${question.id}_avg`] = 0
            }
            break

          case 'EXPERIENCE':
            // Track experience levels
            const experienceCounts = {
              NEVER_HEARD: 0,
              WANT_TO_TRY: 0,
              NOT_INTERESTED: 0,
              WOULD_USE_AGAIN: 0,
              WOULD_NOT_USE: 0,
            }

            questionResponses.forEach(r => {
              if (r.experience && r.experience in experienceCounts) {
                experienceCounts[
                  r.experience as keyof typeof experienceCounts
                ]++
              }
            })

            Object.entries(experienceCounts).forEach(([exp, count]) => {
              const percentage =
                questionResponses.length > 0
                  ? Math.round((count / questionResponses.length) * 100)
                  : 0
              weekData[`q_${question.id}_${exp.toLowerCase()}`] = percentage
            })
            break

          case 'TEXT':
            // Just count how many text responses
            weekData[`q_${question.id}_count`] = questionResponses.filter(
              r => r.textValue
            ).length
            break
        }
      }

      trendData.push(weekData)
    }

    return NextResponse.json({
      success: true,
      trends: trendData,
      questions: questionsWithOptions.map(({ question, options }) => ({
        id: question.id,
        title: question.title,
        type: question.type,
        category: question.category,
        options: options.map(opt => ({
          id: opt.id,
          label: opt.label,
        })),
      })),
    })
  } catch (error) {
    console.error('Error fetching trends:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
