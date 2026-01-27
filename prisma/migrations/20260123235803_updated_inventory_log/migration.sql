/*
  Warnings:

  - You are about to drop the column `message` on the `dashboard_logs` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InventoryLogStatus" AS ENUM ('SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "dashboard_logs" DROP COLUMN "message",
ADD COLUMN     "error_message" TEXT,
ADD COLUMN     "error_stage" TEXT,
ADD COLUMN     "product_name" TEXT,
ADD COLUMN     "product_sku" TEXT,
ADD COLUMN     "shopify_product_id" TEXT;

-- CreateTable
CREATE TABLE "InventoryLog" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "warehouse" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "InventoryLogStatus" NOT NULL,
    "errorMessage" TEXT,
    "source" TEXT NOT NULL,
    "requestPayload" JSONB,
    "responsePayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InventoryLog_sku_idx" ON "InventoryLog"("sku");

-- CreateIndex
CREATE INDEX "InventoryLog_status_idx" ON "InventoryLog"("status");

-- CreateIndex
CREATE INDEX "InventoryLog_createdAt_idx" ON "InventoryLog"("createdAt");
