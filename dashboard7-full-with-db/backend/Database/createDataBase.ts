import sqlite3 from "sqlite3";
import { Users } from "./Data/users"


/*
    .headers on
    .mode column
    SELECT * FROM Users;
*/


// connect to database 
const db = new sqlite3.Database('Database/DataBase.db', (err) => {
    if (err) {
        console.log("❌ Error opening database: ", err);
    } else {
        console.log("✅ Connected to DataBase.db");
    }
});

db.serialize( () => {
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
    `, (err: any) => {
        if (err) {
            console.log("❌ Error creating Users table: ", err);
        } else {
            console.log("✅ Users table created (if not existed)!");
        }
    });

    const statementUsers = db.prepare(
        `
        INSERT OR REPLACE INTO Users (id, fullName, userName, bio, imageUrl, rank, level, progress, online)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
    )

    
    Users.forEach( user => {
        statementUsers.run(
            [
                user.id,
                user.fullName,
                user.userName,
                user.bio,
                user.imageUrl,
                user.rank,
                user.level,
                user.progress,
                user.online
            ]
        )
    });
    
    statementUsers.finalize();
    
    const userNameToFind = 'sawf';
    db.get(
        `SELECT * FROM Users WHERE userName = ?`, [userNameToFind],
        (err, row) => {
            if (err)
                console.log("❌ Error running query:", err);
            else if (row)
                console.log("✅ User found: ", row);
            else
                console.log("❌ No user found with userName = ", userNameToFind);
        }
    )


    db.close();
});

