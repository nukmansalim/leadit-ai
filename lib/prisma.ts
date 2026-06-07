import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

const isWorker = typeof process !== "undefined" && process.argv && process.argv.some((arg) => arg.includes("worker-runner"));
const defaultMax = isWorker ? 3 : 5;
const maxPoolSize = process.env.DB_POOL_MAX 
  ? parseInt(process.env.DB_POOL_MAX, 10) 
  : defaultMax;

const pool = new Pool({ 
  connectionString,
  max: maxPoolSize,
});
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;