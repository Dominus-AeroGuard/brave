/*
  Warnings:

  - Added the required column `geomjson` to the `application_area` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geomjson` to the `protected_area` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "application_area" ADD COLUMN     "geomjson" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "protected_area" ADD COLUMN     "geomjson" TEXT NOT NULL;
