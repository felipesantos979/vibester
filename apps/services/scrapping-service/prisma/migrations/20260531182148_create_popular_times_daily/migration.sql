-- CreateTable
CREATE TABLE "popular_times_daily" (
    "id" TEXT NOT NULL,
    "establishmentId" TEXT NOT NULL,
    "googlePlaceId" TEXT NOT NULL,
    "capturedDate" TIMESTAMP(3) NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "hour" INTEGER NOT NULL,
    "busynessScore" INTEGER NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "statusText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "popular_times_daily_pkey" PRIMARY KEY ("id")
);
