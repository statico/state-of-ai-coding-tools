-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'RATING', 'TEXT', 'DEMOGRAPHIC', 'EXPERIENCE', 'EXPERIENCE_SENTIMENT', 'WRITE_IN');

-- CreateEnum
CREATE TYPE "public"."ExperienceLevel" AS ENUM ('NEVER_HEARD', 'HEARD_OF', 'USED_BEFORE', 'CURRENTLY_USING', 'WOULD_USE_AGAIN');

-- CreateEnum
CREATE TYPE "public"."SentimentScore" AS ENUM ('VERY_NEGATIVE', 'NEGATIVE', 'NEUTRAL', 'POSITIVE', 'VERY_POSITIVE');

-- CreateTable
CREATE TABLE "public"."weekly_passwords" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "week_start" TIMESTAMP(3) NOT NULL,
    "week_end" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weekly_passwords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."surveys" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "password" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."questions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."QuestionType" NOT NULL,
    "category" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."question_options" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "order_index" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_sessions" (
    "id" TEXT NOT NULL,
    "survey_id" INTEGER,
    "demographic_data" JSONB,
    "progress" JSONB,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."responses" (
    "id" SERIAL NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "session_id" TEXT NOT NULL,
    "question_id" INTEGER NOT NULL,
    "option_id" INTEGER,
    "text_value" TEXT,
    "rating_value" INTEGER,
    "write_in_value" TEXT,
    "experience_level" "public"."ExperienceLevel",
    "sentiment_score" "public"."SentimentScore",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."experience_metrics" (
    "id" SERIAL NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "tool_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "never_heard_count" INTEGER NOT NULL DEFAULT 0,
    "heard_of_count" INTEGER NOT NULL DEFAULT 0,
    "used_before_count" INTEGER NOT NULL DEFAULT 0,
    "currently_using_count" INTEGER NOT NULL DEFAULT 0,
    "would_use_again_count" INTEGER NOT NULL DEFAULT 0,
    "avg_sentiment_score" DOUBLE PRECISION,
    "positive_count" INTEGER NOT NULL DEFAULT 0,
    "neutral_count" INTEGER NOT NULL DEFAULT 0,
    "negative_count" INTEGER NOT NULL DEFAULT 0,
    "total_responses" INTEGER NOT NULL DEFAULT 0,
    "calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experience_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sentiment_trends" (
    "id" SERIAL NOT NULL,
    "tool_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "avg_sentiment" DOUBLE PRECISION NOT NULL,
    "change_from_prev" DOUBLE PRECISION,
    "by_experience_level" JSONB,
    "by_demographic" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sentiment_trends_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "weekly_passwords_password_key" ON "public"."weekly_passwords"("password");

-- CreateIndex
CREATE INDEX "weekly_passwords_week_start_week_end_idx" ON "public"."weekly_passwords"("week_start", "week_end");

-- CreateIndex
CREATE INDEX "experience_metrics_category_idx" ON "public"."experience_metrics"("category");

-- CreateIndex
CREATE UNIQUE INDEX "experience_metrics_survey_id_tool_name_key" ON "public"."experience_metrics"("survey_id", "tool_name");

-- CreateIndex
CREATE INDEX "sentiment_trends_category_month_idx" ON "public"."sentiment_trends"("category", "month");

-- CreateIndex
CREATE UNIQUE INDEX "sentiment_trends_tool_name_month_key" ON "public"."sentiment_trends"("tool_name", "month");

-- AddForeignKey
ALTER TABLE "public"."question_options" ADD CONSTRAINT "question_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_sessions" ADD CONSTRAINT "user_sessions_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "public"."surveys"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."responses" ADD CONSTRAINT "responses_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "public"."question_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."responses" ADD CONSTRAINT "responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."responses" ADD CONSTRAINT "responses_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."user_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."responses" ADD CONSTRAINT "responses_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "public"."surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."experience_metrics" ADD CONSTRAINT "experience_metrics_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "public"."surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
