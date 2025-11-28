/*
  Warnings:

  - Made the column `created_at` on table `dashboard_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dashboard_logs" ADD COLUMN     "action" TEXT,
ALTER COLUMN "shop" DROP NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);
