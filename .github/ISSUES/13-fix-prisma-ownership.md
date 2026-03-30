Title: Fix Prisma ownership checks for update/delete operations

Description:
Some API routes pass composite `where` objects (e.g., `{ id, userId }`) that are invalid unless a composite unique exists. Ownership must be enforced via `findFirst` or separate checks.

Acceptance criteria:
- Replace problematic update/delete calls in API routes (`app/api/clients/[id]/route.ts`, `app/api/timer/[id]/route.ts`, and similar) with a `findFirst({ where: { id, userId } })` ownership check followed by `update({ where: { id } })` or `delete({ where: { id } })`.
- Add unit/integration tests validating ownership enforcement (401/404 on invalid access).
- Add a short comment/example showing the correct pattern for future contributors.

Labels: bug, tech-debt
Priority: high
