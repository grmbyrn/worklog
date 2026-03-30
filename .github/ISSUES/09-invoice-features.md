Title: Improve invoice features (unique numbers, currency, templates, emailing)

Description:
Invoice generation needs production features: deterministic unique invoice numbers, currency support, selectable templates, and ability to email/send invoices.

Acceptance criteria:
- Add invoice numbering scheme (configurable prefix + counter or timestamp).
- Add currency support and formatting in invoice generation UI.
- Implement simple templates and ability to select/export PDF.
- Add server-side email sending (SMTP or transactional provider) with retry and audit logging.
- Add tests for generation and email sending (integration or E2E).

Labels: enhancement
Priority: high
