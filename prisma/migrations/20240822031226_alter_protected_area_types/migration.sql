/*
  Warnings:

  - Added the required column `distance` to the `protected_area_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distance_drone` to the `protected_area_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `protected_area_type` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "protected_area_type" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "distance" INTEGER NOT NULL,
ADD COLUMN     "distance_drone" INTEGER NOT NULL,
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(1000);
