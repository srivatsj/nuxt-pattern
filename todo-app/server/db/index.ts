import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { join } from 'pathe'; // Using pathe for path joining, common in Nuxt/Nitro
import { useRuntimeConfig } from '#imports'; // For accessing runtime config if needed for db path

// Determine database path
// In development, store it in the .nuxt directory to keep project root clean.
// For production, you might want a more persistent location.
const dbPath = process.env.DB_PATH || (process.dev ? join(process.cwd(), '.nuxt/db.sqlite3') : join(process.cwd(), 'db.sqlite3'));

if (process.dev) {
  console.log(`Using SQLite database at: ${dbPath}`);
}

const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema, logger: process.dev }); // Enable logger in dev

// Utility for H3 event context (server routes)
// import { H3Event } from 'h3';
// export function useDb(event?: H3Event) {
//   // If you need to set up per-request DB or attach to event context
//   // For a simple app, the global `db` instance is often sufficient.
//   return db;
// }
