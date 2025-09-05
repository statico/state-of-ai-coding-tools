import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { SURVEY_TITLE, SURVEY_DESCRIPTION } from '@/lib/constants'
import { validatePassword, getPassword } from '@/lib/password-manager'
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

    // Verify password from environment variable
    const isValid = await validatePassword(password)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Get the current password for the session data
    const currentPassword = getPassword()

    // Create iron-session
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions
    )
    session.isAuthenticated = true
    session.password = currentPassword
    session.authenticatedAt = new Date().toISOString()
    await session.save()

    return NextResponse.json({
      success: true,
      survey: {
        title: SURVEY_TITLE,
        description: SURVEY_DESCRIPTION,
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
