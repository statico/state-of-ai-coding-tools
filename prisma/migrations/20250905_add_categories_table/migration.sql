-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "order_index" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_key_key" ON "categories"("key");

-- CreateIndex
CREATE INDEX "categories_order_index_idx" ON "categories"("order_index");

-- AlterTable
ALTER TABLE "questions" ADD COLUMN "category_id" INTEGER;

-- CreateIndex
CREATE INDEX "questions_category_id_idx" ON "questions"("category_id");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Insert initial categories
INSERT INTO "categories" ("key", "label", "description", "order_index", "updated_at") VALUES
('demographics', 'Demographics', 'Tell us about yourself and your work environment', 1, CURRENT_TIMESTAMP),
('ai_models_anthropic', 'Anthropic Models', 'Your experience with Anthropic''s AI models', 2, CURRENT_TIMESTAMP),
('ai_models_openai', 'OpenAI Models', 'Your experience with OpenAI''s models', 3, CURRENT_TIMESTAMP),
('ai_models_google', 'Google Models', 'Your experience with Google''s AI models', 4, CURRENT_TIMESTAMP),
('ai_models_open', 'Open Models', 'Your experience with open-source and other AI models', 5, CURRENT_TIMESTAMP),
('code_completion', 'Code Completion', 'AI-powered code completion tools', 6, CURRENT_TIMESTAMP),
('code_review', 'Code Review', 'AI-powered code review and quality tools', 7, CURRENT_TIMESTAMP),
('ide_assistants', 'IDE Assistants', 'AI-powered IDE extensions and assistants', 8, CURRENT_TIMESTAMP),
('testing_quality', 'Testing & Quality', 'AI tools for testing and quality assurance', 9, CURRENT_TIMESTAMP),
('usage', 'Usage Patterns', 'How you use AI coding tools in your workflow', 10, CURRENT_TIMESTAMP),
('sentiment', 'Sentiment', 'Your overall feelings about AI coding tools', 11, CURRENT_TIMESTAMP),
('organizational', 'Organization', 'How your organization adopts AI tools', 12, CURRENT_TIMESTAMP),
('enterprise', 'Enterprise', 'Enterprise-specific AI tool considerations', 13, CURRENT_TIMESTAMP),
('future', 'Future Outlook', 'Your thoughts on the future of AI coding tools', 14, CURRENT_TIMESTAMP),
('followup', 'Follow-up', 'Additional feedback and follow-up questions', 15, CURRENT_TIMESTAMP);

-- Update existing questions to link to categories
UPDATE "questions" SET "category_id" = (SELECT id FROM "categories" WHERE "key" = "questions"."category");