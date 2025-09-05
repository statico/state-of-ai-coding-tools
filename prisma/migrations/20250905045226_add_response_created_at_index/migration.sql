-- CreateIndex
CREATE INDEX "Response_createdAt_idx" ON "Response"("createdAt");

-- CreateIndex for sessionId since we use it for grouping
CREATE INDEX "Response_sessionId_idx" ON "Response"("sessionId");