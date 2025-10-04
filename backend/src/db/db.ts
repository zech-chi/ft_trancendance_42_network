// src/db/db.ts
import Database from "better-sqlite3";

const db = new Database("app.db");


db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    twofa_secret TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

export default db;