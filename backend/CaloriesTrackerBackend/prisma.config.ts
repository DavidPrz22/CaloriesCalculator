import "dotenv/config";
import { defineConfig } from "prisma/config";

function getDatabaseUrl(): string {
  const direct =
    process.env.DATABASE_URL ||
    process.env.DATABASE_PRIVATE_URL ||
    process.env.POSTGRES_URL;
  if (direct) return direct;

  const user = process.env.PGUSER || process.env.POSTGRES_USER;
  const password = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;
  const host = process.env.PGHOST || process.env.POSTGRES_HOST;
  const port = process.env.PGPORT || process.env.POSTGRES_PORT || "5432";
  const database = process.env.PGDATABASE || process.env.POSTGRES_DB;
  if (user && password && host && database) {
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}?schema=public`;
  }

  throw new Error(
    "DATABASE_URL is not set. In Railway, open the backend service → Variables and add DATABASE_URL=${{Postgres.DATABASE_URL}} (use your Postgres service name)."
  );
}

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
