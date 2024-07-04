/*
  Warnings:

  - You are about to drop the column `application_document_id` on the `application_area` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `protected_area` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `user` table. All the data in the column will be lost.
  - Added the required column `application_id` to the `application_area` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `protected_area` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `protected_area` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "application_area" DROP CONSTRAINT "application_area_application_document_id_fkey";

-- DropForeignKey
ALTER TABLE "protected_area" DROP CONSTRAINT "protected_area_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_organization_id_fkey";

-- AlterTable
ALTER TABLE "application_area" DROP COLUMN "application_document_id",
ADD COLUMN     "application_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "protected_area" DROP COLUMN "user_id",
ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "organization_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "organization_id";

-- CreateTable
CREATE TABLE "user_organization" (
    "user_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_organization_pkey" PRIMARY KEY ("user_id","organization_id")
);

-- AddForeignKey
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_area" ADD CONSTRAINT "application_area_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protected_area" ADD CONSTRAINT "protected_area_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;
