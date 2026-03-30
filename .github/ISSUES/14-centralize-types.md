Title: Centralize shared types and interfaces

Description:
Interfaces (Invoice, Client, TimeEntry) are duplicated across pages. Centralized types improve maintainability.

Acceptance criteria:
- Add `app/lib/types.ts` (or `app/types.ts`) with shared interfaces.
- Update pages and API routes to import shared types.
- Add a lint rule or README note encouraging use of shared types.

Labels: tech-debt
Priority: medium
