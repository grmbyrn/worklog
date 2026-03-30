Title: Add rate limiting / abuse protection to API routes

Description:
Public API routes (e.g., invoices, timer, clients) lack rate limits which may enable abuse or accidental overload.

Acceptance criteria:
- Add a middleware or route-level rate limiter (IP + auth-aware) and apply to sensitive routes in `app/api/*`.
- Document limits and provide error responses with `429` and `Retry-After` header.
- Add basic tests simulating throttling behavior.

Labels: security, enhancement
Priority: medium
