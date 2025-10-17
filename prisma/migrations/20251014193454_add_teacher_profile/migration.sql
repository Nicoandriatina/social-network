-- CreateTable
CREATE TABLE "public"."experiences" (
    "id" TEXT NOT NULL,
    "enseignantId" TEXT NOT NULL,
    "poste" TEXT NOT NULL,
    "etablissement" TEXT NOT NULL,
    "debut" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3),
    "enCours" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."formations" (
    "id" TEXT NOT NULL,
    "enseignantId" TEXT NOT NULL,
    "diplome" TEXT NOT NULL,
    "etablissement" TEXT NOT NULL,
    "annee" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."certifications" (
    "id" TEXT NOT NULL,
    "enseignantId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "organisme" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lien" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "experiences_enseignantId_idx" ON "public"."experiences"("enseignantId");

-- CreateIndex
CREATE INDEX "experiences_debut_idx" ON "public"."experiences"("debut");

-- CreateIndex
CREATE INDEX "formations_enseignantId_idx" ON "public"."formations"("enseignantId");

-- CreateIndex
CREATE INDEX "formations_annee_idx" ON "public"."formations"("annee");

-- CreateIndex
CREATE INDEX "certifications_enseignantId_idx" ON "public"."certifications"("enseignantId");

-- CreateIndex
CREATE INDEX "certifications_date_idx" ON "public"."certifications"("date");

-- AddForeignKey
ALTER TABLE "public"."experiences" ADD CONSTRAINT "experiences_enseignantId_fkey" FOREIGN KEY ("enseignantId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."formations" ADD CONSTRAINT "formations_enseignantId_fkey" FOREIGN KEY ("enseignantId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."certifications" ADD CONSTRAINT "certifications_enseignantId_fkey" FOREIGN KEY ("enseignantId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
