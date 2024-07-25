-- CreateEnum
CREATE TYPE "ApplicationAnalisysStatus" AS ENUM ('PENDING', 'APPROVED', 'FAILED', 'REJECTED');

-- CreateTable
CREATE TABLE "application_analisys" (
    "application_analisys_id" SERIAL NOT NULL,
    "application_analisys_type_id" INTEGER NOT NULL,
    "application_id" BIGINT NOT NULL,
    "elapsed_time" INTEGER NOT NULL,
    "status" "ApplicationAnalisysStatus" NOT NULL DEFAULT 'PENDING',
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_analisys_pkey" PRIMARY KEY ("application_analisys_id")
);

-- CreateTable
CREATE TABLE "application_analisys_type" (
    "application_analisys_type_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "allow_reprocess" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_analisys_type_pkey" PRIMARY KEY ("application_analisys_type_id")
);

-- AddForeignKey
ALTER TABLE "application_analisys" ADD CONSTRAINT "application_analisys_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_analisys" ADD CONSTRAINT "application_analisys_application_analisys_type_id_fkey" FOREIGN KEY ("application_analisys_type_id") REFERENCES "application_analisys_type"("application_analisys_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;
