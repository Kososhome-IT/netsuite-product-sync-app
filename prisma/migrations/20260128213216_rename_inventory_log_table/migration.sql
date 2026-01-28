/*
  Warnings:

  - You are about to drop the `InventoryTemp` table. If the table is not empty, all the data it contains will be lost.

*/

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
