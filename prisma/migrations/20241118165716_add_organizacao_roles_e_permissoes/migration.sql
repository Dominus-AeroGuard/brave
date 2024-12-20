-- AlterTable
ALTER TABLE "SIGA"."S_PERMISSAO" ADD COLUMN     "ST_ORGANIZACAO_PERMISSAO" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SIGA"."S_ROLE" ADD COLUMN     "ST_ORGANIZACAO_ROLE" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SIGA"."S_ROLE_PERMISSAO" ADD COLUMN     "DH_REMOCAO" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SIGA"."S_USUARIO" ADD COLUMN     "DH_REMOCAO" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SIGA"."S_USUARIO_PERMISSAO" ADD COLUMN     "DH_REMOCAO" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SIGA"."S_USUARIO_ROLE" ADD COLUMN     "DH_REMOCAO" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "SIGA"."S_USUARIO_ORG_ROLE" (
    "ID_USUARIO_ORG_ROLE" SERIAL NOT NULL,
    "ID_USUARIO" INTEGER NOT NULL,
    "ID_ROLE" INTEGER NOT NULL,
    "ID_ORGANIZAVAO" INTEGER NOT NULL,
    "DH_CRIACAO" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_CRIADO_POR" INTEGER NOT NULL,
    "DH_REMOCAO" TIMESTAMP(3),

    CONSTRAINT "PK_USUARIO_ORG_ROLE" PRIMARY KEY ("ID_USUARIO_ORG_ROLE")
);

-- CreateTable
CREATE TABLE "SIGA"."S_USUARIO_ORG_PERMISSAO" (
    "ID_USUARIO_ORG_PERMISSAO" SERIAL NOT NULL,
    "ID_USUARIO" INTEGER NOT NULL,
    "ID_PERMISSAO" INTEGER NOT NULL,
    "ID_ORGANIZAVAO" INTEGER NOT NULL,
    "DH_CRIACAO" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_CRIADO_POR" INTEGER NOT NULL,
    "DH_REMOCAO" TIMESTAMP(3),

    CONSTRAINT "PK_USUARIO_ORGANIZACAO_ROLE" PRIMARY KEY ("ID_USUARIO_ORG_PERMISSAO")
);

-- AddForeignKey
ALTER TABLE "SIGA"."S_USUARIO_ORG_ROLE" ADD CONSTRAINT "FK_USUARIO_ORG_ROLE_USER" FOREIGN KEY ("ID_USUARIO") REFERENCES "SIGA"."S_USUARIO"("ID_USUARIO") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SIGA"."S_USUARIO_ORG_ROLE" ADD CONSTRAINT "FK_USUARIO_ORG_ROLE_ORG" FOREIGN KEY ("ID_ORGANIZAVAO") REFERENCES "SIGA"."S_ORGANIZACAO"("ID_ORGANIZACAO") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SIGA"."S_USUARIO_ORG_ROLE" ADD CONSTRAINT "FK_USUARIO_ORG_ROLE_ROLE" FOREIGN KEY ("ID_ROLE") REFERENCES "SIGA"."S_ROLE"("ID_ROLE") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SIGA"."S_USUARIO_ORG_PERMISSAO" ADD CONSTRAINT "FK_USUARIO_ORG_PERM_USER" FOREIGN KEY ("ID_USUARIO") REFERENCES "SIGA"."S_USUARIO"("ID_USUARIO") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SIGA"."S_USUARIO_ORG_PERMISSAO" ADD CONSTRAINT "FK_USUARIO_ORG_PERM_ORG" FOREIGN KEY ("ID_ORGANIZAVAO") REFERENCES "SIGA"."S_ORGANIZACAO"("ID_ORGANIZACAO") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SIGA"."S_USUARIO_ORG_PERMISSAO" ADD CONSTRAINT "FK_USUARIO_ORG_PERM_PERM" FOREIGN KEY ("ID_PERMISSAO") REFERENCES "SIGA"."S_PERMISSAO"("ID_PERMISSAO") ON DELETE CASCADE ON UPDATE CASCADE;
