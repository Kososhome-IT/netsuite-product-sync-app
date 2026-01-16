-- AlterTable
ALTER TABLE "dashboard_logs" ADD COLUMN     "netsuite_user" TEXT;

-- CreateTable
CREATE TABLE "ProductSyncLog" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "inventoryItemId" TEXT,
    "title" TEXT,
    "payload" JSONB,
    "error" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductSyncLog_pkey" PRIMARY KEY ("id")
);
