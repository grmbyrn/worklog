-- CreateEnum
CREATE TYPE "TimeEntryStatus" AS ENUM ('RUNNING', 'COMPLETED');

-- AlterTable
ALTER TABLE "TimeEntry" ADD COLUMN     "status" "TimeEntryStatus" NOT NULL DEFAULT 'RUNNING';
-- Backfill existing entries: if an entry already has an endTime, mark it COMPLETED
UPDATE "TimeEntry"
SET "status" = 'COMPLETED'
WHERE "endTime" IS NOT NULL;
