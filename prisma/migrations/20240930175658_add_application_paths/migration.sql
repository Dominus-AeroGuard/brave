-- CreateTable
CREATE TABLE "application_path" (
    "id" SERIAL NOT NULL,
    "geom" public.geometry(linestringz, 4326) NOT NULL,
    "geomjson" TEXT NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "application_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_path_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "application_path_idx" ON "application_path" USING GIST ("geom");

-- AddForeignKey
ALTER TABLE "application_path" ADD CONSTRAINT "application_path_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;
