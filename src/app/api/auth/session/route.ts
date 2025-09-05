import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from '@/lib/session'
import { cookies } from 'next/headers'
import { SURVEY_TITLE, SURVEY_DESCRIPTION } from '@/lib/constants'
import { getPassword } from '@/lib/password-manager'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions
    )

    if (!session.isAuthenticated) {
      return NextResponse.json({
        isAuthenticated: false,
      })
    }

    // Get current password for sharing
    const currentPassword = getPassword()

    return NextResponse.json({
      isAuthenticated: true,
      survey: {
        title: SURVEY_TITLE,
        description: SURVEY_DESCRIPTION,
      },
      currentPassword,
      authenticatedAt: session.authenticatedAt,
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      {
        isAuthenticated: false,
        error: 'Session check failed',
      },
      { status: 500 }
    )
  }
}
