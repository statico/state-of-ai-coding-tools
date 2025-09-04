import { SessionOptions } from 'iron-session'

export interface SessionData {
  isAuthenticated: boolean
  surveyId?: number
  weeklyPassword?: string
  authenticatedAt?: string
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    'complex-password-at-least-32-characters-long-for-iron-session',
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
