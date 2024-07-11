/*
  Warnings:

  - Added the required column `document` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `user_organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `user_organization` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'INVITED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "document" VARCHAR(14) NOT NULL,
ADD COLUMN     "email" VARCHAR(100) NOT NULL,
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'INVITED';

-- AlterTable
ALTER TABLE "user_organization" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_by" TEXT NOT NULL;
