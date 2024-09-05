/*
  Warnings:

  - You are about to drop the column `data` on the `application_document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "application_document" DROP COLUMN "data";

-- CreateTable
CREATE TABLE "application_document_data" (
    "id" BIGSERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "value" VARCHAR(200) NOT NULL,
    "revision" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_document_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "application_document_data" ADD CONSTRAINT "application_document_data_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "application_document"("application_document_id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMENT ON TABLE "application_document_data" IS 'Tabela que armazena dados relacionados a documentos de aplicação.';

COMMENT ON COLUMN "application_document_data"."id" IS 'Identificador único do registro de dados do documento (chave primária).';
COMMENT ON COLUMN "application_document_data"."document_id" IS 'Identificador do documento associado.';
COMMENT ON COLUMN "application_document_data"."key" IS 'Chave que representa o tipo de dado armazenado.';
COMMENT ON COLUMN "application_document_data"."value" IS 'Valor associado à chave.';
COMMENT ON COLUMN "application_document_data"."revision" IS 'Número da revisão do dado armazenado.';
COMMENT ON COLUMN "application_document_data"."created_by" IS 'Identificador do usuário que criou o registro.';
COMMENT ON COLUMN "application_document_data"."created_at" IS 'Data e hora de criação do registro.';
