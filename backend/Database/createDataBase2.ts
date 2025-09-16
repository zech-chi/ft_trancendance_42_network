import sqlite3 from "sqlite3";
import { Users, RadarData, ChartsData, YearlyStats, Games, friendsData } from "./users"
import { stat } from "fs";


/*
    .headers on
    .mode column
    SELECT * FROM Users;


    .headers on
    .mode column
    SELECT * FROM RadarData;
*/


// connect to database 
const db = new sqlite3.Database('./DataBase.db', (err) => {
    if (err) {
        console.log("❌ Error opening database: ", err);
    } else {
        console.log("✅ Connected to DataBase.db");
    }
});

db.serialize( () => {
    /*
        Create Users table
    */
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName TEXT,
            userName TEXT,
            email TEXT,
            password TEXT,
            bio TEXT DEFAULT 'Hello! I am new here 👋',
            imageUrl TEXT DEFAULT '/default_avatar.png',
            rank INTEGER DEFAULT 0,
            level INTEGER DEFAULT 0,
            progress REAL DEFAULT 0,
            online INTEGER DEFAULT 0
        )
    `, (err: any) => {
        if (err) {
            console.log("❌ Error creating Users table: ", err);
        } else {
            console.log("✅ Users table created (if not existed)!");
        }
    });

    
    /*
        Create RadarData table
    */
    db.run(`
        CREATE TABLE IF NOT EXISTS RadarData (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            Quick_Reflexes REAL DEFAULT 0,
            Strategic_Thinking REAL DEFAULT 0,
            Precision_Shots REAL DEFAULT 0,
            Pattern_Recognition REAL DEFAULT 0,
            Anticipating_Moves REAL DEFAULT 0,
            Board_Control REAL DEFAULT 0,
            Adaptive_Playstyle REAL DEFAULT 0,
            Risk_Management REAL DEFAULT 0,
            Mind_Games REAL DEFAULT 0,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `, (err: any) => {
        if (err) {
            console.log("❌ Error creating RadarData table: ", err);
        } else {
            console.log("✅ RadarData table created (if not existed)!");
        }
    });


    /*
        Create ChartsData table
    */

    db.run(`
        CREATE TABLE IF NOT EXISTS ChartsData (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            game TEXT NOT NULL,
            totalGamesWithAi   INTEGER DEFAULT 0,
            gamesWithAiEasy    INTEGER DEFAULT 0,
            gamesWithAiMedium  INTEGER DEFAULT 0,
            gamesWithAiHard    INTEGER DEFAULT 0,
            totalWins          INTEGER DEFAULT 0,
            easyWins           INTEGER DEFAULT 0,
            mediumWins         INTEGER DEFAULT 0,
            hardWins           INTEGER DEFAULT 0,
            friendsWins        INTEGER DEFAULT 0,
            friendsLosses      INTEGER DEFAULT 0,
            friendsTotalGames  INTEGER DEFAULT 0,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `, (err: any) => {
        if (err) {
            console.log("❌ Error creating ChartsData table: ", err);
        } else {
            console.log("✅ ChartsData table created (if not existed)!");
        }
    });

    /*
        Create YearlyStats table
    */
    db.run(`
        CREATE TABLE IF NOT EXISTS YearlyStats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            year INTEGER NOT NULL,
            totalGames INTEGER DEFAULT 0,
            totalActiveDays INTEGER DEFAULT 0,
            maxStreak INTEGER DEFAULT 0,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT unique_user_year UNIQUE(userId, year)
        )
    `, (err: any) => {
        if (err) {
            console.log("❌ Error creating YearlyStats table: ", err);
        } else {
            console.log("✅ YearlyStats table created (if not existed)!");
        }
    });


    /*
        Create DailyActivity in DailyActivity table
    */
    db.run(`
        CREATE TABLE IF NOT EXISTS DailyActivity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            yearlyStatsId      INTEGER NOT NULL,
            year               INTEGER NOT NULL,
            day                INTEGER NOT NULL CHECK(day >= 1 AND day <= 366),
            activity           REAL,
            FOREIGN KEY (yearlyStatsId) REFERENCES YearlyStats(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `, (err: any) => {
        if (err) {
            console.log("❌ Error creating DailyActivity table: ", err);
        } else {
            console.log("✅ DailyActivity table created (if not existed)!");
        }
    });


    /*
        Create Games History table
    */
    db.run(`
        CREATE TABLE IF NOT EXISTS Games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user1 INTEGER NOT NULL,
            user2 INTEGER NOT NULL,
            user1_score INTEGER NOT NULL DEFAULT 0,
            user2_score INTEGER NOT NULL DEFAULT 0,
            user1_win INTEGER NOT NULL DEFAULT 0, -- 1 if user1 wins, 0 otherwise
            date_played DATETIME DEFAULT CURRENT_TIMESTAMP,
            game_type TEXT NOT NULL DEFAULT 'pong' CHECK (game_type IN ('pong', 'parchesi')),
            FOREIGN KEY (user1) REFERENCES Users(id) ON DELETE CASCADE,
            FOREIGN KEY (user2) REFERENCES Users(id) ON DELETE CASCADE
        );
    `, (err: any) => {
        if (err) {
            console.log("❌ Error creating Games table: ", err);
        } else {
            console.log("✅ Games table created (if not existed)!");
        }
    });

    
    /*
        Create Friends table
    */
    db.run(`
        CREATE TABLE IF NOT EXISTS Friends (
            sender_id INTEGER NOT NULL,
            receiver_id INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
            blocked_by INTEGER,
            FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE,
            FOREIGN KEY (receiver_id) REFERENCES Users(id) ON DELETE CASCADE,
            FOREIGN KEY (blocked_by) REFERENCES Users(id),
            PRIMARY KEY (sender_id, receiver_id)
        );
    `, (err: any) => {
        if (err) {
            console.log("❌ Error creating Friends table: ", err);
        } else {
            console.log("✅ Friends table created (if not existed)!");
        }
    });

});

db.close();

