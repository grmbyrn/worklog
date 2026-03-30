Title: Unify and validate environment variable names

Description:
README, runtime code, and `app/lib/env.ts` use inconsistent names for secrets (e.g., `AUTH_SECRET` vs `NEXTAUTH_SECRET`) which causes confusion and runtime errors. CI and docs don't enforce a single canonical set of env vars.

Acceptance criteria:
- Update `.env.example` and `README.md` to list canonical env variable names.
- Add runtime validation in `app/lib/env.ts` that throws with a clear message when required vars are missing.
- Add a CI check (node script or lint rule) that ensures `.env.example` and code expectations match.
- Document env usage in README.

Labels: enhancement, tech-debt
Priority: medium
