import { db } from '@/lib/db'
import type { Survey, NewSurvey, SurveyUpdate } from '@/types/database'

export class SurveyService {
  static async create(data: NewSurvey): Promise<Survey> {
    return await db
      .insertInto('surveys')
      .values(data)
      .returning([
        'id',
        'title',
        'description',
        'password',
        'start_date',
        'end_date',
        'is_active',
        'created_at',
        'updated_at',
      ])
      .executeTakeFirstOrThrow()
  }

  static async findById(id: number): Promise<Survey | undefined> {
    return await db
      .selectFrom('surveys')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
  }

  static async findActive(): Promise<Survey[]> {
    return await db
      .selectFrom('surveys')
      .selectAll()
      .where('is_active', '=', true)
      .where('start_date', '<=', new Date())
      .where('end_date', '>=', new Date())
      .orderBy('created_at', 'desc')
      .execute()
  }

  static async getCurrentSurvey(): Promise<Survey | undefined> {
    return await db
      .selectFrom('surveys')
      .selectAll()
      .where('is_active', '=', true)
      .where('start_date', '<=', new Date())
      .where('end_date', '>=', new Date())
      .orderBy('created_at', 'desc')
      .executeTakeFirst()
  }

  static async update(id: number, data: SurveyUpdate): Promise<Survey> {
    return await db
      .updateTable('surveys')
      .set({ ...data, updated_at: new Date() })
      .where('id', '=', id)
      .returning([
        'id',
        'title',
        'description',
        'password',
        'start_date',
        'end_date',
        'is_active',
        'created_at',
        'updated_at',
      ])
      .executeTakeFirstOrThrow()
  }

  static async verifyPassword(id: number, password: string): Promise<boolean> {
    const survey = await db
      .selectFrom('surveys')
      .select(['password'])
      .where('id', '=', id)
      .executeTakeFirst()

    return survey?.password === password
  }
}