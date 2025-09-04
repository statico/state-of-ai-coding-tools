import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const protectedPaths = ['/api/survey/questions', '/api/survey/submit']
  const pathname = request.nextUrl.pathname

  // Check if the request is for a protected API route
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const response = NextResponse.next()
    const session = await getIronSession<SessionData>(
      request,
      response,
      sessionOptions
    )

    if (!session.isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
