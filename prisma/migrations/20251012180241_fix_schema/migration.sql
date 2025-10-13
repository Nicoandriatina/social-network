-- CreateTable
CREATE TABLE "public"."scholarity_histories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "etablissementId" TEXT NOT NULL,
    "years" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scholarity_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scholarity_histories_userId_etablissementId_key" ON "public"."scholarity_histories"("userId", "etablissementId");

-- AddForeignKey
ALTER TABLE "public"."scholarity_histories" ADD CONSTRAINT "scholarity_histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scholarity_histories" ADD CONSTRAINT "scholarity_histories_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "public"."Etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
