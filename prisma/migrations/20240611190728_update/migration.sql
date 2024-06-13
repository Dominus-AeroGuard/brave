/*
  Warnings:

  - You are about to alter the column `vehicle` on the `application` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "application" ADD COLUMN     "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "vehicle" SET DATA TYPE VARCHAR(100);
