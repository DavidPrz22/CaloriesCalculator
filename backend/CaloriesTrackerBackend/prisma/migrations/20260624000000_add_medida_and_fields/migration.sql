-- AlterTable Comida
ALTER TABLE "Comida" DROP COLUMN IF EXISTS "medida",
ADD COLUMN IF NOT EXISTS "medidaId" INTEGER NOT NULL,
ADD COLUMN IF NOT EXISTS "calories" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "carbs" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "fat" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "protein" DOUBLE PRECISION;

-- DropEnum
DROP TYPE IF EXISTS "Medida";

-- CreateTable Medida
CREATE TABLE IF NOT EXISTS "Medida" (
    "id" SERIAL NOT NULL,
    "nameES" TEXT NOT NULL,
    "nameEN" TEXT NOT NULL,
    "abreviation" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Medida_pkey" PRIMARY KEY ("id")
);

-- AlterTable DataConsumo
ALTER TABLE "DataConsumo" 
DROP COLUMN IF EXISTS "meta_diaria",
ADD COLUMN IF NOT EXISTS "grasas_consumidas" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "proteinas_consumidas" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "carbohidratos_consumidos" INTEGER NOT NULL DEFAULT 0;

-- AlterTable DataConsumoDetalle
ALTER TABLE "DataConsumoDetalle"
ADD COLUMN IF NOT EXISTS "grasas_consumidas" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "proteinas_consumidas" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "carbohidratos_consumidos" INTEGER NOT NULL DEFAULT 0;

-- AlterTable User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "refreshToken" TEXT;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Comida_medidaId_fkey'
    ) THEN
        ALTER TABLE "Comida" ADD CONSTRAINT "Comida_medidaId_fkey" FOREIGN KEY ("medidaId") REFERENCES "Medida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
