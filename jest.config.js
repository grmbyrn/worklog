/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { 
      tsconfig: { 
        jsx: 'react-jsx',
        paths: {} // disable tsconfig path mapping in ts-jest
      } 
    }],
  },
  moduleNameMapper: {
    '^@/auth$': '<rootDir>/auth.ts',  // specific override first
    '^@/(.*)$': '<rootDir>/app/$1',   // matches tsconfig: @/* -> ./app/*
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
};

module.exports = config;