-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "readAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Message_fromId_toId_idx" ON "public"."Message"("fromId", "toId");

-- CreateIndex
CREATE INDEX "Message_toId_read_idx" ON "public"."Message"("toId", "read");
