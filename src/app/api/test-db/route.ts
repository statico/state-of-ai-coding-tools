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
  } catch (error: any) {
    console.error('Database test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        errorCode: error.errorCode,
      },
      { status: 500 }
    )
  }
}