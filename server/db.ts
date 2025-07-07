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
    const fs = await import('fs');
    if (existsSync('./migrations') && fs.readdirSync('./migrations').length > 0) {
      await migrate(db, { migrationsFolder: './migrations' });
      console.log('Database migrated successfully.');
    } else {
      console.log('No migrations found, creating tables manually...');
      // Create tables manually if migrations fail
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS ip_lookups (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          ip TEXT NOT NULL,
          ipv6 TEXT,
          city TEXT,
          region TEXT,
          country TEXT,
          country_code TEXT,
          postal_code TEXT,
          latitude REAL,
          longitude REAL,
          timezone TEXT,
          isp TEXT,
          organization TEXT,
          asn TEXT,
          connection_type TEXT,
          proxy INTEGER,
          vpn INTEGER,
          tor INTEGER,
          threat_level TEXT,
          currency TEXT,
          calling_code TEXT,
          language TEXT,
          user_agent TEXT,
          created_at INTEGER NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          username TEXT NOT NULL,
          password TEXT NOT NULL
        );
        
        CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users (username);
      `);
      console.log('Tables created manually.');
    }
  } catch (err) {
    console.error('Database migration failed:', err);
    // Create tables manually as fallback
    try {
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS ip_lookups (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          ip TEXT NOT NULL,
          ipv6 TEXT,
          city TEXT,
          region TEXT,
          country TEXT,
          country_code TEXT,
          postal_code TEXT,
          latitude REAL,
          longitude REAL,
          timezone TEXT,
          isp TEXT,
          organization TEXT,
          asn TEXT,
          connection_type TEXT,
          proxy INTEGER,
          vpn INTEGER,
          tor INTEGER,
          threat_level TEXT,
          currency TEXT,
          calling_code TEXT,
          language TEXT,
          user_agent TEXT,
          created_at INTEGER NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          username TEXT NOT NULL,
          password TEXT NOT NULL
        );
        
        CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users (username);
      `);
      console.log('Tables created manually after migration failure.');
    } catch (createErr) {
      console.error('Failed to create tables manually:', createErr);
    }
  }
})();

export { sqlite as pool, db };