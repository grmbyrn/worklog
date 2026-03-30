Title: Harden NextAuth session and cookie settings

Description:
Session/cookie settings are not explicitly configured; production should use secure, short-lived session cookies and appropriate SameSite settings to reduce risk.

Acceptance criteria:
- Update `auth.ts` to specify secure cookies, `sameSite`, explicit session TTL, and cookie options for production.
- Add tests or runtime checks to ensure `secure` is enabled when `NODE_ENV=production`.
- Add a short README note describing session hardening choices.
- Ensure session cookies include `httpOnly`.

Labels: security, enhancement
Priority: high
