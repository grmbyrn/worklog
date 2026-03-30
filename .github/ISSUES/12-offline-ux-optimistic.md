Title: Improve offline UX and optimistic updates

Description:
CRUD flows are synchronous and may leave the UI stale during network issues. Offline-first behavior and optimistic updates will improve perceived performance.

Acceptance criteria:
- Integrate React Query (or SWR) for data fetching with optimistic updates and retry/backoff.
- Add UI states for offline mode and queued actions if possible (timer persistence already required).
- Add tests simulating offline/slow networks and verify UX.

Labels: enhancement
Priority: medium
