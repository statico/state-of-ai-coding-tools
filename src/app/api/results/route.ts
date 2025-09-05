import { NextResponse } from 'next/server'
import { SURVEY_TITLE, SURVEY_DESCRIPTION } from '@/lib/constants'
import { ResponseService } from '@/lib/services/response'

export async function GET() {
  try {
    // Get aggregated results
    const results = await ResponseService.getAggregatedResults()

    return NextResponse.json({
      success: true,
      survey: {
        title: SURVEY_TITLE,
        description: SURVEY_DESCRIPTION,
      },
      results,
    })
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
