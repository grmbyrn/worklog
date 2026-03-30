Title: Add integration tests for API routes with a test DB

Description:
API routes are only lightly covered; integration tests against a test Postgres will prevent regressions and validate ownership/validation logic.

Acceptance criteria:
- Configure a test database and migrations for CI (use `DATABASE_URL` override or dockerized DB).
- Add integration tests for key routes (clients, timer, invoices) including auth, validation, and ownership checks.
- Ensure CI runs migrations and tests as part of the existing workflow.

Labels: testing
Priority: high
