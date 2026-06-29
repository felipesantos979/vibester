-- Remove auto-generated UUID default from establishmentId (should be supplied by the caller)
ALTER TABLE "Event" ALTER COLUMN "establishmentId" DROP DEFAULT;

-- Performance indexes
CREATE INDEX IF NOT EXISTS "Event_establishmentId_idx" ON "Event"("establishmentId");
CREATE INDEX IF NOT EXISTS "Event_startDate_idx"       ON "Event"("startDate");
CREATE INDEX IF NOT EXISTS "Event_isFeatured_idx"      ON "Event"("isFeatured");
CREATE INDEX IF NOT EXISTS "Event_lat_lon_idx"         ON "Event"("latitude", "longitude");
