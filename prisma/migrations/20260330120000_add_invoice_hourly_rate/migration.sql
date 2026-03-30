-- Add hourlyRate column to Invoice
ALTER TABLE "Invoice" ADD COLUMN "hourlyRate" NUMERIC(10,2) NOT NULL DEFAULT 0;
