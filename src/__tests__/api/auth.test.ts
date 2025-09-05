import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock the survey service and password manager
vi.mock('@/lib/services/survey', () => ({
  SurveyService: {
    getCurrentSurvey: vi.fn(),
    verifyPassword: vi.fn(),
  },
}))

vi.mock('@/lib/password-manager', () => ({
  validateWeeklyPassword: vi.fn(),
  getActiveWeeklyPassword: vi.fn(),
}))

vi.mock('@/lib/session', () => ({
  sessionOptions: {
    password: 'test-password-at-least-32-characters-long',
    cookieName: 'test-session',
  },
  SessionData: {},
}))

vi.mock('iron-session', () => ({
  getIronSession: vi.fn(() =>
    Promise.resolve({
      isAuthenticated: false,
      surveyId: undefined,
      save: vi.fn(),
    })
  ),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve({})),
}))

import { POST } from '@/app/api/auth/verify/route'
import { SurveyService } from '@/lib/services/survey'
import {
  validateWeeklyPassword,
  getActiveWeeklyPassword,
} from '@/lib/password-manager'

const mockSurveyService = vi.mocked(SurveyService)
const mockValidateWeeklyPassword = vi.mocked(validateWeeklyPassword)
const mockGetActiveWeeklyPassword = vi.mocked(getActiveWeeklyPassword)

describe('/api/auth/verify', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return success for valid password', async () => {
    const mockSurvey = {
      id: 1,
      title: 'Test Survey',
      description: 'Test description',
    }

    mockSurveyService.getCurrentSurvey.mockResolvedValue(mockSurvey as any)
    mockValidateWeeklyPassword.mockResolvedValue(true)
    mockGetActiveWeeklyPassword.mockResolvedValue('test-password')

    const request = new NextRequest('http://localhost:3000/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ password: 'correct123' }),
      headers: {
        'content-type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.survey).toEqual({
      id: 1,
      title: 'Test Survey',
      description: 'Test description',
    })
    expect(data.currentPassword).toBe('test-password')
  })

  it('should return error for invalid password', async () => {
    const mockSurvey = { id: 1, title: 'Test Survey' }

    mockSurveyService.getCurrentSurvey.mockResolvedValue(mockSurvey as any)
    mockValidateWeeklyPassword.mockResolvedValue(false)

    const request = new NextRequest('http://localhost:3000/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ password: 'wrong123' }),
      headers: {
        'content-type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid password')
  })

  it('should return error when no active survey', async () => {
    mockSurveyService.getCurrentSurvey.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ password: 'any123' }),
      headers: {
        'content-type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('No active survey found')
  })

  it('should return validation error for missing password', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'content-type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid request data')
    expect(data.details).toBeDefined()
  })
})
