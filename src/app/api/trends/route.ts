import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { QuestionService } from '@/lib/services/question'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const weeksParam = searchParams.get('weeks')
    const weeks = weeksParam ? parseInt(weeksParam, 10) : 12
    const categoryFilter = searchParams.get('category')

    // Calculate date range
    const today = new Date()
    const dayOfWeek = today.getDay()
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    const oldestWeekStart = new Date(today)
    oldestWeekStart.setDate(today.getDate() - daysToMonday - (weeks - 1) * 7)
    oldestWeekStart.setHours(0, 0, 0, 0)

    const newestWeekEnd = new Date(today)
    newestWeekEnd.setDate(today.getDate() - daysToMonday + 6)
    newestWeekEnd.setHours(23, 59, 59, 999)

    // For overview, use optimized SQL
    if (categoryFilter === 'overview') {
      const weeklyStats = await prisma.$queryRaw<
        Array<{
          week_start: Date
          week_end: Date
          unique_sessions: bigint
        }>
      >(Prisma.sql`
        WITH RECURSIVE weeks AS (
          SELECT 
            DATE_TRUNC('week', ${oldestWeekStart}::timestamp)::date AS week_start,
            (DATE_TRUNC('week', ${oldestWeekStart}::timestamp) + INTERVAL '6 days')::date AS week_end
          UNION ALL
          SELECT 
            (week_start + INTERVAL '7 days')::date,
            (week_end + INTERVAL '7 days')::date
          FROM weeks
          WHERE week_start < DATE_TRUNC('week', ${newestWeekEnd}::timestamp)::date
        )
        SELECT 
          w.week_start,
          w.week_end,
          COUNT(DISTINCT r.session_id) as unique_sessions
        FROM weeks w
        LEFT JOIN responses r ON 
          DATE(r.created_at) >= w.week_start AND 
          DATE(r.created_at) <= w.week_end
        GROUP BY w.week_start, w.week_end
        ORDER BY w.week_start
      `)

      const trendData = weeklyStats.map(stat => ({
        week: `${new Date(stat.week_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(stat.week_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        weekStart: stat.week_start.toISOString(),
        weekEnd: stat.week_end.toISOString(),
        responses: Number(stat.unique_sessions),
      }))

      const response = NextResponse.json({
        success: true,
        trends: trendData,
        questions: [],
      })

      response.headers.set(
        'Cache-Control',
        'public, s-maxage=300, stale-while-revalidate'
      )
      return response
    }

    // For category-specific data, get questions first
    const questionsWithOptions = categoryFilter
      ? await prisma.question
          .findMany({
            where: {
              isActive: true,
              category: categoryFilter,
            },
            include: {
              options: {
                where: { isActive: true },
                orderBy: { orderIndex: 'asc' },
              },
            },
            orderBy: { orderIndex: 'asc' },
          })
          .then(questions =>
            questions.map(q => ({
              question: q,
              options: q.options,
            }))
          )
      : await QuestionService.getAllWithOptions()

    // Use efficient batched queries per week instead of complex recursive SQL
    const trendData = []

    for (let i = 0; i < weeks; i++) {
      const weekOffset = weeks - i - 1
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - daysToMonday - weekOffset * 7)
      weekStart.setHours(0, 0, 0, 0)

      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      // Single optimized query per week with joins
      const weeklyData = categoryFilter
        ? await prisma.$queryRaw<
            Array<{
              session_id: string
              question_id: number
              option_id: number | null
              rating_value: number | null
              text_value: string | null
              experience: string | null
            }>
          >(Prisma.sql`
            SELECT DISTINCT
              r.session_id,
              r.question_id,
              r.option_id,
              r.rating_value,
              r.text_value,
              r.experience
            FROM responses r
            JOIN questions q ON r.question_id = q.id
            WHERE 
              r.created_at >= ${weekStart}::timestamp
              AND r.created_at <= ${weekEnd}::timestamp
              AND q.is_active = true
              AND q.category = ${categoryFilter}
          `)
        : await prisma.$queryRaw<
            Array<{
              session_id: string
              question_id: number
              option_id: number | null
              rating_value: number | null
              text_value: string | null
              experience: string | null
            }>
          >(Prisma.sql`
            SELECT DISTINCT
              r.session_id,
              r.question_id,
              r.option_id,
              r.rating_value,
              r.text_value,
              r.experience
            FROM responses r
            JOIN questions q ON r.question_id = q.id
            WHERE 
              r.created_at >= ${weekStart}::timestamp
              AND r.created_at <= ${weekEnd}::timestamp
              AND q.is_active = true
          `)

      // Get unique session count for response count
      const uniqueSessions = new Set(weeklyData.map(r => r.session_id))

      // Process data for each question
      const weekData: Record<string, number | string> = {
        week: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        responses: uniqueSessions.size,
      }

      // Process data for each question
      for (const { question, options } of questionsWithOptions) {
        const questionResponses = weeklyData.filter(
          r => r.question_id === question.id
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
            const optionCounts: Record<number, number> = {}
            questionResponses.forEach(r => {
              if (r.option_id !== null && r.option_id !== undefined) {
                optionCounts[r.option_id] = (optionCounts[r.option_id] || 0) + 1
              }
            })

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
            const multiOptionCounts: Record<number, number> = {}
            questionResponses.forEach(r => {
              if (r.option_id !== null && r.option_id !== undefined) {
                multiOptionCounts[r.option_id] =
                  (multiOptionCounts[r.option_id] || 0) + 1
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
            const ratings = questionResponses
              .map(r => r.rating_value)
              .filter((r): r is number => r !== null)

            if (ratings.length > 0) {
              const avgRating =
                ratings.reduce((a, b) => a + b, 0) / ratings.length
              weekData[`q_${question.id}_avg`] = Math.round(avgRating * 10) / 10
            } else {
              weekData[`q_${question.id}_avg`] = 0
            }
            break

          case 'EXPERIENCE':
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
            weekData[`q_${question.id}_count`] = questionResponses.filter(
              r => r.text_value
            ).length
            break
        }
      }

      trendData.push(weekData)
    }

    const response = NextResponse.json({
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

    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate'
    )
    return response
  } catch (error) {
    console.error('Error fetching trends:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
