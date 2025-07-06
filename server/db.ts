import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { Pool as PgPool } from 'pg';
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as pgDrizzle } from 'drizzle-orm/node-postgres';
import ws from "ws";
import * as schema from "@shared/schema";
import { migrate as neonMigrate } from 'drizzle-orm/neon-serverless/migrator';
import { migrate as pgMigrate } from 'drizzle-orm/node-postgres/migrator';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Determine if we're using Neon or standard PostgreSQL
const isNeonDatabase = process.env.DATABASE_URL.includes('neon.tech') || process.env.DATABASE_URL.includes('neon.database');

let pool: NeonPool | PgPool;
let db: ReturnType<typeof neonDrizzle> | ReturnType<typeof pgDrizzle>;

if (isNeonDatabase) {
  // Use Neon serverless for Neon databases
  neonConfig.webSocketConstructor = ws;
  pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
  db = neonDrizzle({ client: pool as NeonPool, schema });
} else {
  // Use standard PostgreSQL driver for regular PostgreSQL
  pool = new PgPool({ connectionString: process.env.DATABASE_URL });
  db = pgDrizzle({ client: pool as PgPool, schema });
}

(async () => {
  try {
    if (isNeonDatabase) {
      await neonMigrate(db as ReturnType<typeof neonDrizzle>, { migrationsFolder: './migrations' });
    } else {
      await pgMigrate(db as ReturnType<typeof pgDrizzle>, { migrationsFolder: './migrations' });
    }
    console.log('Database migrated successfully.');
  } catch (err) {
    console.error('Database migration failed:', err);
    process.exit(1);
  }
})();

export { pool, db };