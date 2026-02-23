import { validateEnv } from '../app/lib/env';

describe('validateEnv', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('throws if a required env var is missing', () => {
    delete process.env.DATABASE_URL;
    delete process.env.NEXTAUTH_SECRET;
    delete process.env.NEXTAUTH_URL;
    expect(() => validateEnv()).toThrow(/Missing required environment variables/);
  });

  it('does not throw if all required env vars are present', () => {
    process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db';
    process.env.NEXTAUTH_SECRET = 'secret';
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
    expect(() => validateEnv()).not.toThrow();
  });
});
