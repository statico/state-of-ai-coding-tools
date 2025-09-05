import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ResponseService, UserSessionService } from '@/lib/services/response'
import type { Experience } from '@prisma/client'

const submitResponseSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  surveyId: z.number(),
  responses: z.array(
    z.object({
      questionId: z.number(),
      optionId: z.number().optional(),
      optionIds: z.array(z.number()).optional(),
      textValue: z.string().optional(),
      ratingValue: z.number().min(1).max(5).optional(),
      writeInValue: z.string().optional(),
      experienceLevel: z.string().optional(),
      sentimentScore: z.string().optional(),
    })
  ),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, surveyId, responses } = submitResponseSchema.parse(body)

    // Create user session if it doesn't exist
    let session = await UserSessionService.findById(sessionId)
    if (!session) {
      session = await UserSessionService.create({
        id: sessionId,
        surveyId,
      })
    } else if (session.completedAt) {
      // Check if session has already completed the survey this week
      const completedDate = new Date(session.completedAt)
      const now = new Date()
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay()) // Start of current week
      weekStart.setHours(0, 0, 0, 0)

      if (completedDate >= weekStart) {
        return NextResponse.json(
          { error: 'You have already submitted your responses for this week' },
          { status: 400 }
        )
      }
    }

    // Save all responses
    for (const response of responses) {
      // Handle multiple choice questions
      if (response.optionIds && response.optionIds.length > 0) {
        // Clear existing responses for this question first
        await ResponseService.clearQuestionResponses(
          surveyId,
          sessionId,
          response.questionId
        )

        // Add new responses
        for (const optionId of response.optionIds) {
          await ResponseService.create({
            surveyId,
            sessionId,
            questionId: response.questionId,
            optionId,
          })
        }
      } else {
        // Handle single choice, rating, text, and experience questions
        await ResponseService.createOrUpdate({
          surveyId,
          sessionId,
          questionId: response.questionId,
          optionId: response.optionId,
          textValue: response.textValue,
          ratingValue: response.ratingValue,
          writeInValue: response.writeInValue,
          experience: response.experienceLevel as Experience | undefined,
        })
      }
    }

    // Mark session as completed
    await UserSessionService.markCompleted(sessionId)

    return NextResponse.json({
      success: true,
      message: 'Responses submitted successfully',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Survey submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
