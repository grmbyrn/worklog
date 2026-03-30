Title: Add centralized input validation for API endpoints

Description:
Routes perform ad-hoc validation. Using a schema validator (e.g., `zod`) will standardize validation, produce consistent error messages, and avoid malformed data reaching Prisma.

Acceptance criteria:
- Introduce schema definitions (Zod) for request payloads (clients, timer, invoices).
- Integrate validation in each API route with consistent 4xx error responses.
- Add unit tests verifying validation errors for bad inputs.

Labels: security, tech-debt
Priority: high
