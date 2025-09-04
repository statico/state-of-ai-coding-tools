import { NextRequest, NextResponse } from 'next/server'
import { UserSessionService } from '@/lib/services/response'
import { z } from 'zod'

const checkSubmissionSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId } = checkSubmissionSchema.parse(body)

    const session = await UserSessionService.findById(sessionId)

    if (!session) {
      return NextResponse.json({ hasSubmitted: false })
    }

    if (session.completedAt) {
      const completedDate = new Date(session.completedAt)
      const now = new Date()
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay()) // Start of current week
      weekStart.setHours(0, 0, 0, 0)

      if (completedDate >= weekStart) {
        return NextResponse.json({
          hasSubmitted: true,
          submittedAt: session.completedAt,
          message: 'You have already submitted your responses for this week',
        })
      }
    }

    return NextResponse.json({ hasSubmitted: false })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Check submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
