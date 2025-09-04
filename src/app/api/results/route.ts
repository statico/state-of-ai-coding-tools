import { NextRequest, NextResponse } from 'next/server'
import { SurveyService } from '@/lib/services/survey'
import { ResponseService } from '@/lib/services/response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const surveyIdParam = searchParams.get('surveyId')

    let surveyId: number

    if (surveyIdParam) {
      surveyId = parseInt(surveyIdParam, 10)
      if (isNaN(surveyId)) {
        return NextResponse.json(
          { error: 'Invalid survey ID' },
          { status: 400 }
        )
      }
    } else {
      // Get current survey if no ID provided
      const currentSurvey = await SurveyService.getCurrentSurvey()
      if (!currentSurvey) {
        return NextResponse.json(
          { error: 'No active survey found' },
          { status: 404 }
        )
      }
      surveyId = currentSurvey.id
    }

    // Get survey details
    const survey = await SurveyService.findById(surveyId)
    if (!survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    // Get aggregated results
    const results = await ResponseService.getAggregatedResults(surveyId)

    return NextResponse.json({
      success: true,
      survey: {
        id: survey.id,
        title: survey.title,
        description: survey.description,
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
