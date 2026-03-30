Title: Allow manual time entry creation, editing, and deletion

Description:
Users need the ability to add or correct time entries manually (not only start/stop). Current UI lacks edit/delete flows for time entries.

Acceptance criteria:
- Add UI for creating manual entries (start/end or duration + date) on `app/timer/page.tsx`.
- Add edit and delete flows in UI and corresponding API endpoints with ownership checks.
- Add validation for overlapping entries and sensible UX for edits.
- Add tests covering the CRUD flows.

Labels: enhancement
Priority: high
