import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Create surveys table
  await db.schema
    .createTable('surveys')
    .addColumn('id', 'serial', (col) => col.primaryKey().notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('start_date', 'timestamp', (col) => col.notNull())
    .addColumn('end_date', 'timestamp', (col) => col.notNull())
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  // Create questions table
  await db.schema
    .createTable('questions')
    .addColumn('id', 'serial', (col) => col.primaryKey().notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('category', 'text', (col) => col.notNull())
    .addColumn('order_index', 'integer', (col) => col.notNull())
    .addColumn('is_required', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  // Create question_options table
  await db.schema
    .createTable('question_options')
    .addColumn('id', 'serial', (col) => col.primaryKey().notNull())
    .addColumn('question_id', 'integer', (col) => 
      col.notNull().references('questions.id').onDelete('cascade')
    )
    .addColumn('value', 'text', (col) => col.notNull())
    .addColumn('label', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('order_index', 'integer', (col) => col.notNull())
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  // Create user_sessions table
  await db.schema
    .createTable('user_sessions')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('survey_id', 'integer', (col) => 
      col.references('surveys.id').onDelete('set null')
    )
    .addColumn('demographic_data', 'jsonb')
    .addColumn('progress', 'jsonb')
    .addColumn('completed_at', 'timestamp')
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  // Create responses table
  await db.schema
    .createTable('responses')
    .addColumn('id', 'serial', (col) => col.primaryKey().notNull())
    .addColumn('survey_id', 'integer', (col) => 
      col.notNull().references('surveys.id').onDelete('cascade')
    )
    .addColumn('session_id', 'text', (col) => 
      col.notNull().references('user_sessions.id').onDelete('cascade')
    )
    .addColumn('question_id', 'integer', (col) => 
      col.notNull().references('questions.id').onDelete('cascade')
    )
    .addColumn('option_id', 'integer', (col) => 
      col.references('question_options.id').onDelete('set null')
    )
    .addColumn('text_value', 'text')
    .addColumn('rating_value', 'integer')
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  // Add indexes for performance
  await db.schema.createIndex('idx_surveys_is_active').on('surveys').column('is_active').execute()
  await db.schema.createIndex('idx_questions_category').on('questions').column('category').execute()
  await db.schema.createIndex('idx_questions_order').on('questions').column('order_index').execute()
  await db.schema.createIndex('idx_responses_survey_id').on('responses').column('survey_id').execute()
  await db.schema.createIndex('idx_responses_session_id').on('responses').column('session_id').execute()
  await db.schema.createIndex('idx_user_sessions_survey_id').on('user_sessions').column('survey_id').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('responses').execute()
  await db.schema.dropTable('user_sessions').execute()
  await db.schema.dropTable('question_options').execute()
  await db.schema.dropTable('questions').execute()
  await db.schema.dropTable('surveys').execute()
}