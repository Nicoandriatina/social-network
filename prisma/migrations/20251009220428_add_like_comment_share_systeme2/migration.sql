-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "commentsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sharesCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "project_comments_createdAt_idx" ON "public"."project_comments"("createdAt");

-- CreateIndex
CREATE INDEX "project_comments_projectId_createdAt_idx" ON "public"."project_comments"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "project_likes_createdAt_idx" ON "public"."project_likes"("createdAt");

-- CreateIndex
CREATE INDEX "project_likes_projectId_createdAt_idx" ON "public"."project_likes"("projectId", "createdAt");
