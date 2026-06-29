// prisma.config.ts
// Prisma 7 configuration file - detected automatically at project root

import { defineConfig, env } from "prisma/config";
import path from "node:path";

export default defineConfig({
  // Path to your Prisma schema file
  schema: path.join(__dirname, "prisma", "schema.prisma"),

  datasource: {
    // ─── Required ───────────────────────────────────────────────────
    // Primary database URL (Turso/libSQL)
    // Must be set in both local .env and Vercel environment variables
    url: env("DATABASE_URL"),

    // ─── Optional ───────────────────────────────────────────────────
    // Shadow database for `prisma migrate dev` (migration validation)
    //
    // - Required locally for running `prisma migrate dev`
    // - NOT required for `prisma migrate deploy` (used in production)
    // - NOT required for `prisma db push`
    //
    // Setup: Create a separate Turso database and set SHADOW_DATABASE_URL
    // in your local .env file only. Do NOT set this on Vercel.
    //
    // The conditional spread below ensures this property is only included
    // when the environment variable exists, preventing errors in production.
    ...(process.env.SHADOW_DATABASE_URL && {
      shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),
    }),
  },
});