import { SessionOptions } from 'iron-session'

export interface SessionData {
  isAuthenticated: boolean
  surveyId?: number
  weeklyPassword?: string
  authenticatedAt?: string
}

// During build time, we might not have SESSION_SECRET, so use a placeholder
const sessionSecret =
  process.env.SESSION_SECRET ||
  (process.env.NODE_ENV === 'production' && !process.env.BUILDING
    ? (() => {
        throw new Error(
          'SESSION_SECRET environment variable is required. Please set it in your .env file.'
        )
      })()
    : 'development-secret-at-least-32-characters-long')

export const sessionOptions: SessionOptions = {
  password: sessionSecret,
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
