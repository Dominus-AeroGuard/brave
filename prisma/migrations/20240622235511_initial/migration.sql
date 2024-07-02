-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "organization" (
    "organization_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("organization_id")
);

-- CreateTable
CREATE TABLE "pilot" (
    "pilot_id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "document" VARCHAR(14) NOT NULL,
    "license" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pilot_pkey" PRIMARY KEY ("pilot_id")
);

-- CreateTable
CREATE TABLE "application" (
    "application_id" BIGSERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "vehicle" VARCHAR(100) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_pkey" PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "application_event" (
    "application_event_id" BIGSERIAL NOT NULL,
    "application_id" BIGINT NOT NULL,
    "application_status_id" INTEGER NOT NULL,
    "pilot_id" INTEGER NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_event_pkey" PRIMARY KEY ("application_event_id")
);

-- CreateTable
CREATE TABLE "application_status" (
    "application_status_id" SERIAL NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_status_pkey" PRIMARY KEY ("application_status_id")
);

-- CreateTable
CREATE TABLE "application_document" (
    "application_document_id" SERIAL NOT NULL,
    "application_id" BIGINT NOT NULL,
    "application_document_type_id" INTEGER NOT NULL,
    "original_name" VARCHAR(200) NOT NULL,
    "data" JSONB NOT NULL,
    "path" VARCHAR(1000) NOT NULL,

    CONSTRAINT "application_document_pkey" PRIMARY KEY ("application_document_id")
);

-- CreateTable
CREATE TABLE "application_document_type" (
    "application_document_type_id" SERIAL NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_document_type_pkey" PRIMARY KEY ("application_document_type_id")
);

-- CreateIndex
CREATE INDEX "application_user_id_created_at_idx" ON "application"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "application_event_application_id_created_at_idx" ON "application_event"("application_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pilot" ADD CONSTRAINT "pilot_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_event" ADD CONSTRAINT "application_event_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_event" ADD CONSTRAINT "application_event_application_status_id_fkey" FOREIGN KEY ("application_status_id") REFERENCES "application_status"("application_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_event" ADD CONSTRAINT "application_event_pilot_id_fkey" FOREIGN KEY ("pilot_id") REFERENCES "pilot"("pilot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_document" ADD CONSTRAINT "application_document_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_document" ADD CONSTRAINT "application_document_application_document_type_id_fkey" FOREIGN KEY ("application_document_type_id") REFERENCES "application_document_type"("application_document_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;
