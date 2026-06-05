-- AlterTable
ALTER TABLE "current_popularity" ADD COLUMN     "isEstimated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "statusText" TEXT,
ADD COLUMN     "timeSpent" TEXT;
