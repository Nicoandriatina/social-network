-- CreateEnum
CREATE TYPE "NeedType" AS ENUM ('MONETAIRE', 'MATERIEL', 'VIVRES');

-- CreateEnum
CREATE TYPE "NeedStatus" AS ENUM ('EN_COURS', 'TERMINE', 'ANNULE');

-- AlterTable
ALTER TABLE "Don" ADD COLUMN     "needId" TEXT;

-- CreateTable
CREATE TABLE "project_needs" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "NeedType" NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "montantCible" DOUBLE PRECISION,
    "quantiteCible" INTEGER,
    "unite" TEXT,
    "montantRecu" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quantiteRecue" INTEGER NOT NULL DEFAULT 0,
    "pourcentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "statut" "NeedStatus" NOT NULL DEFAULT 'EN_COURS',
    "priorite" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_needs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_needs_projectId_idx" ON "project_needs"("projectId");

-- CreateIndex
CREATE INDEX "project_needs_type_idx" ON "project_needs"("type");

-- CreateIndex
CREATE INDEX "project_needs_statut_idx" ON "project_needs"("statut");

-- CreateIndex
CREATE INDEX "Don_needId_idx" ON "Don"("needId");

-- AddForeignKey
ALTER TABLE "project_needs" ADD CONSTRAINT "project_needs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Don" ADD CONSTRAINT "Don_needId_fkey" FOREIGN KEY ("needId") REFERENCES "project_needs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
