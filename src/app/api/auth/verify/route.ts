import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { SurveyService } from '@/lib/services/survey'
import {
  validateWeeklyPassword,
  getActiveWeeklyPassword,
} from '@/lib/password-manager'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from '@/lib/session'
import { cookies } from 'next/headers'

const verifyPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = verifyPasswordSchema.parse(body)

    // Get the current active survey
    const currentSurvey = await SurveyService.getCurrentSurvey()

    if (!currentSurvey) {
      return NextResponse.json(
        { error: 'No active survey found' },
        { status: 404 }
      )
    }

    // Verify weekly password instead of survey password
    const isValid = await validateWeeklyPassword(password)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Get the current password for the session data
    const currentPassword = await getActiveWeeklyPassword()

    // Create iron-session
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions
    )
    session.isAuthenticated = true
    session.surveyId = currentSurvey.id
    session.weeklyPassword = currentPassword || undefined
    session.authenticatedAt = new Date().toISOString()
    await session.save()

    return NextResponse.json({
      success: true,
      survey: {
        id: currentSurvey.id,
        title: currentSurvey.title,
        description: currentSurvey.description,
      },
      currentPassword, // Include password for share functionality
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Password verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
