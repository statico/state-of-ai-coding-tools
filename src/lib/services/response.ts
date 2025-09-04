import { db } from '@/lib/db'
import type { Response, NewResponse, UserSession, NewUserSession } from '@/types/database'

export class ResponseService {
  static async create(data: NewResponse): Promise<Response> {
    return await db
      .insertInto('responses')
      .values(data)
      .returning([
        'id',
        'survey_id',
        'session_id',
        'question_id',
        'option_id',
        'text_value',
        'rating_value',
        'created_at',
        'updated_at',
      ])
      .executeTakeFirstOrThrow()
  }

  static async createOrUpdate(data: NewResponse): Promise<Response> {
    // First try to find existing response
    const existing = await db
      .selectFrom('responses')
      .selectAll()
      .where('survey_id', '=', data.survey_id)
      .where('session_id', '=', data.session_id)
      .where('question_id', '=', data.question_id)
      .executeTakeFirst()

    if (existing) {
      // Update existing response
      return await db
        .updateTable('responses')
        .set({
          option_id: data.option_id,
          text_value: data.text_value,
          rating_value: data.rating_value,
          updated_at: new Date(),
        })
        .where('id', '=', existing.id)
        .returning([
          'id',
          'survey_id',
          'session_id',
          'question_id',
          'option_id',
          'text_value',
          'rating_value',
          'created_at',
          'updated_at',
        ])
        .executeTakeFirstOrThrow()
    } else {
      // Create new response
      return this.create(data)
    }
  }

  static async findBySurvey(surveyId: number): Promise<Response[]> {
    return await db
      .selectFrom('responses')
      .selectAll()
      .where('survey_id', '=', surveyId)
      .orderBy('created_at', 'asc')
      .execute()
  }

  static async findBySession(sessionId: string): Promise<Response[]> {
    return await db
      .selectFrom('responses')
      .selectAll()
      .where('session_id', '=', sessionId)
      .orderBy('created_at', 'asc')
      .execute()
  }

  static async getAggregatedResults(surveyId: number): Promise<Array<{
    question_id: number
    question_title: string
    question_type: string
    results: Array<{
      option_id?: number
      option_label?: string
      count: number
      percentage: number
    }>
  }>> {
    // Get all responses with question and option details
    const results = await db
      .selectFrom('responses')
      .innerJoin('questions', 'responses.question_id', 'questions.id')
      .leftJoin('question_options', 'responses.option_id', 'question_options.id')
      .select([
        'responses.question_id',
        'questions.title as question_title',
        'questions.type as question_type',
        'responses.option_id',
        'question_options.label as option_label',
        'responses.text_value',
        'responses.rating_value',
      ])
      .where('responses.survey_id', '=', surveyId)
      .execute()

    // Group by question and aggregate results
    const grouped = results.reduce((acc, row) => {
      const key = row.question_id
      if (!acc[key]) {
        acc[key] = {
          question_id: row.question_id,
          question_title: row.question_title,
          question_type: row.question_type,
          responses: [],
        }
      }
      acc[key].responses.push(row)
      return acc
    }, {} as Record<number, any>)

    // Calculate aggregated results
    return Object.values(grouped).map((group: any) => {
      const totalResponses = group.responses.length
      
      if (group.question_type === 'single_choice' || group.question_type === 'multiple_choice') {
        // Count by option
        const optionCounts = group.responses.reduce((acc: Record<string, any>, response: any) => {
          const key = response.option_id?.toString() || 'null'
          if (!acc[key]) {
            acc[key] = {
              option_id: response.option_id,
              option_label: response.option_label || 'No answer',
              count: 0,
            }
          }
          acc[key].count++
          return acc
        }, {})

        const results = Object.values(optionCounts).map((option: any) => ({
          ...option,
          percentage: totalResponses > 0 ? (option.count / totalResponses) * 100 : 0,
        }))

        return {
          question_id: group.question_id,
          question_title: group.question_title,
          question_type: group.question_type,
          results,
        }
      } else if (group.question_type === 'rating') {
        // Calculate rating distribution
        const ratingCounts = group.responses.reduce((acc: Record<number, number>, response: any) => {
          const rating = response.rating_value
          if (rating !== null) {
            acc[rating] = (acc[rating] || 0) + 1
          }
          return acc
        }, {})

        const results = Object.entries(ratingCounts).map(([rating, count]) => ({
          option_id: parseInt(rating),
          option_label: `${rating} stars`,
          count: count as number,
          percentage: totalResponses > 0 ? ((count as number) / totalResponses) * 100 : 0,
        }))

        return {
          question_id: group.question_id,
          question_title: group.question_title,
          question_type: group.question_type,
          results,
        }
      } else {
        // For text questions, just return count
        return {
          question_id: group.question_id,
          question_title: group.question_title,
          question_type: group.question_type,
          results: [{
            option_label: 'Text responses',
            count: totalResponses,
            percentage: 100,
          }],
        }
      }
    })
  }
}

export class UserSessionService {
  static async create(data: NewUserSession): Promise<UserSession> {
    return await db
      .insertInto('user_sessions')
      .values(data)
      .returning([
        'id',
        'survey_id',
        'demographic_data',
        'progress',
        'completed_at',
        'created_at',
        'updated_at',
      ])
      .executeTakeFirstOrThrow()
  }

  static async findById(id: string): Promise<UserSession | undefined> {
    return await db
      .selectFrom('user_sessions')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
  }

  static async updateProgress(id: string, progress: Record<string, any>): Promise<UserSession> {
    return await db
      .updateTable('user_sessions')
      .set({ progress, updated_at: new Date() })
      .where('id', '=', id)
      .returning([
        'id',
        'survey_id',
        'demographic_data',
        'progress',
        'completed_at',
        'created_at',
        'updated_at',
      ])
      .executeTakeFirstOrThrow()
  }

  static async markCompleted(id: string): Promise<UserSession> {
    return await db
      .updateTable('user_sessions')
      .set({ completed_at: new Date(), updated_at: new Date() })
      .where('id', '=', id)
      .returning([
        'id',
        'survey_id',
        'demographic_data',
        'progress',
        'completed_at',
        'created_at',
        'updated_at',
      ])
      .executeTakeFirstOrThrow()
  }
}