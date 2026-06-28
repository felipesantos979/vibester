-- AlterTable
ALTER TABLE "establishments" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "distribuicao" DOUBLE PRECISION[],
ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "nivelMovimento" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "qtdAvaliacoes" INTEGER NOT NULL DEFAULT 0;
