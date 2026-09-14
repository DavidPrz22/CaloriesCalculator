import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.DATABASE_PRIVATE_URL ||
  process.env.POSTGRES_URL ||
  "postgresql://build:build@localhost:5432/build?schema=public";

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
