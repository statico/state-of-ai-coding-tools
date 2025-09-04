import { db } from '@/lib/db'
import type { Question, NewQuestion, QuestionOption, NewQuestionOption } from '@/types/database'

export class QuestionService {
  static async create(data: NewQuestion): Promise<Question> {
    return await db
      .insertInto('questions')
      .values(data)
      .returning([
        'id',
        'title',
        'description',
        'type',
        'category',
        'order_index',
        'is_required',
        'is_active',
        'created_at',
        'updated_at',
      ])
      .executeTakeFirstOrThrow()
  }

  static async findByCategory(category: string): Promise<Question[]> {
    return await db
      .selectFrom('questions')
      .selectAll()
      .where('category', '=', category)
      .where('is_active', '=', true)
      .orderBy('order_index', 'asc')
      .execute()
  }

  static async findAll(): Promise<Question[]> {
    return await db
      .selectFrom('questions')
      .selectAll()
      .where('is_active', '=', true)
      .orderBy('category', 'asc')
      .orderBy('order_index', 'asc')
      .execute()
  }

  static async findWithOptions(questionId: number): Promise<{
    question: Question
    options: QuestionOption[]
  } | undefined> {
    const question = await db
      .selectFrom('questions')
      .selectAll()
      .where('id', '=', questionId)
      .where('is_active', '=', true)
      .executeTakeFirst()

    if (!question) {
      return undefined
    }

    const options = await db
      .selectFrom('question_options')
      .selectAll()
      .where('question_id', '=', questionId)
      .where('is_active', '=', true)
      .orderBy('order_index', 'asc')
      .execute()

    return { question, options }
  }

  static async getAllWithOptions(): Promise<Array<{
    question: Question
    options: QuestionOption[]
  }>> {
    const questions = await this.findAll()
    
    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        const options = await db
          .selectFrom('question_options')
          .selectAll()
          .where('question_id', '=', question.id)
          .where('is_active', '=', true)
          .orderBy('order_index', 'asc')
          .execute()

        return { question, options }
      })
    )

    return questionsWithOptions
  }

  static async createOption(data: NewQuestionOption): Promise<QuestionOption> {
    return await db
      .insertInto('question_options')
      .values(data)
      .returning([
        'id',
        'question_id',
        'value',
        'label',
        'description',
        'order_index',
        'is_active',
        'created_at',
        'updated_at',
      ])
      .executeTakeFirstOrThrow()
  }
}