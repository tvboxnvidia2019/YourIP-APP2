import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Create SQLite database connection
const dbPath = path.join(dataDir, 'iptracker.db');
const sqlite = new Database(dbPath);

// Enable WAL mode for better concurrent access
sqlite.pragma('journal_mode = WAL');

// Create Drizzle instance
const db = drizzle(sqlite, { schema });

// Run migrations
(async () => {
  try {
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('Database migrated successfully.');
  } catch (err) {
    console.error('Database migration failed:', err);
    process.exit(1);
  }
})();

export { sqlite as pool, db };