import { prisma } from '@/lib/prisma'
import type { Question, QuestionOption, QuestionType } from '@prisma/client'

export class QuestionService {
  static async create(data: {
    title: string
    description?: string
    type: QuestionType
    category: string
    orderIndex: number
    isRequired?: boolean
    isActive?: boolean
  }): Promise<Question> {
    return await prisma.question.create({
      data,
    })
  }

  static async findByCategory(category: string): Promise<Question[]> {
    return await prisma.question.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: { orderIndex: 'asc' },
    })
  }

  static async findAll(): Promise<Question[]> {
    return await prisma.question.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { orderIndex: 'asc' }],
    })
  }

  static async findWithOptions(questionId: number): Promise<{
    question: Question
    options: QuestionOption[]
  } | null> {
    const question = await prisma.question.findUnique({
      where: { id: questionId, isActive: true },
      include: {
        options: {
          where: { isActive: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
    })

    if (!question) return null

    return {
      question: {
        id: question.id,
        title: question.title,
        description: question.description,
        type: question.type,
        category: question.category,
        orderIndex: question.orderIndex,
        isRequired: question.isRequired,
        isActive: question.isActive,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      },
      options: question.options,
    }
  }

  static async getAllWithOptions(): Promise<
    Array<{
      question: Question
      options: QuestionOption[]
    }>
  > {
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      include: {
        options: {
          where: { isActive: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: [{ category: 'asc' }, { orderIndex: 'asc' }],
    })

    return questions.map(question => ({
      question: {
        id: question.id,
        title: question.title,
        description: question.description,
        type: question.type,
        category: question.category,
        orderIndex: question.orderIndex,
        isRequired: question.isRequired,
        isActive: question.isActive,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      },
      options: question.options,
    }))
  }

  static async createOption(data: {
    questionId: number
    value: string
    label: string
    description?: string
    orderIndex: number
    isActive?: boolean
  }): Promise<QuestionOption> {
    return await prisma.questionOption.create({
      data,
    })
  }
}
