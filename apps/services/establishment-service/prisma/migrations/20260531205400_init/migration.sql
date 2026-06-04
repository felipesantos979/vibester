-- CreateTable
CREATE TABLE "establishments" (
    "id" TEXT NOT NULL,
    "googlePlaceId" TEXT,
    "name" TEXT NOT NULL,
    "photoUrl" TEXT,
    "bannerUrl" TEXT,
    "category" TEXT NOT NULL,
    "priceIndicator" TEXT,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "establishments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "establishments_googlePlaceId_key" ON "establishments"("googlePlaceId");
