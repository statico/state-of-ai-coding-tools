import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Prisma first, before any imports
vi.mock('@/lib/prisma', () => ({
  prisma: {
    survey: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}))

import { SurveyService } from '@/lib/services/survey'
import { prisma } from '@/lib/prisma'

const mockPrisma = prisma as any

describe('SurveyService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new survey', async () => {
      const surveyData = {
        title: 'Test Survey',
        description: 'A test survey',
        password: 'test123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2030-12-31'),
        isActive: true,
      }

      const mockSurvey = {
        id: 1,
        ...surveyData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockPrisma.survey.create.mockResolvedValue(mockSurvey)

      const result = await SurveyService.create(surveyData)

      expect(mockPrisma.survey.create).toHaveBeenCalledWith({
        data: surveyData,
      })
      expect(result).toEqual(mockSurvey)
    })
  })

  describe('findById', () => {
    it('should find a survey by ID', async () => {
      const mockSurvey = {
        id: 1,
        title: 'Test Survey',
        password: 'test123',
        createdAt: new Date(),
      }
      mockPrisma.survey.findUnique.mockResolvedValue(mockSurvey as any)

      const result = await SurveyService.findById(1)

      expect(mockPrisma.survey.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      })
      expect(result).toEqual(mockSurvey)
    })

    it('should return null if survey not found', async () => {
      mockPrisma.survey.findUnique.mockResolvedValue(null)

      const result = await SurveyService.findById(999)

      expect(result).toBeNull()
    })
  })

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      mockPrisma.survey.findUnique.mockResolvedValue({ password: 'correct123' })

      const result = await SurveyService.verifyPassword(1, 'correct123')

      expect(result).toBe(true)
    })

    it('should return false for incorrect password', async () => {
      mockPrisma.survey.findUnique.mockResolvedValue({ password: 'correct123' })

      const result = await SurveyService.verifyPassword(1, 'wrong123')

      expect(result).toBe(false)
    })

    it('should return false if survey not found', async () => {
      mockPrisma.survey.findUnique.mockResolvedValue(null)

      const result = await SurveyService.verifyPassword(999, 'any123')

      expect(result).toBe(false)
    })
  })

  describe('getCurrentSurvey', () => {
    it('should return active survey within date range', async () => {
      const mockSurvey = {
        id: 1,
        title: 'Current Survey',
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2030-12-31'),
      }
      mockPrisma.survey.findFirst.mockResolvedValue(mockSurvey as any)

      const result = await SurveyService.getCurrentSurvey()

      expect(mockPrisma.survey.findFirst).toHaveBeenCalledWith({
        where: {
          isActive: true,
          startDate: { lte: expect.any(Date) },
          endDate: { gte: expect.any(Date) },
        },
        orderBy: { createdAt: 'desc' },
      })
      expect(result).toEqual(mockSurvey)
    })
  })
})
