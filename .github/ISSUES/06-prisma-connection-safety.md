Title: Ensure Prisma connection handling is safe for serverless

Description:
Database connection pooling and client lifecycle must follow recommended patterns for serverless environments to avoid connection exhaustion.

Acceptance criteria:
- Confirm `app/lib/prisma.ts` follows the recommended global singleton pattern and conditional logging.
- Add environment-aware pooling or documentation on using a proxy (PgBouncer) in production.
- Add CI smoke test verifying the Prisma client can initialize in a simulated serverless environment.

Labels: enhancement, tech-debt
Priority: medium
