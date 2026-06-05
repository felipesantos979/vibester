-- CreateTable
CREATE TABLE "establishment_opening_hours" (
    "id" TEXT NOT NULL,
    "establishmentId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,

    CONSTRAINT "establishment_opening_hours_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "establishment_opening_hours" ADD CONSTRAINT "establishment_opening_hours_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
