-- CreateEnum
CREATE TYPE "MovementLevel" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "MovementSource" AS ENUM ('SERPAPI', 'GOOGLE_MAPS', 'MANUAL', 'ESTIMATED');

-- CreateTable
CREATE TABLE "current_popularity" (
    "id" TEXT NOT NULL,
    "establishmentId" TEXT NOT NULL,
    "googlePlaceId" TEXT NOT NULL,
    "level" "MovementLevel" NOT NULL,
    "source" "MovementSource" NOT NULL,
    "score" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "current_popularity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "current_popularity_establishmentId_key" ON "current_popularity"("establishmentId");
