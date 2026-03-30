Title: Replace global.fetch mocks with MSW in component tests

Description:
Many tests set `global.fetch` directly; MSW provides more accurate and isolated request mocking and better test hygiene.

Acceptance criteria:
- Add MSW dev/test setup and update `jest.setup.ts` to start/stop MSW.
- Replace global.fetch mocks in `__tests__/*` with MSW handlers.
- Ensure tests run reliably and restore network behavior between tests.

Labels: testing
Priority: medium
