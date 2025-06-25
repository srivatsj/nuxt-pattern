import type { Config } from 'drizzle-kit';

const dbPath = process.env.DB_PATH || './.nuxt/db.sqlite3'; // Adjusted path to be relative to project root for CLI

export default {
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dialect: 'sqlite', // Correct dialect for SQLite
  dbCredentials: {
    url: dbPath, // Path to the SQLite file
  },
  verbose: true,
  strict: true,
} satisfies Config;
