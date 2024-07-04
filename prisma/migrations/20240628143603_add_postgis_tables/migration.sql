-- CreateTable
CREATE TABLE "application_area" (
    "id" SERIAL NOT NULL,
    "geom" public.geometry(polygonz, 4326) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "application_document_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protected_area" (
    "id" SERIAL NOT NULL,
    "geom" public.geometry(polygonz, 4326) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "protected_area_type_id" INTEGER NOT NULL,

    CONSTRAINT "protected_area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protected_area_type" (
    "protected_area_type_id" SERIAL NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "protected_area_type_pkey" PRIMARY KEY ("protected_area_type_id")
);

-- CreateIndex
CREATE INDEX "application_area_idx" ON "application_area" USING GIST ("geom");

-- CreateIndex
CREATE INDEX "protected_area_idx" ON "protected_area" USING GIST ("geom");

-- AddForeignKey
ALTER TABLE "application_area" ADD CONSTRAINT "application_area_application_document_id_fkey" FOREIGN KEY ("application_document_id") REFERENCES "application_document"("application_document_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protected_area" ADD CONSTRAINT "protected_area_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protected_area" ADD CONSTRAINT "protected_area_protected_area_type_id_fkey" FOREIGN KEY ("protected_area_type_id") REFERENCES "protected_area_type"("protected_area_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;
