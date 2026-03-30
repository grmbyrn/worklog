Title: Add E2E tests covering auth flows, timer lifecycle, and invoice generation

Description:
Critical flows need end-to-end coverage to detect regressions across frontend, API, and DB.

Acceptance criteria:
- Add Playwright (or Cypress) and example E2E tests covering login, starting/stopping timers, creating manual entries, and generating/downloading an invoice.
- Integrate E2E into CI (optionally on nightly runs if heavy).
- Document how to run E2E locally.

Labels: testing
Priority: high
