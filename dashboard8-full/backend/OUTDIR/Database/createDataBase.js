"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const users_1 = require("./users");
/*
    .headers on
    .mode column
    SELECT * FROM Users;


    .headers on
    .mode column
    SELECT * FROM RadarData;
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
    // create RadarData table if it doesn't exist yet
    db.run(`
        CREATE TABLE IF NOT EXISTS RadarData (
            userId TEXT PRIMARY KEY,
            Quick_Reflexes REAL,
            Strategic_Thinking REAL,
            Precision_Shots REAL,
            Pattern_Recognition REAL,
            Anticipating_Moves REAL,
            Board_Control REAL,
            Adaptive_Playstyle REAL,
            Risk_Management REAL,
            Mind_Games REAL,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `, (err) => {
        if (err) {
            console.log("❌ Error creating RadarData table: ", err);
        }
        else {
            console.log("✅ RadarData table created (if not existed)!");
        }
    });
    // insert Users in Users table
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
    // insert RadarData in RadarData table
    const statementRadarData = db.prepare(`
        INSERT OR REPLACE INTO RadarData (
            userId             ,             
            Quick_Reflexes     ,
            Strategic_Thinking ,
            Precision_Shots    ,
            Pattern_Recognition,
            Anticipating_Moves ,
            Board_Control      ,
            Adaptive_Playstyle ,
            Risk_Management    ,
            Mind_Games
        )  
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
    users_1.RadarData.forEach(item => {
        statementRadarData.run([
            item.userId,
            item.Quick_Reflexes,
            item.Strategic_Thinking,
            item.Precision_Shots,
            item.Pattern_Recognition,
            item.Anticipating_Moves,
            item.Board_Control,
            item.Adaptive_Playstyle,
            item.Risk_Management,
            item.Mind_Games
        ]);
    });
    statementRadarData.finalize();
    /*
        Create ChartsData table
    */
    db.run(`
        CREATE TABLE IF NOT EXISTS ChartsData (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId             TEXT NOT NULL,
            game               TEXT NOT NULL,
            totalGamesWithAi   INTEGER,
            gamesWithAiEasy    INTEGER,
            gamesWithAiMedium  INTEGER,
            gamesWithAiHard    INTEGER,
            totalWins          INTEGER,
            easyWins           INTEGER,
            mediumWins         INTEGER,
            hardWins           INTEGER,
            friendsWins        INTEGER,
            friendsLosses      INTEGER,
            friendsTotalGames  INTEGER,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `, (err) => {
        if (err) {
            console.log("❌ Error creating ChartsData table: ", err);
        }
        else {
            console.log("✅ ChartsData table created (if not existed)!");
        }
    });
    // insert ChartsData in ChartsData table
    const statementChartsData = db.prepare(`
        INSERT OR REPLACE INTO ChartsData (
            userId             ,
            game               ,             
            totalGamesWithAi   ,
            gamesWithAiEasy    ,
            gamesWithAiMedium  ,
            gamesWithAiHard    ,
            totalWins          ,
            easyWins           ,
            mediumWins         ,
            hardWins           ,
            friendsWins        ,
            friendsLosses      ,
            friendsTotalGames
        )  
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
    users_1.ChartsData.forEach(item => {
        statementChartsData.run([
            item.userId,
            item.game,
            item.totalGamesWithAi,
            item.gamesWithAiEasy,
            item.gamesWithAiMedium,
            item.gamesWithAiHard,
            item.totalWins,
            item.easyWins,
            item.mediumWins,
            item.hardWins,
            item.friendsWins,
            item.friendsLosses,
            item.friendsTotalGames
        ]);
    });
    statementChartsData.finalize();
    /*
        Create YearlyStats table
    */
    db.run(`
        CREATE TABLE IF NOT EXISTS YearlyStats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId             TEXT NOT NULL,
            year               INTEGER NOT NULL,
            totalGames         INTEGER,
            totalActiveDays    INTEGER,
            maxStreak          INTEGER,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `, (err) => {
        if (err) {
            console.log("❌ Error creating YearlyStats table: ", err);
        }
        else {
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
    `, (err) => {
        if (err) {
            console.log("❌ Error creating DailyActivity table: ", err);
        }
        else {
            console.log("✅ DailyActivity table created (if not existed)!");
        }
    });
    // insert YearlyStats in YearlyStats table
    // const statementYearlyStats = db.prepare(
    //     `
    //     INSERT OR REPLACE INTO YearlyStats (
    //         userId             ,
    //         year               ,
    //         totalGames         ,
    //         totalActiveDays    ,
    //         maxStreak
    //     )  
    //     VALUES (?, ?, ?, ?, ?)
    //     `
    // )
    // YearlyStats.forEach(item => {
    //     statementYearlyStats.run(
    //         [
    //             item.userId          ,
    //             item.year            ,
    //             item.totalGames      ,
    //             item.totalActiveDays ,
    //             item.maxStreak
    //         ]
    //     )
    // });
    // statementYearlyStats.finalize();
    users_1.YearlyStats.forEach(item => {
        db.run(`
            INSERT OR REPLACE INTO YearlyStats (
                userId             ,
                year               ,
                totalGames         ,
                totalActiveDays    ,
                maxStreak
            )  
            VALUES (?, ?, ?, ?, ?)
            `, [
            item.userId,
            item.year,
            item.totalGames,
            item.totalActiveDays,
            item.maxStreak
        ], function (err) {
            if (err) {
                console.log("❌ Error creating YearlyStats table: 1", err);
                return;
            }
            const yearlyStatsId = this.lastID;
            if (!yearlyStatsId) {
                console.log("❌ Error creating YearlyStats table: 2", err);
                return;
            }
            const statementDailyActivity = db.prepare(`
                    INSERT INTO DailyActivity (
                        yearlyStatsId   ,
                        year            ,
                        day             ,
                        activity        
                    )
                    VALUES (?, ?, ?, ?)
                    `);
            item.DailyActivity.forEach((activity, index) => {
                statementDailyActivity.run([yearlyStatsId, item.year, index + 1, activity]);
            });
            statementDailyActivity.finalize();
        });
    });
    // Games Table for history staff
    db.run(`
        CREATE TABLE Games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user1 INTEGER NOT NULL,
            user2 INTEGER NOT NULL,
            user1_score INTEGER NOT NULL,
            user2_score INTEGER NOT NULL,
            user1_win BOOLEAN NOT NULL,
            date_played DATETIME DEFAULT CURRENT_TIMESTAMP,
            game_type TEXT CHECK (game_type IN ('pong', 'parchesi')),
            FOREIGN KEY (user1) REFERENCES Users(username),
            FOREIGN KEY (user2) REFERENCES Users(username)
        );
    `, (err) => {
        if (err) {
            console.log("❌ Error creating Games table: ", err);
        }
        else {
            console.log("✅ Games table created (if not existed)!");
        }
    });
    // insert Games in Games table
    const statementGames = db.prepare(`
        INSERT INTO Games (
            user1, user2, user1_score, user2_score, user1_win, game_type
        )  
        VALUES (?, ?, ?, ?, ?, ?)
        `);
    users_1.Games.forEach(item => {
        statementGames.run([
            item.user1,
            item.user2,
            item.user1_score,
            item.user2_score,
            item.user1_win,
            item.game_type
        ]);
    });
    statementGames.finalize();
    console.log("✅ Games data inserted!");
    // Friends Table for history staff
    db.run(`
        CREATE TABLE Friends (
            sender_userName TEXT NOT NULL,
            receiver_userName TEXT NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_userName) REFERENCES Users(userName),
            FOREIGN KEY (receiver_userName) REFERENCES Users(userName),
            PRIMARY KEY (sender_userName, receiver_userName)
        );
    `, (err) => {
        if (err) {
            console.log("❌ Error creating Friends table: ", err);
        }
        else {
            console.log("✅ Friends table created (if not existed)!");
        }
    });
    const statementFriends = db.prepare(`
        INSERT INTO Friends (
            sender_userName, receiver_userName, status
        )  
        VALUES (?, ?, ?)
        `);
    users_1.friendsData.forEach(item => {
        statementFriends.run([
            item.sender_userName,
            item.receiver_userName,
            item.status
        ]);
    });
    statementFriends.finalize();
});
// db.close();
