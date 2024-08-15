-- AlterTable
ALTER TABLE "application_analisys" ADD COLUMN     "application_notification_id" BIGINT;

-- CreateTable
CREATE TABLE "application_notification" (
    "application_notification_id" BIGSERIAL NOT NULL,
    "application_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fiscal_id" INTEGER NOT NULL,

    CONSTRAINT "application_notification_pkey" PRIMARY KEY ("application_notification_id")
);

-- CreateTable
CREATE TABLE "application_notification_event" (
    "event_id" BIGSERIAL NOT NULL,
    "application_notification_id" BIGINT NOT NULL,
    "application_notification_status_id" INTEGER NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_notification_event_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "application_notification_status" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_notification_status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "application_analisys" ADD CONSTRAINT "application_analisys_application_notification_id_fkey" FOREIGN KEY ("application_notification_id") REFERENCES "application_notification"("application_notification_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_notification" ADD CONSTRAINT "application_notification_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_notification" ADD CONSTRAINT "application_notification_fiscal_id_fkey" FOREIGN KEY ("fiscal_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_notification_event" ADD CONSTRAINT "application_notification_event_application_notification_st_fkey" FOREIGN KEY ("application_notification_status_id") REFERENCES "application_notification_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_notification_event" ADD CONSTRAINT "application_notification_event_application_notification_id_fkey" FOREIGN KEY ("application_notification_id") REFERENCES "application_notification"("application_notification_id") ON DELETE RESTRICT ON UPDATE CASCADE;
