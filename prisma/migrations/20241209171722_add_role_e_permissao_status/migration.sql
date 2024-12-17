/*
  Warnings:

  - Added the required column `DH_ATUALIZACAO` to the `S_PERMISSAO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DH_ATUALIZACAO` to the `S_ROLE` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SIGA"."S_PERMISSAO" ADD COLUMN     "DH_ATUALIZACAO" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ST_ATIVO" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "SIGA"."S_ROLE" ADD COLUMN     "DH_ATUALIZACAO" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ST_ATIVO" BOOLEAN NOT NULL DEFAULT true;

-- RenameForeignKey
ALTER TABLE "SIGA"."S_AREA_ORGANIZACAO" RENAME CONSTRAINT "S_AREA_ORGANIZACAO_ID_ORGANIZACAO_fkey" TO "FK_AREA_ORGAN_ID_ORG";
