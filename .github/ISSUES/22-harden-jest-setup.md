Title: Harden Jest setup to avoid leaking mocks between tests

Description:
Current tests override `global.fetch` in many places and may leak mocks across tests.

Acceptance criteria:
- Update `jest.setup.ts` to call `jest.restoreAllMocks()` / `jest.resetAllMocks()` appropriately between tests.
- Add `afterEach` cleanup hooks in tests that mock global state.
- Ensure CI runs tests with isolated environment.

Labels: testing
Priority: medium
