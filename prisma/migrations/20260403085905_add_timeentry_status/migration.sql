-- CreateEnum
CREATE TYPE "TimeEntryStatus" AS ENUM ('RUNNING', 'COMPLETED');

-- AlterTable
ALTER TABLE "TimeEntry" ADD COLUMN     "status" "TimeEntryStatus" NOT NULL DEFAULT 'RUNNING';
