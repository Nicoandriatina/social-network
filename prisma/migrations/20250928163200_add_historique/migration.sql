-- CreateTable
CREATE TABLE "public"."donation_activity_logs" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donation_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "donation_activity_logs_donationId_idx" ON "public"."donation_activity_logs"("donationId");

-- CreateIndex
CREATE INDEX "donation_activity_logs_userId_idx" ON "public"."donation_activity_logs"("userId");

-- CreateIndex
CREATE INDEX "donation_activity_logs_createdAt_idx" ON "public"."donation_activity_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."donation_activity_logs" ADD CONSTRAINT "donation_activity_logs_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "public"."Don"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."donation_activity_logs" ADD CONSTRAINT "donation_activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
