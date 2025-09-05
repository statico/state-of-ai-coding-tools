-- Drop foreign key constraints
ALTER TABLE "responses" DROP CONSTRAINT IF EXISTS "responses_survey_id_fkey";
ALTER TABLE "user_sessions" DROP CONSTRAINT IF EXISTS "user_sessions_survey_id_fkey";
ALTER TABLE "experience_metrics" DROP CONSTRAINT IF EXISTS "experience_metrics_survey_id_fkey";

-- Drop existing unique constraint on experience_metrics
ALTER TABLE "experience_metrics" DROP CONSTRAINT IF EXISTS "experience_metrics_survey_id_tool_name_key";

-- Drop survey_id columns
ALTER TABLE "responses" DROP COLUMN "survey_id";
ALTER TABLE "user_sessions" DROP COLUMN "survey_id";
ALTER TABLE "experience_metrics" DROP COLUMN "survey_id";

-- Add new unique constraint on tool_name only
ALTER TABLE "experience_metrics" ADD CONSTRAINT "experience_metrics_tool_name_key" UNIQUE ("tool_name");

-- Drop the surveys table
DROP TABLE IF EXISTS "surveys";