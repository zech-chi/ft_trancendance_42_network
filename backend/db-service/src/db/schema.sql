-- CREATE TABLE IF NOT EXISTS users (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   name TEXT NOT NULL,
--   username TEXT UNIQUE NOT NULL,
--   password_hash TEXT NOT NULL,
--   avatar TEXT,
--   online BOOLEAN DEFAULT FALSE,
--   last_seen INTEGER,
--   message TEXT,
--   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE IF NOT EXISTS Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName TEXT,
  userName TEXT,
  email TEXT,
  password TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  twofa_enabled BOOLEAN DEFAULT FALSE,
  twofa_secret TEXT,
  bio TEXT DEFAULT 'Hello! I am new here 👋',
  imageUrl TEXT DEFAULT '/default_avatar.png',
  rank INTEGER DEFAULT 0,
  last_seen INTEGER,
  level INTEGER DEFAULT 0,
  progress REAL DEFAULT 0,
  online INTEGER DEFAULT 0,
  online_in_chat BOOLEAN DEFAULT FALSE,
  last_seen_in_chat INTEGER
);

CREATE TABLE IF NOT EXISTS EmailVerifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    verificationCode TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    expiresAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

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
);

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
);

CREATE TABLE IF NOT EXISTS YearlyStats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    year INTEGER NOT NULL,
    totalGames INTEGER DEFAULT 0,
    totalActiveDays INTEGER DEFAULT 0,
    maxStreak INTEGER DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT unique_user_year UNIQUE(userId, year)
);

CREATE TABLE IF NOT EXISTS DailyActivity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    yearlyStatsId      INTEGER NOT NULL,
    year               INTEGER NOT NULL,
    day                INTEGER NOT NULL CHECK(day >= 1 AND day <= 366),
    activity           REAL,
    FOREIGN KEY (yearlyStatsId) REFERENCES YearlyStats(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user1 INTEGER NOT NULL,
    user2 INTEGER NOT NULL,
    user1_score INTEGER NOT NULL DEFAULT 0,
    user2_score INTEGER NOT NULL DEFAULT 0,
    user1_win INTEGER NOT NULL DEFAULT 0, -- 1 if user1 wins, 0 otherwise
    date_played DATETIME DEFAULT CURRENT_TIMESTAMP,
    game_type TEXT NOT NULL DEFAULT 'pong' CHECK (game_type IN ('pong', 'parcheesi')),
    FOREIGN KEY (user1) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2) REFERENCES Users(id) ON DELETE CASCADE
);

-- add by youssef: ParchisiGame game table
CREATE TABLE IF NOT EXISTS ParchisiGames (
  id INTEGER PRIMARY KEY AUTOINCREMENT,        -- game ID
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ended_at DATETIME,
  
  player1_id INTEGER NOT NULL,
  player2_id INTEGER NOT NULL,
  player3_id INTEGER,
  player4_id INTEGER,
  
  winner_id INTEGER,                           -- who won
  status TEXT DEFAULT 'playing' CHECK (status IN ('finished', 'playing')),

  
  FOREIGN KEY (player1_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (player2_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (player3_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (player4_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (winner_id) REFERENCES Users(id) ON DELETE SET NULL
);

-- CREATE TABLE IF NOT EXISTS friends (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   user_id INTEGER NOT NULL,
--   friend_id INTEGER NOT NULL,
--   status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'blocked')),
--   blocked_by INTEGER,
--   UNIQUE(user_id, friend_id),
--   FOREIGN KEY(user_id) REFERENCES users(id),
--   FOREIGN KEY(friend_id) REFERENCES users(id)
-- );

CREATE TABLE IF NOT EXISTS Friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
    blocked_by INTEGER DEFAULT NULL,
    UNIQUE(sender_id, receiver_id),
    FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_by) REFERENCES Users(id)
);

-- CREATE TABLE Friends (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     sender_userName TEXT NOT NULL,
--     receiver_userName TEXT NOT NULL,
--     status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
--     blockedBy TEXT REFERENCES Users(userName),
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (sender_userName) REFERENCES Users(userName),
--     FOREIGN KEY (receiver_userName) REFERENCES Users(userName),
--     UNIQUE (sender_userName, receiver_userName),
--     FOREIGN KEY (blockedBy) REFERENCES Users(userName)
-- );

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'text' CHECK(type IN ('text', 'image', 'file', 'audio')),
  message TEXT,         -- optional: text content or caption
  url TEXT,             -- optional: file or image URL
  file_name TEXT,       -- optional: original file name
  thumbnail_url TEXT,   -- optional: used for PDF preview or video thumb
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(sender_id) REFERENCES users(id),
  FOREIGN KEY(receiver_id) REFERENCES users(id)
);

-- INSERT OR IGNORE INTO users (username, password_hash)
-- VALUES ('admin', '$2y$10$eImiTMZG4q4m5a1j...');

-- INSERT OR IGNORE INTO users (username, password_hash)
-- VALUES ('user1', '$2y$10$eImiTMZG4q4m5a1j...');

-- INSERT OR IGNORE INTO users (username, password_hash)
-- VALUES ('user2', '$2y$10$eImiTMZG4q4m5a1j...');

-- -- create a sample friend relationship
-- INSERT OR IGNORE INTO friends (user_id, friend_id)
-- VALUES ((SELECT id FROM users WHERE username = 'admin'),
--         (SELECT id FROM users WHERE username = 'user1'));

-- INSERT OR IGNORE INTO users (id, name, username, password_hash, avatar, online, last_seen, message)
-- VALUES
-- (1, 'zakaria', 'zelabbas', 'hash123', 'https://cdn.intra.42.fr/users/520fcec86c5c997878e60f48d447f0a1/zelabbas.jpg', 1, strftime('%s','now') - 2*60, 'Hello! It is nice to meet you. Is there something I can help you with...'),

-- (2, 'mohamed', 'mkarim', 'hash123', 'https://cdn.intra.42.fr/users/db4a3023c112e0d3d3bcf65d84609d6f/mkarim.jpg', 1, strftime('%s','now') - 5*60, 'Hello! It is nice to meet you. Is there something I can help you with...'),

-- (3, 'zechechafoui', 'zechi', 'hash123', 'https://cdn.intra.42.fr/users/d450751394f7288bce91b5b7123585d4/zech-chi.jpg', 0, strftime('%s','now') - 10*60, 'Hello! It is nice to meet you. Is there something I can help you with...'),

-- (4, 'taha', 'tkannane', 'hash123', 'https://cdn.intra.42.fr/users/48278b81919442a7e864dd8fc9810d81/tkannane.jpg', 1, strftime('%s','now') - 15*60, 'Hello! It is nice to meet you. Is there something I can help you with...'),

-- (5, 'mohamed takrayout', 'mohtakara', 'hash123', 'https://cdn.intra.42.fr/users/999ab4136febfd6fb81fb7d0aaea002a/mohtakra.jpg', 0, strftime('%s','now') - 20*60, 'Hello! It is nice to meet you. Is there something I can help you with...'),

-- (6, 'Youssef Momen', 'youssef', 'hash123', 'https://cdn.intra.42.fr/users/482db2393d65a8be9100b6c3f1782d36/ymomen.jpg', 1, strftime('%s','now') - 60*60, 'Hi there!'),

-- (7, 'said karim', 'skaim', 'hash123', 'https://cdn.intra.42.fr/users/73f492a6c8054950e96a3cdc923fba0f/skarim.jpg', 0, strftime('%s','now') - 2*60*60, 'Hello! It is nice to meet you. Is there something I can help you with...'),

-- (8, 'taha boussadan', 'tboussad', 'hash123', 'https://cdn.intra.42.fr/users/9a6bfae27cee69ffd2749dd460957b63/tboussad.jpg', 1, strftime('%s','now') - 2*60*60, 'Hello! It is nice to meet you. Is there something I can help you with...'),
-- (9, 'ilayss ezzam', 'iezzam', 'hash123', 'https://cdn.intra.42.fr/users/456d9a4c3b8c43b4b94e6e8eb6950b7d/iezzam.jpg', 1, strftime('%s','now') - 2*60*60, 'Hello! It is nice to meet you. Is there something I can help you with...');


-- INSERT OR IGNORE INTO friends (user_id, friend_id)
-- VALUES ((SELECT id FROM users WHERE username = 'zelabbas'),
--         (SELECT id FROM users WHERE username = 'mohtakara'));

-- INSERT OR IGNORE INTO friends (user_id, friend_id)
-- VALUES ((SELECT id FROM users WHERE username = 'zelabbas'),
--         (SELECT id FROM users WHERE username = 'zechi'));

-- INSERT OR IGNORE INTO friends (user_id, friend_id)
-- VALUES ((SELECT id FROM users WHERE username = 'zelabbas'),
--         (SELECT id FROM users WHERE username = 'iezzam'));

INSERT OR IGNORE INTO Users (id, fullName, userName, email, password, bio, imageUrl, rank, last_seen, level, progress, online)
VALUES
(1, 'Zakaria Echifaouy', 'zelabbas', 'zakaria@example.com', 'hash12345', 'Hello! It is nice to meet you 👋', 'https://cdn.intra.42.fr/users/520fcec86c5c997878e60f48d447f0a1/zelabbas.jpg', 1, strftime('%s','now') - 120, 5, 0.75, 1),

(2, 'Mohamed Karim', 'mkarim', 'mkarim@example.com', 'hash12345', 'Excited to join 🚀', 'https://cdn.intra.42.fr/users/db4a3023c112e0d3d3bcf65d84609d6f/mkarim.jpg', 2, strftime('%s','now') - 300, 3, 0.45, 1),

(3, 'Zechechafoui', 'zechi', 'zechi@example.com', 'hash12345', 'Let’s play!', 'https://cdn.intra.42.fr/users/d450751394f7288bce91b5b7123585d4/zech-chi.jpg', 0, strftime('%s','now') - 600, 2, 0.2, 0),

(4, 'Taha Kannane', 'tkannane', 'taha@example.com', 'hash12345', 'Love challenges ⚡', 'https://cdn.intra.42.fr/users/48278b81919442a7e864dd8fc9810d81/tkannane.jpg', 3, strftime('%s','now') - 900, 4, 0.6, 1),

(5, 'Mohamed Takrayout', 'mohtakara', 'mohtakara@example.com', 'hash12345', 'Chess & Pong addict 🏓', 'https://cdn.intra.42.fr/users/999ab4136febfd6fb81fb7d0aaea002a/mohtakra.jpg', 1, strftime('%s','now') - 1800, 1, 0.1, 0);


INSERT OR IGNORE INTO Friends (sender_id, receiver_id, status)
VALUES
(1, 2, 'accepted'),
(1, 3, 'accepted'),
(1, 4, 'pending'),
(2, 5, 'blocked');
-- (6, 7, 'accepted');


-- Update a specific relation between two users
-- UPDATE Friends
-- SET status = 'pending', blocked_by = NULL
-- WHERE sender_id = 6 AND receiver_id = 7;


-- DELETE FROM Friends
-- WHERE (sender_id = 6 AND receiver_id = 7)
--    OR (sender_id = 7 AND receiver_id = 6);



INSERT OR REPLACE INTO RadarData 
(userId, Quick_Reflexes, Strategic_Thinking, Precision_Shots, Pattern_Recognition, Anticipating_Moves, Board_Control, Adaptive_Playstyle, Risk_Management, Mind_Games)
VALUES
(1, 17, 14, 18, 12, 15, 16, 14, 13, 12),
(2, 12, 17, 14, 16, 13, 14, 15, 12, 11),
(3, 8, 10, 11, 9, 12, 10, 8, 7, 6),
(4, 18, 18, 19, 17, 16, 17, 18, 17, 18),
(5, 10, 12, 11, 13, 12, 12, 11, 11, 10);


INSERT OR IGNORE INTO ChartsData (userId, game, totalGamesWithAi, gamesWithAiEasy, gamesWithAiMedium, gamesWithAiHard, totalWins, easyWins, mediumWins, hardWins, friendsWins, friendsLosses, friendsTotalGames)
VALUES
(1, 'pong', 50, 20, 20, 10, 30, 10, 12, 8, 5, 3, 8),
(2, 'parcheesi', 40, 15, 15, 10, 18, 8, 6, 4, 7, 6, 13),
(3, 'pong', 10, 5, 3, 2, 3, 1, 1, 1, 2, 5, 7),
(4, 'pong', 100, 40, 35, 25, 60, 20, 25, 15, 30, 20, 50),
(5, 'parcheesi', 25, 10, 10, 5, 12, 6, 4, 2, 4, 7, 11);

INSERT OR IGNORE INTO YearlyStats (userId, year, totalGames, totalActiveDays, maxStreak)
VALUES
(1, 2025, 120, 90, 15),
(2, 2025, 85, 60, 10),
(3, 2025, 20, 15, 3),
(4, 2025, 200, 150, 30),
(5, 2025, 45, 30, 6);

INSERT OR IGNORE INTO DailyActivity (yearlyStatsId, year, day, activity)
VALUES
(1, 2025, 250, 5.0),
(1, 2025, 251, 6.5),
(2, 2025, 250, 3.2),
(3, 2025, 250, 1.0),
(4, 2025, 250, 7.8),
(5, 2025, 250, 2.5);


INSERT OR IGNORE INTO Games (user1, user2, user1_score, user2_score, user1_win, game_type)
VALUES
(1, 2, 21, 18, 1, 'pong'),
(2, 3, 20, 22, 0, 'pong'),
(1, 4, 30, 25, 1, 'parcheesi'),
(5, 1, 15, 10, 0, 'pong');

-- while db is running and already created lets add Games data
-- INSERT OR IGNORE INTO Games (user1, user2, user1_score, user2_score, user1_win, game_type)
-- VALUES
-- (3, 4, 18, 21, 0, 'pong'),
-- (2, 5, 25, 20, 1, 'parcheesi'),
-- (4, 5, 22, 22, 0, 'pong'),
-- (11, 18, 19, 17, 1, 'pong'),
-- (11, 1, 19, 17, 1, 'pong'),
-- (11, 2, 19, 17, 1, 'pong'),
-- (11, 3,  19, 17, 1, 'pong'),
-- (11, 4, 19, 17, 1, 'parcheesi');
