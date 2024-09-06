-- CreateEnum
CREATE TYPE "NotificationAlertLevel" AS ENUM ('GRAVISSIMO', 'GRAVE', 'MODERADO', 'LEVE');

-- AlterTable
ALTER TABLE "application_document_data" ALTER COLUMN "value" DROP NOT NULL;

-- AlterTable
ALTER TABLE "application_notification" ADD COLUMN     "alert_level" "NotificationAlertLevel" NOT NULL DEFAULT 'LEVE';

COMMENT ON COLUMN "application_notification"."alert_level" IS 'Nível de alerta (GRAVISSIMO, GRAVE, MODERADO, LEVE)';
