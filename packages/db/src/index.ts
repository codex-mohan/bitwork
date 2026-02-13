import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "./env";
// biome-ignore lint/performance/noNamespaceImport: Drizzle requires wildcard import for schema
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  client: postgres.Sql | undefined;
  db: PostgresJsDatabase<typeof schema> | undefined;
};

// Lazy initialization of the database connection
// This prevents connection attempts during module resolution
function createClient() {
  if (globalForDb.client) {
    return globalForDb.client;
  }

  const client = postgres(env.DATABASE_URL, {
    prepare: false,
    // Connection settings optimized for serverless/Next.js environments
    max: 1,
    idle_timeout: 20,
    connect_timeout: 30,
    // Enable SSL for Supabase connections
    ssl: "require",
  });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.client = client;
  }

  return client;
}

// Export a getter function that lazily initializes the connection
// This ensures the connection is only created when actually needed
export const db: PostgresJsDatabase<typeof schema> = new Proxy(
  {} as PostgresJsDatabase<typeof schema>,
  {
    get(_, prop) {
      const actualDb = globalForDb.db ?? drizzle(createClient(), { schema });
      if (!globalForDb.db && process.env.NODE_ENV !== "production") {
        globalForDb.db = actualDb;
      }
      return Reflect.get(actualDb, prop, actualDb);
    },
  }
);

// biome-ignore lint/performance/noBarrelFile: This is the package entry point
export * from "./schema";
