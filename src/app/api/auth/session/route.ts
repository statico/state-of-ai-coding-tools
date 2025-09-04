import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from '@/lib/session'
import { cookies } from 'next/headers'
import { SurveyService } from '@/lib/services/survey'
import { getActiveWeeklyPassword } from '@/lib/password-manager'

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)
    
    if (!session.isAuthenticated) {
      return NextResponse.json({
        isAuthenticated: false
      })
    }
    
    // Get current survey
    const currentSurvey = await SurveyService.getCurrentSurvey()
    
    if (!currentSurvey) {
      return NextResponse.json({
        isAuthenticated: false,
        error: 'No active survey'
      })
    }
    
    // Get current password for sharing
    const currentPassword = await getActiveWeeklyPassword()
    
    return NextResponse.json({
      isAuthenticated: true,
      survey: {
        id: currentSurvey.id,
        title: currentSurvey.title,
        description: currentSurvey.description,
      },
      currentPassword,
      authenticatedAt: session.authenticatedAt
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({
      isAuthenticated: false,
      error: 'Session check failed'
    }, { status: 500 })
  }
}