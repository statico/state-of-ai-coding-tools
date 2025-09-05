import { SessionOptions } from 'iron-session'

export interface SessionData {
  isAuthenticated: boolean
  surveyId?: number
  weeklyPassword?: string
  authenticatedAt?: string
}

if (!process.env.SESSION_SECRET) {
  throw new Error(
    'SESSION_SECRET environment variable is required. Please set it in your .env file.'
  )
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'ai-coding-tools-survey-session',
  ttl: 60 * 60 * 24 * 7, // 7 days
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  },
}

export const defaultSession: SessionData = {
  isAuthenticated: false,
}
