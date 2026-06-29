// db.ts
// Runtime Prisma client with libSQL adapter for Turso/local SQLite

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { env } from "prisma/config";

// ─── Database URL ──────────────────────────────────────────────────
// Required in all environments
// - Local:  "file:./db/dev.db"
// - Turso:  "libsql://my-app.turso.io"
const databaseUrl = env("DATABASE_URL");

// ─── Auth Token ────────────────────────────────────────────────────
// Required for Turso, not needed for local SQLite files
// Using optional chaining to gracefully handle local development
const authToken = process.env.TURSO_AUTH_TOKEN;

// ─── Adapter ───────────────────────────────────────────────────────
// The libSQL adapter handles both local SQLite and Turso connections.
// Note: shadowDatabaseUrl is NOT used here — it's only for
// prisma.config.ts during `prisma migrate dev` CLI commands.
const adapter = new PrismaLibSql({
  url: databaseUrl,
  ...(authToken && { authToken }),
});

// ─── Singleton Pattern ─────────────────────────────────────────────
// Prevents multiple PrismaClient instances in development
// (Next.js hot reloading creates new instances without this)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}