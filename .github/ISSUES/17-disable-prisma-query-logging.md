Title: Disable verbose Prisma query logging in production

Description:
Prisma currently logs `query` events; in production this can leak data and increase noise.

Acceptance criteria:
- Modify `app/lib/prisma.ts` to enable query logging only in development or when a DEBUG flag is set.
- Add CI check or README note describing logging behavior.

Labels: tech-debt
Priority: low
