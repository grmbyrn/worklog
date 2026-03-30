Title: Normalize API fetch URLs to absolute root

Description:
Code inconsistently uses `api/clients` vs `/api/clients`, causing bugs when base paths differ.

Acceptance criteria:
- Update client-side fetch calls to use absolute root URLs (leading `/api/...`) everywhere.
- Add a small utility `apiFetch('/clients')` to centralize base path handling (optional).
- Add unit tests covering fetch URL formation.

Labels: tech-debt
Priority: low
