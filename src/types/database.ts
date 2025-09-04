import type { ColumnType } from 'kysely'

export interface Database {
  surveys: SurveysTable
  questions: QuestionsTable
  question_options: QuestionOptionsTable
  responses: ResponsesTable
  user_sessions: UserSessionsTable
}

export interface SurveysTable {
  id: ColumnType<number, never, never>
  title: string
  description: string | null
  password: string
  start_date: ColumnType<Date, string | Date, string | Date>
  end_date: ColumnType<Date, string | Date, string | Date>
  is_active: ColumnType<boolean, boolean | undefined, boolean>
  created_at: ColumnType<Date, never, never>
  updated_at: ColumnType<Date, never, string | Date>
}

export interface QuestionsTable {
  id: ColumnType<number, never, never>
  title: string
  description: string | null
  type: 'single_choice' | 'multiple_choice' | 'rating' | 'text' | 'demographic'
  category: string
  order_index: number
  is_required: ColumnType<boolean, boolean | undefined, boolean>
  is_active: ColumnType<boolean, boolean | undefined, boolean>
  created_at: ColumnType<Date, never, never>
  updated_at: ColumnType<Date, never, string | Date>
}

export interface QuestionOptionsTable {
  id: ColumnType<number, never, never>
  question_id: number
  value: string
  label: string
  description: string | null
  order_index: number
  is_active: ColumnType<boolean, boolean | undefined, boolean>
  created_at: ColumnType<Date, never, never>
  updated_at: ColumnType<Date, never, string | Date>
}

export interface ResponsesTable {
  id: ColumnType<number, never, never>
  survey_id: number
  session_id: string
  question_id: number
  option_id: number | null
  text_value: string | null
  rating_value: number | null
  created_at: ColumnType<Date, never, never>
  updated_at: ColumnType<Date, never, string | Date>
}

export interface UserSessionsTable {
  id: ColumnType<string, string, never>
  survey_id: number | null
  demographic_data: ColumnType<Record<string, any>, string | Record<string, any>, string | Record<string, any>> | null
  progress: ColumnType<Record<string, any>, string | Record<string, any>, string | Record<string, any>> | null
  completed_at: ColumnType<Date, never, string | Date> | null
  created_at: ColumnType<Date, never, never>
  updated_at: ColumnType<Date, never, string | Date>
}

export type Survey = Selectable<SurveysTable>
export type NewSurvey = Insertable<SurveysTable>
export type SurveyUpdate = Updateable<SurveysTable>

export type Question = Selectable<QuestionsTable>
export type NewQuestion = Insertable<QuestionsTable>
export type QuestionUpdate = Updateable<QuestionsTable>

export type QuestionOption = Selectable<QuestionOptionsTable>
export type NewQuestionOption = Insertable<QuestionOptionsTable>
export type QuestionOptionUpdate = Updateable<QuestionOptionsTable>

export type Response = Selectable<ResponsesTable>
export type NewResponse = Insertable<ResponsesTable>
export type ResponseUpdate = Updateable<ResponsesTable>

export type UserSession = Selectable<UserSessionsTable>
export type NewUserSession = Insertable<UserSessionsTable>
export type UserSessionUpdate = Updateable<UserSessionsTable>

// Import Kysely utility types
import type { Selectable, Insertable, Updateable } from 'kysely'