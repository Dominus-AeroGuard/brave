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

-- Tabela  `user`
COMMENT ON COLUMN "user"."user_id" IS 'Identificador único do usuário';
COMMENT ON COLUMN "user"."organization_id" IS 'Identificador da organização à qual o usuário pertence';
COMMENT ON COLUMN "user"."created_at" IS 'Data e hora de criação do registro';
-- Tabela  `organization`
COMMENT ON COLUMN "organization"."organization_id" IS 'Identificador único da organização';
COMMENT ON COLUMN "organization"."name" IS 'Nome da organização';
COMMENT ON COLUMN "organization"."created_at" IS 'Data e hora de criação do registro';
-- Tabela  `pilot`
COMMENT ON COLUMN "pilot"."pilot_id" IS 'Identificador único do piloto';
COMMENT ON COLUMN "pilot"."organization_id" IS 'Identificador da organização à qual o piloto pertence';
COMMENT ON COLUMN "pilot"."name" IS 'Nome do piloto';
COMMENT ON COLUMN "pilot"."document" IS 'Documento de identificação do piloto';
COMMENT ON COLUMN "pilot"."license" IS 'Licença do piloto';
COMMENT ON COLUMN "pilot"."created_at" IS 'Data e hora de criação do registro';
-- Tabela  `application`
COMMENT ON COLUMN "application"."application_id" IS 'Identificador único da aplicação';
COMMENT ON COLUMN "application"."user_id" IS 'Identificador do usuário que criou a aplicação';
COMMENT ON COLUMN "application"."organization_id" IS 'Identificador da organização relacionada à aplicação';
COMMENT ON COLUMN "application"."vehicle" IS 'Tipo de veículo relacionado à aplicação';
COMMENT ON COLUMN "application"."start_date" IS 'Data de início da aplicação';
COMMENT ON COLUMN "application"."end_date" IS 'Data de término da aplicação';
COMMENT ON COLUMN "application"."created_by" IS 'Nome da pessoa que criou a aplicação';
COMMENT ON COLUMN "application"."created_at" IS 'Data e hora de criação do registro';
-- Tabela  `application_event`
COMMENT ON COLUMN "application_event"."application_event_id" IS 'Identificador único do evento da aplicação';
COMMENT ON COLUMN "application_event"."application_id" IS 'Identificador da aplicação associada';
COMMENT ON COLUMN "application_event"."application_status_id" IS 'Identificador do status da aplicação';
COMMENT ON COLUMN "application_event"."pilot_id" IS 'Identificador do piloto associado ao evento';
COMMENT ON COLUMN "application_event"."created_by" IS 'Nome da pessoa que criou o evento';
COMMENT ON COLUMN "application_event"."created_at" IS 'Data e hora de criação do registro';
-- Tabela  `application_status`
COMMENT ON COLUMN "application_status"."application_status_id" IS 'Identificador único do status da aplicação';
COMMENT ON COLUMN "application_status"."description" IS 'Descrição do status da aplicação';
COMMENT ON COLUMN "application_status"."active" IS 'Indica se o status está ativo ou não';
COMMENT ON COLUMN "application_status"."created_at" IS 'Data e hora de criação do registro';
-- Tabela  `application_document`
COMMENT ON COLUMN "application_document"."application_document_id" IS 'Identificador único do documento da aplicação';
COMMENT ON COLUMN "application_document"."application_id" IS 'Identificador da aplicação associada';
COMMENT ON COLUMN "application_document"."application_document_type_id" IS 'Identificador do tipo de documento';
COMMENT ON COLUMN "application_document"."original_name" IS 'Nome original do arquivo/documento';
COMMENT ON COLUMN "application_document"."data" IS 'Dados do documento em formato JSONB';
COMMENT ON COLUMN "application_document"."path" IS 'Caminho onde o documento está armazenado';
-- Tabela  `application_document_type`
COMMENT ON COLUMN "application_document_type"."application_document_type_id" IS 'Identificador único do tipo de documento';
COMMENT ON COLUMN "application_document_type"."description" IS 'Descrição do tipo de documento';
COMMENT ON COLUMN "application_document_type"."active" IS 'Indica se o tipo de documento está ativo ou não';
COMMENT ON COLUMN "application_document_type"."created_at" IS 'Data e hora de criação do registro';
