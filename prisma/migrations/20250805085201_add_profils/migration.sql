/*
  Warnings:

  - You are about to drop the column `nom` on the `User` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Etablissement" ADD COLUMN     "anneeCreation" INTEGER,
ADD COLUMN     "nbEleves" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "nom",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fullName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Enseignant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "school" TEXT,
    "position" TEXT,
    "experience" TEXT,
    "degree" TEXT,
    "validated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Enseignant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donateur" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "donorType" TEXT,
    "sector" TEXT,

    CONSTRAINT "Donateur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enseignant_userId_key" ON "Enseignant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Donateur_userId_key" ON "Donateur"("userId");

-- AddForeignKey
ALTER TABLE "Enseignant" ADD CONSTRAINT "Enseignant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donateur" ADD CONSTRAINT "Donateur_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
