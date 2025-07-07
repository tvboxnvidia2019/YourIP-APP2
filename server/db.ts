import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { existsSync, mkdirSync } from 'fs';

// Use hardcoded path for SQLite database
const dbPath = './data/iptracker.db';

// Ensure data directory exists
if (!existsSync('./data')) {
  mkdirSync('./data', { recursive: true });
}

// Ensure migrations directory exists
if (!existsSync('./migrations')) {
  mkdirSync('./migrations', { recursive: true });
}

// Create SQLite database connection
const sqlite = new Database(dbPath);

// Enable WAL mode for better concurrent access
sqlite.pragma('journal_mode = WAL');

// Create Drizzle instance
const db = drizzle(sqlite, { schema });

// Run migrations only if migrations directory has files
(async () => {
  try {
    if (existsSync('./migrations') && require('fs').readdirSync('./migrations').length > 0) {
      await migrate(db, { migrationsFolder: './migrations' });
      console.log('Database migrated successfully.');
    } else {
      console.log('No migrations found, skipping migration step.');
    }
  } catch (err) {
    console.error('Database migration failed:', err);
    // Don't exit process, just log the error
    console.log('Continuing without migrations...');
  }
})();

export { sqlite as pool, db };