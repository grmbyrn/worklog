import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { validateEnv } from './env';

// Lazily initialize Prisma to avoid running environment validation at module import time
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  _prismaInstance?: PrismaClient;
};

let _instance: PrismaClient | undefined = globalForPrisma.prisma;

function createPrismaInstance() {
  validateEnv();

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  const instance = new PrismaClient({ adapter, log: ['query'] });

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = instance;

  return instance;
}

// Export a proxy that will initialize the real PrismaClient on first use.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!_instance) {
      _instance = createPrismaInstance();
    }
    // @ts-ignore
    return (_instance as any)[prop];
  },
  apply(_target, thisArg, args) {
    if (!_instance) {
      _instance = createPrismaInstance();
    }
    // @ts-ignore
    return (_instance as any).apply(thisArg, args);
  },
}) as unknown as PrismaClient;
