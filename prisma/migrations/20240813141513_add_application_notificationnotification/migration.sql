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

COMMENT ON TABLE "user" IS 'Armazena informações sobre os usuários.';
COMMENT ON COLUMN "user"."user_id" IS 'Identificador único do usuário';
COMMENT ON COLUMN "user"."name" IS 'Nome do usuário';
COMMENT ON COLUMN "user"."email" IS 'Email do usuário';
COMMENT ON COLUMN "user"."document" IS 'Documento de identificação do usuário';
COMMENT ON COLUMN "user"."status" IS 'Status do usuário (ACTIVE, INACTIVE, INVITED)';
COMMENT ON COLUMN "user"."created_at" IS 'Data e hora de criação do registro';

COMMENT ON TABLE "organization" IS 'Armazena informações sobre as organizações.';
COMMENT ON COLUMN "organization"."organization_id" IS 'Identificador único da organização';
COMMENT ON COLUMN "organization"."name" IS 'Nome da organização';
COMMENT ON COLUMN "organization"."created_at" IS 'Data e hora de criação do registro';

COMMENT ON TABLE "user_organization" IS 'Tabela que relaciona usuários e organizações, indicando a participação de um usuário em uma organização.';
COMMENT ON COLUMN "user_organization"."user_id" IS 'Identificador do usuário associado à organização';
COMMENT ON COLUMN "user_organization"."organization_id" IS 'Identificador da organização associada ao usuário';
COMMENT ON COLUMN "user_organization"."active" IS 'Indica se o usuário está ativo na organização';
COMMENT ON COLUMN "user_organization"."updated_by" IS 'Responsável por atualizar o registro';
COMMENT ON COLUMN "user_organization"."created_by" IS 'Responsável por criar o registro';
COMMENT ON COLUMN "user_organization"."updated_at" IS 'Data e hora da última atualização do registro';
COMMENT ON COLUMN "user_organization"."created_at" IS 'Data e hora de criação do registro';

COMMENT ON TABLE "pilot" IS 'Armazena informações sobre os pilotos.';
COMMENT ON COLUMN "pilot"."pilot_id" IS 'Identificador único do piloto';
COMMENT ON COLUMN "pilot"."organization_id" IS 'Identificador da organização à qual o piloto pertence';
COMMENT ON COLUMN "pilot"."name" IS 'Nome do piloto';
COMMENT ON COLUMN "pilot"."document" IS 'Documento de identificação do piloto';
COMMENT ON COLUMN "pilot"."license" IS 'Licença do piloto';
COMMENT ON COLUMN "pilot"."created_at" IS 'Data e hora de criação do registro';

COMMENT ON TABLE "application" IS 'Armazena informações sobre as aplicações de uma organização.';
COMMENT ON COLUMN "application"."application_id" IS 'Identificador único da aplicação';
COMMENT ON COLUMN "application"."user_id" IS 'Identificador do usuário que criou a aplicação';
COMMENT ON COLUMN "application"."organization_id" IS 'Identificador da organização relacionada à aplicação';
COMMENT ON COLUMN "application"."vehicle" IS 'Tipo de veículo relacionado à aplicação';
COMMENT ON COLUMN "application"."start_date" IS 'Data de início da aplicação';
COMMENT ON COLUMN "application"."end_date" IS 'Data de término da aplicação';
COMMENT ON COLUMN "application"."created_by" IS 'Responsável por criar a aplicação';
COMMENT ON COLUMN "application"."created_at" IS 'Data e hora de criação do registro';

COMMENT ON TABLE "application_event" IS 'Armazena eventos de atualização relacionados a aplicações.';
COMMENT ON COLUMN "application_event"."application_event_id" IS 'Identificador único do evento da aplicação';
COMMENT ON COLUMN "application_event"."application_id" IS 'Identificador da aplicação associada';
COMMENT ON COLUMN "application_event"."application_status_id" IS 'Identificador do status da aplicação';
COMMENT ON COLUMN "application_event"."pilot_id" IS 'Identificador do piloto associado ao evento';
COMMENT ON COLUMN "application_event"."created_by" IS 'Responsável por criar o evento';
COMMENT ON COLUMN "application_event"."created_at" IS 'Data e hora de criação do registro';

COMMENT ON TABLE "application_status" IS 'Armazena os diferentes status que uma aplicação pode ter.';
COMMENT ON COLUMN "application_status"."application_status_id" IS 'Identificador único do status da aplicação';
COMMENT ON COLUMN "application_status"."description" IS 'Descrição do status da aplicação';
COMMENT ON COLUMN "application_status"."active" IS 'Indica se o status está ativo ou não';
COMMENT ON COLUMN "application_status"."created_at" IS 'Data e hora de criação do registro';

COMMENT ON TABLE "application_document" IS 'Armazena documentos associados às aplicações.';
COMMENT ON COLUMN "application_document"."application_document_id" IS 'Identificador único do documento da aplicação';
COMMENT ON COLUMN "application_document"."application_id" IS 'Identificador da aplicação associada';
COMMENT ON COLUMN "application_document"."application_document_type_id" IS 'Identificador do tipo de documento';
COMMENT ON COLUMN "application_document"."original_name" IS 'Nome original do arquivo/documento';
COMMENT ON COLUMN "application_document"."data" IS 'Dados do documento em formato JSON';
COMMENT ON COLUMN "application_document"."path" IS 'Caminho onde o documento está armazenado';

COMMENT ON TABLE "application_document_type" IS 'Armazena os diferentes tipos de documentos que podem ser associados às aplicações.';
COMMENT ON COLUMN "application_document_type"."application_document_type_id" IS 'Identificador único do tipo de documento';
COMMENT ON COLUMN "application_document_type"."description" IS 'Descrição do tipo de documento';
COMMENT ON COLUMN "application_document_type"."active" IS 'Indica se o tipo de documento está ativo ou não';
COMMENT ON COLUMN "application_document_type"."created_at" IS 'Data e hora de criação do registro';

COMMENT ON TABLE "application_area" IS 'Armazena informações sobre áreas de aplicação.';
COMMENT ON COLUMN "application_area"."id" IS 'Identificador único da área de aplicação';
COMMENT ON COLUMN "application_area"."geom" IS 'Geometria da área de aplicação';
COMMENT ON COLUMN "application_area"."geomjson" IS 'Representação da geometria em formato GeoJSON';
COMMENT ON COLUMN "application_area"."description" IS 'Descrição da área de aplicação';
COMMENT ON COLUMN "application_area"."application_id" IS 'Identificador da aplicação associada';
COMMENT ON COLUMN "application_area"."created_at" IS 'Data e hora de criação do registro';

COMMENT ON TABLE "application_analisys" IS 'Armazena as análises realizadas sobre uma aplicação a fim de auditoria.';
COMMENT ON COLUMN "application_analisys"."application_analisys_id" IS 'Identificador único da análise da aplicação';
COMMENT ON COLUMN "application_analisys"."application_analisys_type_id" IS 'Identificador do tipo de análise da aplicação';
COMMENT ON COLUMN "application_analisys"."application_id" IS 'Identificador da aplicação associada';
COMMENT ON COLUMN "application_analisys"."application_notification_id" IS 'Identificador da notificação da aplicação (opcional)';
COMMENT ON COLUMN "application_analisys"."elapsed_time" IS 'Tempo decorrido para a análise';
COMMENT ON COLUMN "application_analisys"."status" IS 'Status da análise da aplicação (PENDING, APPROVED, FAILED, REJECTED)';
COMMENT ON COLUMN "application_analisys"."details" IS 'Detalhes da análise em formato JSON (opcional)';
COMMENT ON COLUMN "application_analisys"."created_at" IS 'Data e hora de criação do registro';

COMMENT ON TABLE "application_analisys_type" IS 'Armazena os diferentes tipos de análises que podem ser realizadas sobre as aplicações.';
COMMENT ON COLUMN "application_analisys_type"."application_analisys_type_id" IS 'Identificador único do tipo de análise da aplicação';
COMMENT ON COLUMN "application_analisys_type"."name" IS 'Nome do tipo de análise da aplicação';
COMMENT ON COLUMN "application_analisys_type"."allow_reprocess" IS 'Indica se o tipo de análise permite reprocessamento';
COMMENT ON COLUMN "application_analisys_type"."active" IS 'Indica se o tipo de análise está ativo ou não';
COMMENT ON COLUMN "application_analisys_type"."created_at" IS 'Data e hora de criação do registro';

COMMENT ON TABLE "application_notification" IS 'Armazena notificações relacionadas a um aplicação caso alguma analise tenha falhado.';
COMMENT ON COLUMN "application_notification"."application_notification_id" IS 'Identificador único da notificação da aplicação';
COMMENT ON COLUMN "application_notification"."application_id" IS 'Identificador da aplicação associada';
COMMENT ON COLUMN "application_notification"."created_at" IS 'Data e hora de criação do registro';
COMMENT ON COLUMN "application_notification"."fiscal_id" IS 'Fiscal responsável pela analise da notificação';

COMMENT ON TABLE "application_notification_event" IS 'Armazena eventos relacionados às notificações de uma aplicação';
COMMENT ON COLUMN "application_notification_event"."event_id" IS 'Identificador único do evento da notificação';
COMMENT ON COLUMN "application_notification_event"."application_notification_id" IS 'Identificador da notificação associada';
COMMENT ON COLUMN "application_notification_event"."application_notification_status_id" IS 'Identificador do status da notificação';
COMMENT ON COLUMN "application_notification_event"."created_by" IS 'Responsável por criar o evento';
COMMENT ON COLUMN "application_notification_event"."created_at" IS 'Data e hora de criação do registro';

COMMENT ON TABLE "application_notification_status" IS 'Armazena os diferentes status que uma notificação pode ter.';
COMMENT ON COLUMN "application_notification_status"."id" IS 'Identificador único do status da notificação';
COMMENT ON COLUMN "application_notification_status"."description" IS 'Descrição do status da notificação';
COMMENT ON COLUMN "application_notification_status"."active" IS 'Indica se o status da notificação está ativo ou não';
COMMENT ON COLUMN "application_notification_status"."created_at" IS 'Data e hora de criação do registro';

COMMENT ON TABLE "protected_area" IS 'Armazena informações sobre áreas protegidas.';
COMMENT ON COLUMN "protected_area"."id" IS 'Identificador único da área protegida';
COMMENT ON COLUMN "protected_area"."geom" IS 'Geometria da área protegida';
COMMENT ON COLUMN "protected_area"."geomjson" IS 'Representação da geometria em formato GeoJSON';
COMMENT ON COLUMN "protected_area"."description" IS 'Descrição da área protegida';
COMMENT ON COLUMN "protected_area"."protected_area_type_id" IS 'Identificador do tipo de área protegida';
COMMENT ON COLUMN "protected_area"."organization_id" IS 'Identificador da organização associada à área protegida';
COMMENT ON COLUMN "protected_area"."created_by" IS 'Responsável por criar o registro';
COMMENT ON COLUMN "protected_area"."created_at" IS 'Data e hora de criação do registro';

COMMENT ON TABLE "protected_area_type" IS 'Armazena os diferentes tipos de áreas protegidas.';
COMMENT ON COLUMN "protected_area_type"."protected_area_type_id" IS 'Identificador único do tipo de área protegida';
COMMENT ON COLUMN "protected_area_type"."description" IS 'Descrição do tipo de área protegida';
COMMENT ON COLUMN "protected_area_type"."created_at" IS 'Data e hora de criação do registro';
