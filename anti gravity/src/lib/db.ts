import Database from 'better-sqlite3';
import path from 'path';

// Store DB in the project root
const dbPath = path.join(process.cwd(), 'firebot_logs.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrent performance
db.pragma('journal_mode = WAL');

// Initialize schema if the table doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS sys_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    localTime TEXT NOT NULL,
    mode TEXT NOT NULL,
    scenario TEXT NOT NULL,
    intensity INTEGER NOT NULL,
    state TEXT NOT NULL,
    primaryBotStatus TEXT NOT NULL,
    secondaryBotStatus TEXT NOT NULL,
    commLink TEXT NOT NULL,
    targetCoords TEXT NOT NULL
  );
`);

export default db;
