"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const users_1 = require("./Data/users");
/*
    .headers on
    .mode column
    SELECT * FROM Users;
*/
// connect to database 
const db = new sqlite3_1.default.Database('Database/DataBase.db', (err) => {
    if (err) {
        console.log("❌ Error opening database: ", err);
    }
    else {
        console.log("✅ Connected to DataBase.db");
    }
});
db.serialize(() => {
    // create Users table if it doesn't exist yet
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id TEXT PRIMARY KEY,
            fullName TEXT,
            userName TEXT,
            bio TEXT,
            imageUrl TEXT,
            rank INTEGER,
            level INTEGER,
            progress REAL,
            online INTEGER
        )
    `, (err) => {
        if (err) {
            console.log("❌ Error creating Users table: ", err);
        }
        else {
            console.log("✅ Users table created (if not existed)!");
        }
    });
    const statementUsers = db.prepare(`
        INSERT OR REPLACE INTO Users (id, fullName, userName, bio, imageUrl, rank, level, progress, online)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
    users_1.Users.forEach(user => {
        statementUsers.run([
            user.id,
            user.fullName,
            user.userName,
            user.bio,
            user.imageUrl,
            user.rank,
            user.level,
            user.progress,
            user.online
        ]);
    });
    statementUsers.finalize();
    const userNameToFind = 'sawf';
    db.get(`SELECT * FROM Users WHERE userName = ?`, [userNameToFind], (err, row) => {
        if (err)
            console.log("❌ Error running query:", err);
        else if (row)
            console.log("✅ User found: ", row);
        else
            console.log("❌ No user found with userName = ", userNameToFind);
    });
    db.close();
});
