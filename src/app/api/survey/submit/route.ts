import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ResponseService, UserSessionService } from '@/lib/services/response'

const submitResponseSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  surveyId: z.number(),
  responses: z.array(z.object({
    questionId: z.number(),
    optionId: z.number().optional(),
    optionIds: z.array(z.number()).optional(),
    textValue: z.string().optional(),
    ratingValue: z.number().min(1).max(5).optional(),
  })),
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
    }

    // Save all responses
    for (const response of responses) {
      // Handle multiple choice questions
      if (response.optionIds && response.optionIds.length > 0) {
        // Clear existing responses for this question first
        await ResponseService.clearQuestionResponses(surveyId, sessionId, response.questionId)
        
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
        // Handle single choice, rating, and text questions
        await ResponseService.createOrUpdate({
          surveyId,
          sessionId,
          questionId: response.questionId,
          optionId: response.optionId,
          textValue: response.textValue,
          ratingValue: response.ratingValue,
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