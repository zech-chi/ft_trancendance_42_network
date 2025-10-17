// src/db/db.ts
import Database from "better-sqlite3";

// Initialize database connection
const db = new Database("app.db");

// USERS table (existing + new columns)
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    email_verified INTEGER DEFAULT 0, -- 0 = false, 1 = true
    twofa_secret TEXT,                 -- secret for 2FA (base32)
    twofa_enabled INTEGER DEFAULT 0,   -- 0 = false, 1 = true
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// REFRESH TOKENS table
db.prepare(`
  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    revoked INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`).run();

// EMAIL CODES table (for verification / OTP)
db.prepare(`
  CREATE TABLE IF NOT EXISTS email_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    purpose TEXT NOT NULL, -- 'email_verification' | 'login_otp'
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`).run();

//export the type of each table for usage in other files
export type User = {
  id: number;
  username: string;
  password: string;
  email: string;
  email_verified: boolean;
  twofa_secret: string | null;
  twofa_enabled: boolean;
  created_at: Date;
};
export type RefreshToken = {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  revoked: boolean;
};
export type EmailCode = {
  id: number;
  user_id: number | null;
  email: string;
  code: string;
  purpose: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
};

// export type DbType = {
//   users: User;
//   refresh_tokens: RefreshToken;
//   email_codes: EmailCode;
// };

export default db;