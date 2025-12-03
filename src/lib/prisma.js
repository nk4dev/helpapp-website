import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter });

  // Test DB connection on startup (non-blocking). This helps show early failures.
  pool
    .connect()
    .then((c) =>
      c
        .query('SELECT 1')
        .catch((err) => {
          console.error('Prisma PG adapter test query failed:', err.message || err);
        })
        .finally(() => c.release()),
    )
    .catch((err) => {
      console.error('Failed to connect to Postgres from prisma client init:', err.message || err);
    });

  return client;
};

const globalForPrisma = typeof globalThis !== 'undefined' ? globalThis : global;

const prisma = globalForPrisma.prisma || prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
