import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { UserSessionService } from '@/lib/services/response'

export async function POST() {
  try {
    // Generate a cryptographically secure UUID server-side
    const sessionId = uuidv4()

    // Create the session in the database
    await UserSessionService.create({
      id: sessionId,
      demographicData: null,
      progress: null,
    })

    return NextResponse.json({
      success: true,
      sessionId,
    })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
