Title: Add ESLint/Prettier pre-commit hooks and CI enforcement

Description:
Ensure consistent code style and that linting runs before PRs are merged.

Acceptance criteria:
- Add `lint-staged` + `husky` pre-commit hooks to run `eslint --fix` and `prettier`.
- Ensure CI enforces linting and formatting and fails on violations.
- Document how to run linters locally.

Labels: testing, tech-debt
Priority: medium
