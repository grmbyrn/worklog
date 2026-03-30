Title: Persist running timer across reloads and show active timer in Nav

Description:
The running timer resets on page reload and isn't surfaced globally. Users expect timers to persist across reloads and be visible in the site header.

Acceptance criteria:
- Persist active timer state in `localStorage` (or IndexedDB) and reconcile with server state on load.
- Display active timer in `app/components/Nav.tsx`.
- Ensure synchronization handles clock drift and re-connect scenarios.
- Add unit tests for persistence and reconciliation logic.

Labels: enhancement
Priority: high
