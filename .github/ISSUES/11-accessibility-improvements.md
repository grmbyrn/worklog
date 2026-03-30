Title: Improve accessibility across UI

Description:
Several UI components lack ARIA attributes, keyboard focus management, and may fail contrast checks.

Acceptance criteria:
- Audit key pages (`Nav`, `Timer`, `Clients`, `Invoices`) and fix missing labels, focus order, and keyboard operability.
- Ensure color contrast meets WCAG AA for primary UI elements.
- Add accessibility checks to CI using axe or similar.

Labels: enhancement
Priority: medium
