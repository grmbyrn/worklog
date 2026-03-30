Title: Improve error handling and structured logging in API routes

Description:
API routes return ad-hoc errors and lack structured logs. Adding a logger and request ids aids debugging.

Acceptance criteria:
- Integrate a lightweight logger (pino/winston/console wrapper) supporting structured JSON logs.
- Add request id propagation (via middleware) and include in error responses/logs.
- Update a few representative routes to use the logger and add a sample log format in README.
- Add tests ensuring errors produce consistent shapes.

Labels: enhancement, tech-debt
Priority: medium
