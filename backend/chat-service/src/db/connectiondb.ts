// This file initializes the SQLite database connection and schema for the chat application.
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import type { Database as DBType } from "better-sqlite3";

const dbPath = path.resolve(__dirname, "chat.db");
const schemaPath = path.resolve(__dirname, "schema.sql");

function initDB(): DBType {
  try {
    if (!fs.existsSync(path.dirname(dbPath))) {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at path: ${schemaPath}`);
    }

    // wait for reading the schema file
    const schema = fs.readFileSync(schemaPath, "utf-8");
    const db = new Database(dbPath);
    db.exec("PRAGMA foreign_keys = ON;");
    db.exec(schema);

    return db;
  } catch (error) {
    console.error("❌ DB Initialization Error:", error);
    process.exit(1);
  }
}

const db = initDB();
console.log("✅ Database initialized successfully at:", dbPath);

export default db;


