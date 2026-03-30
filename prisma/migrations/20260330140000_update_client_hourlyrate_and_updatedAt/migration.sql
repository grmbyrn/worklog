-- Convert Client.hourlyRate from DOUBLE PRECISION to NUMERIC(10,2), set default and not-null
-- Add updatedAt TIMESTAMP(3) NOT NULL with DEFAULT CURRENT_TIMESTAMP

-- 1) Ensure no NULLs remain in hourlyRate
UPDATE "Client" SET "hourlyRate" = 0 WHERE "hourlyRate" IS NULL;

-- 2) Alter column type to NUMERIC(10,2) with rounding to 2 decimal places
ALTER TABLE "Client" ALTER COLUMN "hourlyRate" TYPE NUMERIC(10,2) USING ROUND("hourlyRate"::numeric, 2);

-- 3) Set default to 0
ALTER TABLE "Client" ALTER COLUMN "hourlyRate" SET DEFAULT 0;

-- 4) Enforce NOT NULL (Prisma model requires non-nullable Decimal)
ALTER TABLE "Client" ALTER COLUMN "hourlyRate" SET NOT NULL;

-- 5) Add updatedAt column with millisecond precision and default current timestamp
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Optional: backfill updatedAt for existing rows (set to createdAt if present)
UPDATE "Client" SET "updatedAt" = COALESCE("updatedAt", "createdAt") WHERE "updatedAt" IS NULL;
