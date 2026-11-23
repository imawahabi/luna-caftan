import { PrismaClient } from '@prisma/client';

// Force Prisma to use the classic Node-API engine in this app runtime.
// This prevents accidental fallback to client engine mode that expects prisma:// URLs.
if (process.env.PRISMA_CLIENT_ENGINE_TYPE !== 'library') {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'library';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
