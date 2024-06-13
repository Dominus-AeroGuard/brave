-- CreateTable
CREATE TABLE "user" (
    "user_id" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "application" (
    "application_id" VARCHAR(36) NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "vehicle" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_pkey" PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "application_event" (
    "application_event_id" VARCHAR(36) NOT NULL,
    "application_id" VARCHAR(36) NOT NULL,
    "application_status_id" INTEGER NOT NULL,
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
CREATE TABLE "prescription" (
    "prescription_id" VARCHAR(36) NOT NULL,
    "application_id" VARCHAR(36) NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prescription_pkey" PRIMARY KEY ("prescription_id")
);

-- CreateTable
CREATE TABLE "prescription_event" (
    "prescription_event_id" VARCHAR(36) NOT NULL,
    "prescription_id" TEXT NOT NULL,
    "prescription_status_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "prescription_event_pkey" PRIMARY KEY ("prescription_event_id")
);

-- CreateTable
CREATE TABLE "prescription_status" (
    "prescription_status_id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "prescription_status_pkey" PRIMARY KEY ("prescription_status_id")
);

-- CreateIndex
CREATE INDEX "application_user_id_created_at_idx" ON "application"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "application_event_application_id_created_at_idx" ON "application_event"("application_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "prescription_application_id_created_at_idx" ON "prescription"("application_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "prescription_event_prescription_id_created_at_idx" ON "prescription_event"("prescription_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_event" ADD CONSTRAINT "application_event_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_event" ADD CONSTRAINT "application_event_application_status_id_fkey" FOREIGN KEY ("application_status_id") REFERENCES "application_status"("application_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_event" ADD CONSTRAINT "prescription_event_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "prescription"("prescription_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_event" ADD CONSTRAINT "prescription_event_prescription_status_id_fkey" FOREIGN KEY ("prescription_status_id") REFERENCES "prescription_status"("prescription_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;
