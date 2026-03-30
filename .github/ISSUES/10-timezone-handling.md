Title: Add timezone-aware date handling and consistent formatting

Description:
Dates/times are displayed inconsistently and may mislead users across time zones.

Acceptance criteria:
- Adopt a timezone-aware library (e.g., `date-fns-tz` or `luxon`) and normalize storage/formatting (store UTC, display local).
- Update dashboard, invoices, and timer pages to use the same formatting function.
- Add tests ensuring consistent formatting across a sample set of time zones.

Labels: enhancement
Priority: medium
