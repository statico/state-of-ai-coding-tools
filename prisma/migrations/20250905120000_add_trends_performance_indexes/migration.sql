-- Add composite indexes for trends query performance
CREATE INDEX IF NOT EXISTS "responses_session_id_created_at_idx" ON "responses"("session_id", "created_at");
CREATE INDEX IF NOT EXISTS "responses_question_id_created_at_idx" ON "responses"("question_id", "created_at");
CREATE INDEX IF NOT EXISTS "responses_created_at_question_id_option_id_idx" ON "responses"("created_at", "question_id", "option_id");

-- Add index for question category filtering
CREATE INDEX IF NOT EXISTS "questions_category_is_active_idx" ON "questions"("category", "is_active");

-- Add index for efficient date range queries with aggregation
CREATE INDEX IF NOT EXISTS "responses_created_at_session_id_question_id_idx" ON "responses"("created_at", "session_id", "question_id");