Title: Expand API route test coverage for auth failures and ownership checks

Description:
Add tests that assert proper status codes and messages when unauthenticated or unauthorized requests happen.

Acceptance criteria:
- Add tests verifying unauthenticated requests return 401 where appropriate, and authenticated-but-not-owner requests return 404/403 as designed.
- Include tests for validation error shapes.
- Add these tests to the integration test suite executed in CI.

Labels: testing
Priority: high
