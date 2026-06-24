/*
  Warnings:

  - Added the required column `status` to the `ProductSyncLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductSyncLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductSyncLog" ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "action" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ProductSyncLog_sku_status_idx" ON "ProductSyncLog"("sku", "status");

-- CreateIndex
CREATE INDEX "ProductSyncLog_createdAt_idx" ON "ProductSyncLog"("createdAt");
