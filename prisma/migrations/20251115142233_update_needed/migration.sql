/*
  Warnings:

  - You are about to drop the column `budgetEstime` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "budgetEstime",
ADD COLUMN     "budgetDisponible" DOUBLE PRECISION,
ADD COLUMN     "progressionGlobale" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "project_needs" ADD COLUMN     "budgetInclusDansCalcul" BOOLEAN NOT NULL DEFAULT false;
