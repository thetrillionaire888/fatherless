import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  // Prisma 7 looks for prisma.config.ts at the project root.
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  // Prisma 7: datasource.url is required here for migration / introspection
  // commands (prisma db push, prisma migrate, etc.).
  datasource: {
    url: process.env.TURSO_DATABASE_URL!,
  },
} satisfies PrismaConfig;
