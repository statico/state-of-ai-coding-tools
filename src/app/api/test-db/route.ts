import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const surveys = await prisma.survey.findMany({
      select: {
        id: true,
        title: true,
        password: true,
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      count: surveys.length,
      surveys,
    })
  } catch (error: unknown) {
    console.error('Database test error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    const errorCode = (error as { errorCode?: string })?.errorCode
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        errorCode,
      },
      { status: 500 }
    )
  }
}
