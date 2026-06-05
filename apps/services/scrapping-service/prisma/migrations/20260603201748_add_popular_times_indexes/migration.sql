-- CreateIndex
CREATE INDEX "popular_times_daily_establishmentId_dayOfWeek_hour_idx" ON "popular_times_daily"("establishmentId", "dayOfWeek", "hour");

-- CreateIndex
CREATE INDEX "popular_times_daily_capturedDate_idx" ON "popular_times_daily"("capturedDate");
