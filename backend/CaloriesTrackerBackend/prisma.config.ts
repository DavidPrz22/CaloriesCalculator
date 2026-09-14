import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.DATABASE_PRIVATE_URL ||
  process.env.DATABASE_PUBLIC_URL ||
  process.env.POSTGRES_URL;

if (!databaseUrl) {
  const related = Object.keys(process.env)
    .filter((k) => /DATABASE|POSTGRES|^PG/i.test(k))
    .join(", ");
  throw new Error(
    `DATABASE_URL is not set. Related env keys: ${related || "(none)"}. On the backend service, add DATABASE_URL as a Variable Reference to your Postgres service.`
  );
}

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
