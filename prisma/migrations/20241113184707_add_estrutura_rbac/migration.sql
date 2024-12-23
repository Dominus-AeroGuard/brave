-- CreateTable
CREATE TABLE "SIGA"."S_ROLE" (
    "ID_ROLE" SERIAL NOT NULL,
    "NM_ROLE" VARCHAR(30) NOT NULL,
    "DS_ROLE" VARCHAR(100) NOT NULL,
    "DH_CRIACAO" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_CRIADO_POR" INTEGER NOT NULL,

    CONSTRAINT "PK_ROLE" PRIMARY KEY ("ID_ROLE")
);

-- CreateTable
CREATE TABLE "SIGA"."S_PERMISSAO" (
    "ID_PERMISSAO" SERIAL NOT NULL,
    "DS_RECURSO" VARCHAR(30) NOT NULL,
    "DS_ACAO" VARCHAR(30) NOT NULL,
    "DS_PERMISSAO" VARCHAR(100) NOT NULL,
    "DH_CRIACAO" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_CRIADO_POR" INTEGER NOT NULL,

    CONSTRAINT "PK_PERMISSAO" PRIMARY KEY ("ID_PERMISSAO")
);

-- CreateTable
CREATE TABLE "SIGA"."S_USUARIO_ROLE" (
    "ID_USUARIO_ROLE" SERIAL NOT NULL,
    "ID_USUARIO" INTEGER NOT NULL,
    "ID_ROLE" INTEGER NOT NULL,
    "DH_CRIACAO" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_CRIADO_POR" INTEGER NOT NULL,

    CONSTRAINT "PK_USUARIO_ROLE" PRIMARY KEY ("ID_USUARIO_ROLE")
);

-- CreateTable
CREATE TABLE "SIGA"."S_USUARIO_PERMISSAO" (
    "ID_USUARIO_PERMISSAO" SERIAL NOT NULL,
    "ID_USUARIO" INTEGER NOT NULL,
    "ID_PERMISSAO" INTEGER NOT NULL,
    "DH_CRIACAO" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_CRIADO_POR" INTEGER NOT NULL,

    CONSTRAINT "PK_USUARIO_PERMISSAO" PRIMARY KEY ("ID_USUARIO_PERMISSAO")
);

-- CreateTable
CREATE TABLE "SIGA"."S_ROLE_PERMISSAO" (
    "ID_ROLE_PERMISSAO" SERIAL NOT NULL,
    "ID_ROLE" INTEGER NOT NULL,
    "ID_PERMISSAO" INTEGER NOT NULL,
    "DH_CRIACAO" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_CRIADO_POR" INTEGER NOT NULL,

    CONSTRAINT "PK_ROLE_PERMISSAO" PRIMARY KEY ("ID_ROLE_PERMISSAO")
);

-- AddForeignKey
ALTER TABLE "SIGA"."S_USUARIO_ROLE" ADD CONSTRAINT "FK_USER_ROLE" FOREIGN KEY ("ID_USUARIO") REFERENCES "SIGA"."S_USUARIO"("ID_USUARIO") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SIGA"."S_USUARIO_ROLE" ADD CONSTRAINT "FK_ROLE_USER" FOREIGN KEY ("ID_ROLE") REFERENCES "SIGA"."S_ROLE"("ID_ROLE") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SIGA"."S_USUARIO_PERMISSAO" ADD CONSTRAINT "FK_USER_PERMISSION" FOREIGN KEY ("ID_USUARIO") REFERENCES "SIGA"."S_USUARIO"("ID_USUARIO") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SIGA"."S_USUARIO_PERMISSAO" ADD CONSTRAINT "FK_PERMISSION_USER" FOREIGN KEY ("ID_PERMISSAO") REFERENCES "SIGA"."S_PERMISSAO"("ID_PERMISSAO") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SIGA"."S_ROLE_PERMISSAO" ADD CONSTRAINT "FK_ROLE_PERMISSION" FOREIGN KEY ("ID_ROLE") REFERENCES "SIGA"."S_ROLE"("ID_ROLE") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SIGA"."S_ROLE_PERMISSAO" ADD CONSTRAINT "FK_PERMISSION_ROLE" FOREIGN KEY ("ID_PERMISSAO") REFERENCES "SIGA"."S_PERMISSAO"("ID_PERMISSAO") ON DELETE CASCADE ON UPDATE CASCADE;
