-- CreateIndex
CREATE INDEX "responses_created_at_idx" ON "responses"("created_at");

-- CreateIndex for sessionId since we use it for grouping
CREATE INDEX "responses_session_id_idx" ON "responses"("session_id");