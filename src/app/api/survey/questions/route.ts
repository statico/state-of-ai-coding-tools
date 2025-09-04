import { NextResponse } from 'next/server'
import { QuestionService } from '@/lib/services/question'

export async function GET() {
  try {
    const questionsWithOptions = await QuestionService.getAllWithOptions()

    return NextResponse.json({
      success: true,
      questions: questionsWithOptions,
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}