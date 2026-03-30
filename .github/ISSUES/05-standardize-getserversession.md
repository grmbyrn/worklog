Title: Standardize getServerSession / NextAuth usage across routes

Description:
Codebase imports NextAuth helpers inconsistently (different import paths), which can lead to subtle bugs and makes review harder.

Acceptance criteria:
- Pick one canonical import pattern for server session retrieval and document it (e.g., `import { getServerSession } from 'next-auth'`).
- Update all API routes to use the canonical pattern.
- Add a small lint rule or codeowner guidance stating the pattern.

Labels: tech-debt
Priority: low
