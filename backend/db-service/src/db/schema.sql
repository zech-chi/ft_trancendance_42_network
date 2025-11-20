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

CREATE TABLE IF NOT EXISTS Calendar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    year INTEGER NOT NULL,
    day INTEGER NOT NULL CHECK(day >= 1 AND day <= 366),
    activity REAL,
    UNIQUE(userId, year, day),
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
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
(1, 'boot', 'boot', 'example@example.com', 'hash12345', 'Hello! It is nice to meet you 👋', 'https://api.dicebear.com/9.x/identicon/svg?seed=700', 0, strftime('%s','now') - 120, 5, 0.75, 1);


INSERT OR IGNORE INTO RadarData 
(userId, Quick_Reflexes, Strategic_Thinking, Precision_Shots, Pattern_Recognition, Anticipating_Moves, Board_Control, Adaptive_Playstyle, Risk_Management, Mind_Games)
VALUES
(1, 17, 14, 18, 12, 15, 16, 14, 13, 12);

INSERT OR IGNORE INTO ChartsData (userId, game, totalGamesWithAi, gamesWithAiEasy, gamesWithAiMedium, gamesWithAiHard, totalWins, easyWins, mediumWins, hardWins, friendsWins, friendsLosses, friendsTotalGames)
VALUES
(1, 'pong', 50, 20, 20, 10, 30, 10, 12, 8, 5, 3, 8),
(1, 'parcheesi', 40, 15, 15, 10, 18, 8, 6, 4, 7, 6, 13);

-- (2, 'Mohamed Karim', 'mkarim', 'mkarim@example.com', 'hash12345', 'Excited to join 🚀', 'https://cdn.intra.42.fr/users/db4a3023c112e0d3d3bcf65d84609d6f/mkarim.jpg', 2, strftime('%s','now') - 300, 3, 0.45, 1),

-- (3, 'Zechechafoui', 'zechi', 'zechi@example.com', 'hash12345', 'Let’s play!', 'https://cdn.intra.42.fr/users/d450751394f7288bce91b5b7123585d4/zech-chi.jpg', 0, strftime('%s','now') - 600, 2, 0.2, 0),

-- (4, 'Taha Kannane', 'tkannane', 'taha@example.com', 'hash12345', 'Love challenges ⚡', 'https://cdn.intra.42.fr/users/48278b81919442a7e864dd8fc9810d81/tkannane.jpg', 3, strftime('%s','now') - 900, 4, 0.6, 1),

-- (5, 'Mohamed Takrayout', 'mohtakara', 'mohtakara@example.com', 'hash12345', 'Chess & Pong addict 🏓', 'https://cdn.intra.42.fr/users/999ab4136febfd6fb81fb7d0aaea002a/mohtakra.jpg', 1, strftime('%s','now') - 1800, 1, 0.1, 0);


-- INSERT OR IGNORE INTO Friends (sender_id, receiver_id, status)
-- VALUES
-- (1, 2, 'accepted'),
-- (1, 3, 'accepted'),
-- (1, 4, 'pending'),
-- (2, 5, 'blocked');
-- (6, 7, 'accepted');


-- Update a specific relation between two users
-- UPDATE Friends
-- SET status = 'pending', blocked_by = NULL
-- WHERE sender_id = 6 AND receiver_id = 7;


-- DELETE FROM Friends
-- WHERE (sender_id = 6 AND receiver_id = 7)
--    OR (sender_id = 7 AND receiver_id = 6);



-- INSERT OR REPLACE INTO RadarData 
-- (userId, Quick_Reflexes, Strategic_Thinking, Precision_Shots, Pattern_Recognition, Anticipating_Moves, Board_Control, Adaptive_Playstyle, Risk_Management, Mind_Games)
-- VALUES
-- (1, 17, 14, 18, 12, 15, 16, 14, 13, 12),
-- (2, 12, 17, 14, 16, 13, 14, 15, 12, 11),
-- (3, 8, 10, 11, 9, 12, 10, 8, 7, 6),
-- (4, 18, 18, 19, 17, 16, 17, 18, 17, 18),
-- (5, 10, 12, 11, 13, 12, 12, 11, 11, 10);


-- INSERT OR IGNORE INTO ChartsData (userId, game, totalGamesWithAi, gamesWithAiEasy, gamesWithAiMedium, gamesWithAiHard, totalWins, easyWins, mediumWins, hardWins, friendsWins, friendsLosses, friendsTotalGames)
-- VALUES
-- (1, 'pong', 50, 20, 20, 10, 30, 10, 12, 8, 5, 3, 8),
-- (2, 'parcheesi', 40, 15, 15, 10, 18, 8, 6, 4, 7, 6, 13),
-- (3, 'pong', 10, 5, 3, 2, 3, 1, 1, 1, 2, 5, 7),
-- (4, 'pong', 100, 40, 35, 25, 60, 20, 25, 15, 30, 20, 50),
-- (5, 'parcheesi', 25, 10, 10, 5, 12, 6, 4, 2, 4, 7, 11);



-- INSERT OR IGNORE INTO Games (user1, user2, user1_score, user2_score, user1_win, game_type)
-- VALUES
-- (1, 2, 21, 18, 1, 'pong'),
-- (2, 3, 20, 22, 0, 'pong'),
-- (1, 4, 30, 25, 1, 'parcheesi'),
-- (5, 1, 15, 10, 0, 'pong');

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


-- for testing Calendar table

-- INSERT INTO Users (id, fullName, userName, email, password)
-- VALUES (7, 'Some User2', 'hello2', 'user82@example.com', 'hash12345');

-- INSERT INTO Users (id, fullName, userName, email, password)
-- VALUES (8, 'Some User', 'hello', 'user8@example.com', 'hash12345');

-- INSERT INTO Calendar (userId, year, day, activity) VALUES
-- (8, 2024, 1, 0.1),
-- (8, 2024, 2, 1.5),
-- (8, 2024, 4, 0.4);

INSERT OR IGNORE INTO Calendar (userId, year, day, activity) VALUES
(1, 2023, 1, 0.3),
(1, 2023, 2, 0.7),
(1, 2023, 3, 0.4),
(1, 2023, 4, 0.8),
(1, 2023, 5, 0.9),
(1, 2023, 6, 0.5),
(1, 2023, 7, 0.6),
(1, 2023, 8, 0.1),
(1, 2023, 9, 0.8),
(1, 2023, 10, 0.4),
(1, 2023, 11, 0.6),
(1, 2023, 12, 0.9),
(1, 2023, 13, 0.2),
(1, 2023, 14, 0.7),
(1, 2023, 15, 0.5),
(1, 2023, 16, 0.6),
(1, 2023, 17, 0.3),
(1, 2023, 18, 0.7),
(1, 2023, 19, 0.8),
(1, 2023, 20, 0.4),
(1, 2023, 21, 0.5),
(1, 2023, 22, 0.9),
(1, 2023, 23, 0.1),
(1, 2023, 24, 0.6),
(1, 2023, 25, 0.7),
(1, 2023, 26, 0.8),
(1, 2023, 27, 0.3),
(1, 2023, 28, 0.5),
(1, 2023, 29, 0.4),
(1, 2023, 30, 0.9),
(1, 2023, 31, 0.1),
(1, 2023, 32, 0.3),
(1, 2023, 33, 0.6),
(1, 2023, 34, 0.5),
(1, 2023, 35, 0.7),
(1, 2023, 36, 0.8),
(1, 2023, 37, 0.4),
(1, 2023, 38, 0.6),
(1, 2023, 39, 0.5),
(1, 2023, 40, 0.2),
(1, 2023, 41, 0.7),
(1, 2023, 42, 0.8),
(1, 2023, 43, 0.3),
(1, 2023, 44, 0.9),
(1, 2023, 45, 0.4),
(1, 2023, 46, 0.7),
(1, 2023, 47, 0.1),
(1, 2023, 48, 0.6),
(1, 2023, 49, 0.8),
(1, 2023, 50, 0.5),
(1, 2023, 51, 0.4),
(1, 2023, 52, 0.3),
(1, 2023, 53, 0.9),
(1, 2023, 54, 0.1),
(1, 2023, 55, 0.6),
(1, 2023, 56, 0.8),
(1, 2023, 57, 0.5),
(1, 2023, 58, 0.7),
(1, 2023, 59, 0.2),
(1, 2023, 60, 0.4),
(1, 2023, 61, 0.3),
(1, 2023, 62, 0.6),
(1, 2023, 63, 0.9),
(1, 2023, 64, 0.8),
(1, 2023, 65, 0.2),
(1, 2023, 66, 0.4),
(1, 2023, 67, 0.7),
(1, 2023, 68, 0.5),
(1, 2023, 69, 0.6),
(1, 2023, 70, 0.8),
(1, 2023, 71, 0.3),
(1, 2023, 72, 0.9),
(1, 2023, 73, 0.5),
(1, 2023, 74, 0.4),
(1, 2023, 75, 0.6),
(1, 2023, 76, 0.7),
(1, 2023, 77, 0.8),
(1, 2023, 78, 0.3),
(1, 2023, 79, 0.9),
(1, 2023, 80, 0.2),
(1, 2023, 81, 0.4),
(1, 2023, 82, 0.7),
(1, 2023, 83, 0.6),
(1, 2023, 84, 0.8),
(1, 2023, 85, 0.5),
(1, 2023, 86, 0.3),
(1, 2023, 87, 0.7),
(1, 2023, 88, 0.6),
(1, 2023, 89, 0.9),
(1, 2023, 90, 0.4),
(1, 2023, 91, 0.5),
(1, 2023, 92, 0.8),
(1, 2023, 93, 0.3),
(1, 2023, 94, 0.1),
(1, 2023, 95, 0.6),
(1, 2023, 96, 0.9),
(1, 2023, 97, 0.4),
(1, 2023, 98, 0.7),
(1, 2023, 99, 0.5),
(1, 2023, 100, 0.6),
(1, 2023, 101, 0.3),
(1, 2023, 102, 0.6),
(1, 2023, 103, 0.5),
(1, 2023, 104, 0.8),
(1, 2023, 105, 0.4),
(1, 2023, 106, 0.7),
(1, 2023, 107, 0.6),
(1, 2023, 108, 0.9),
(1, 2023, 109, 0.2),
(1, 2023, 110, 0.5),
(1, 2023, 111, 0.4),
(1, 2023, 112, 0.7),
(1, 2023, 113, 0.6),
(1, 2023, 114, 0.8),
(1, 2023, 115, 0.3),
(1, 2023, 116, 0.5),
(1, 2023, 117, 0.7),
(1, 2023, 118, 0.6),
(1, 2023, 119, 0.9),
(1, 2023, 120, 0.4),
(1, 2023, 121, 0.5),
(1, 2023, 122, 0.8),
(1, 2023, 123, 0.3),
(1, 2023, 124, 0.6),
(1, 2023, 125, 0.7),
(1, 2023, 126, 0.5),
(1, 2023, 127, 0.9),
(1, 2023, 128, 0.2),
(1, 2023, 129, 0.4),
(1, 2023, 130, 0.6),
(1, 2023, 131, 0.7),
(1, 2023, 132, 0.3),
(1, 2023, 133, 0.5),
(1, 2023, 134, 0.8),
(1, 2023, 135, 0.6),
(1, 2023, 136, 0.9),
(1, 2023, 137, 0.4),
(1, 2023, 138, 0.5),
(1, 2023, 139, 0.7),
(1, 2023, 140, 0.3),
(1, 2023, 141, 0.6),
(1, 2023, 142, 0.8),
(1, 2023, 143, 0.5),
(1, 2023, 144, 0.7),
(1, 2023, 145, 0.4),
(1, 2023, 146, 0.9),
(1, 2023, 147, 0.2),
(1, 2023, 148, 0.6),
(1, 2023, 149, 0.5),
(1, 2023, 150, 0.8),
(1, 2023, 151, 0.3),
(1, 2023, 152, 0.4),
(1, 2023, 153, 0.7),
(1, 2023, 154, 0.6),
(1, 2023, 155, 0.9),
(1, 2023, 156, 0.5),
(1, 2023, 157, 0.4),
(1, 2023, 158, 0.7),
(1, 2023, 159, 0.6),
(1, 2023, 160, 0.3),
(1, 2023, 161, 0.5),
(1, 2023, 162, 0.8),
(1, 2023, 163, 0.6),
(1, 2023, 164, 0.9),
(1, 2023, 165, 0.4),
(1, 2023, 166, 0.5),
(1, 2023, 167, 0.7),
(1, 2023, 168, 0.3),
(1, 2023, 169, 0.6),
(1, 2023, 170, 0.8),
(1, 2023, 171, 0.5),
(1, 2023, 172, 0.7),
(1, 2023, 173, 0.4),
(1, 2023, 174, 0.9),
(1, 2023, 175, 0.2),
(1, 2023, 176, 0.6),
(1, 2023, 177, 0.5),
(1, 2023, 178, 0.8),
(1, 2023, 179, 0.3),
(1, 2023, 180, 0.4),
(1, 2023, 181, 0.7),
(1, 2023, 182, 0.6),
(1, 2023, 183, 0.9),
(1, 2023, 184, 0.5),
(1, 2023, 185, 0.4),
(1, 2023, 186, 0.7),
(1, 2023, 187, 0.6),
(1, 2023, 188, 0.3),
(1, 2023, 189, 0.5),
(1, 2023, 190, 0.8),
(1, 2023, 191, 0.6),
(1, 2023, 192, 0.9),
(1, 2023, 193, 0.4),
(1, 2023, 194, 0.5),
(1, 2023, 195, 0.7),
(1, 2023, 196, 0.3),
(1, 2023, 197, 0.6),
(1, 2023, 198, 0.8),
(1, 2023, 199, 0.5),
(1, 2023, 200, 0.7),
(1, 2023, 201, 0.4),
(1, 2023, 202, 0.6),
(1, 2023, 203, 0.5),
(1, 2023, 204, 0.8),
(1, 2023, 205, 0.3),
(1, 2023, 206, 0.7),
(1, 2023, 207, 0.6),
(1, 2023, 208, 0.9),
(1, 2023, 209, 0.4),
(1, 2023, 210, 0.5),
(1, 2023, 211, 0.8),
(1, 2023, 212, 0.6),
(1, 2023, 213, 0.3),
(1, 2023, 214, 0.5),
(1, 2023, 215, 0.7),
(1, 2023, 216, 0.6),
(1, 2023, 217, 0.9),
(1, 2023, 218, 0.4),
(1, 2023, 219, 0.5),
(1, 2023, 220, 0.7),
(1, 2023, 221, 0.3),
(1, 2023, 222, 0.6),
(1, 2023, 223, 0.8),
(1, 2023, 224, 0.5),
(1, 2023, 225, 0.7),
(1, 2023, 226, 0.4),
(1, 2023, 227, 0.9),
(1, 2023, 228, 0.2),
(1, 2023, 229, 0.6),
(1, 2023, 230, 0.5),
(1, 2023, 231, 0.8),
(1, 2023, 232, 0.3),
(1, 2023, 233, 0.4),
(1, 2023, 234, 0.7),
(1, 2023, 235, 0.6),
(1, 2023, 236, 0.9),
(1, 2023, 237, 0.5),
(1, 2023, 238, 0.4),
(1, 2023, 239, 0.7),
(1, 2023, 240, 0.6),
(1, 2023, 241, 0.3),
(1, 2023, 242, 0.5),
(1, 2023, 243, 0.8),
(1, 2023, 244, 0.6),
(1, 2023, 245, 0.9),
(1, 2023, 246, 0.4),
(1, 2023, 247, 0.5),
(1, 2023, 248, 0.7),
(1, 2023, 249, 0.3),
(1, 2023, 250, 0.6),
(1, 2023, 251, 0.8),
(1, 2023, 252, 0.5),
(1, 2023, 253, 0.7),
(1, 2023, 254, 0.4),
(1, 2023, 255, 0.9),
(1, 2023, 256, 0.2),
(1, 2023, 257, 0.6),
(1, 2023, 258, 0.5),
(1, 2023, 259, 0.8),
(1, 2023, 260, 0.3),
(1, 2023, 261, 0.4),
(1, 2023, 262, 0.7),
(1, 2023, 263, 0.6),
(1, 2023, 264, 0.9),
(1, 2023, 265, 0.5),
(1, 2023, 266, 0.4),
(1, 2023, 267, 0.7),
(1, 2023, 268, 0.6),
(1, 2023, 269, 0.3),
(1, 2023, 270, 0.5),
(1, 2023, 271, 0.8),
(1, 2023, 272, 0.6),
(1, 2023, 273, 0.9),
(1, 2023, 274, 0.4),
(1, 2023, 275, 0.5),
(1, 2023, 276, 0.7),
(1, 2023, 277, 0.3),
(1, 2023, 278, 0.6),
(1, 2023, 279, 0.8),
(1, 2023, 280, 0.5),
(1, 2023, 281, 0.7),
(1, 2023, 282, 0.4),
(1, 2023, 283, 0.9),
(1, 2023, 284, 0.2),
(1, 2023, 285, 0.6),
(1, 2023, 286, 0.5),
(1, 2023, 287, 0.8),
(1, 2023, 288, 0.3),
(1, 2023, 289, 0.4),
(1, 2023, 290, 0.7),
(1, 2023, 291, 0.6),
(1, 2023, 292, 0.9),
(1, 2023, 293, 0.5),
(1, 2023, 294, 0.4),
(1, 2023, 295, 0.7),
(1, 2023, 296, 0.6),
(1, 2023, 297, 0.3),
(1, 2023, 298, 0.5),
(1, 2023, 299, 0.8),
(1, 2023, 300, 0.6),
(1, 2023, 301, 0.9),
(1, 2023, 302, 0.4),
(1, 2023, 303, 0.5),
(1, 2023, 304, 0.7),
(1, 2023, 305, 0.3),
(1, 2023, 306, 0.6),
(1, 2023, 307, 0.8),
(1, 2023, 308, 0.5),
(1, 2023, 309, 0.7),
(1, 2023, 310, 0.4),
(1, 2023, 311, 0.9),
(1, 2023, 312, 0.2),
(1, 2023, 313, 0.6),
(1, 2023, 314, 0.5),
(1, 2023, 315, 0.8),
(1, 2023, 316, 0.3),
(1, 2023, 317, 0.4),
(1, 2023, 318, 0.7),
(1, 2023, 319, 0.6),
(1, 2023, 320, 0.9),
(1, 2023, 321, 0.5),
(1, 2023, 322, 0.4),
(1, 2023, 323, 0.7),
(1, 2023, 324, 0.6),
(1, 2023, 325, 0.3),
(1, 2023, 326, 0.5),
(1, 2023, 327, 0.8),
(1, 2023, 328, 0.6),
(1, 2023, 329, 0.9),
(1, 2023, 330, 0.4),
(1, 2023, 331, 0.5),
(1, 2023, 332, 0.7),
(1, 2023, 333, 0.3),
(1, 2023, 334, 0.6),
(1, 2023, 335, 0.8),
(1, 2023, 336, 0.5),
(1, 2023, 337, 0.7),
(1, 2023, 338, 0.4),
(1, 2023, 339, 0.9),
(1, 2023, 340, 0.2),
(1, 2023, 341, 0.6),
(1, 2023, 342, 0.5),
(1, 2023, 343, 0.8),
(1, 2023, 344, 0.3),
(1, 2023, 345, 0.4),
(1, 2023, 346, 0.7),
(1, 2023, 347, 0.6),
(1, 2023, 348, 0.9),
(1, 2023, 349, 0.5),
(1, 2023, 350, 0.4),
(1, 2023, 351, 0.7),
(1, 2023, 352, 0.6),
(1, 2023, 353, 0.3),
(1, 2023, 354, 0.5),
(1, 2023, 355, 0.8),
(1, 2023, 356, 0.6),
(1, 2023, 357, 0.9),
(1, 2023, 358, 0.4),
(1, 2023, 359, 0.5),
(1, 2023, 360, 0.7),
(1, 2023, 361, 0.3),
(1, 2023, 362, 0.6),
(1, 2023, 363, 0.8),
(1, 2023, 364, 0.5),
(1, 2023, 365, 0.7);


INSERT OR IGNORE INTO Calendar (userId, year, day, activity) VALUES
(1, 2024, 2, 1.3),
(1, 2024, 5, 0.7),
(1, 2024, 7, 1.4),
(1, 2024, 10, 1.1),
(1, 2024, 13, 0.9),
(1, 2024, 15, 1.2),
(1, 2024, 17, 1.5),
(1, 2024, 20, 1.0),
(1, 2024, 23, 1.3),
(1, 2024, 26, 0.8),
(1, 2024, 28, 1.4),
(1, 2024, 31, 1.1),
(1, 2024, 34, 1.0),
(1, 2024, 36, 1.5),
(1, 2024, 38, 0.6),
(1, 2024, 41, 1.3),
(1, 2024, 43, 1.1),
(1, 2024, 46, 1.2),
(1, 2024, 49, 1.4),
(1, 2024, 52, 1.1),
(1, 2024, 55, 1.0),
(1, 2024, 57, 1.3),
(1, 2024, 60, 1.4),
(1, 2024, 63, 1.1),
(1, 2024, 65, 1.2),
(1, 2024, 67, 0.9),
(1, 2024, 69, 1.4),
(1, 2024, 72, 1.1),
(1, 2024, 74, 1.3),
(1, 2024, 77, 1.0),
(1, 2024, 80, 1.4),
(1, 2024, 82, 0.8),
(1, 2024, 84, 1.5),
(1, 2024, 86, 1.2),
(1, 2024, 89, 1.3),
(1, 2024, 92, 1.0),
(1, 2024, 94, 1.2),
(1, 2024, 96, 1.4),
(1, 2024, 98, 1.1),
(1, 2024, 101, 1.3),
(1, 2024, 103, 1.2),
(1, 2024, 105, 1.5),
(1, 2024, 108, 1.0),
(1, 2024, 110, 1.4),
(1, 2024, 112, 1.2),
(1, 2024, 115, 1.3),
(1, 2024, 118, 1.1),
(1, 2024, 120, 1.4),
(1, 2024, 123, 1.2),
(1, 2024, 125, 1.0),
(1, 2024, 128, 1.3),
(1, 2024, 130, 1.4),
(1, 2024, 133, 1.1),
(1, 2024, 135, 1.2),
(1, 2024, 138, 1.3),
(1, 2024, 141, 1.5),
(1, 2024, 143, 1.0),
(1, 2024, 145, 1.2),
(1, 2024, 148, 1.4),
(1, 2024, 150, 1.1),
(1, 2024, 153, 1.3),
(1, 2024, 156, 1.2),
(1, 2024, 158, 1.4),
(1, 2024, 160, 1.3),
(1, 2024, 163, 0.9),
(1, 2024, 165, 1.1),
(1, 2024, 168, 1.4),
(1, 2024, 170, 1.2),
(1, 2024, 173, 1.5),
(1, 2024, 175, 1.0),
(1, 2024, 178, 1.3),
(1, 2024, 180, 1.4),
(1, 2024, 183, 1.1),
(1, 2024, 186, 1.2),
(1, 2024, 188, 1.4),
(1, 2024, 191, 1.3),
(1, 2024, 193, 1.5),
(1, 2024, 195, 1.2),
(1, 2024, 197, 1.1),
(1, 2024, 199, 1.3),
(1, 2024, 202, 1.0),
(1, 2024, 205, 1.4),
(1, 2024, 207, 1.1),
(1, 2024, 209, 1.2),
(1, 2024, 212, 0.9),
(1, 2024, 214, 1.3),
(1, 2024, 217, 1.4),
(1, 2024, 219, 1.1),
(1, 2024, 222, 1.3),
(1, 2024, 224, 1.5),
(1, 2024, 226, 1.0),
(1, 2024, 229, 1.4),
(1, 2024, 231, 1.3),
(1, 2024, 234, 1.0),
(1, 2024, 236, 1.5);

INSERT OR IGNORE INTO Calendar (userId, year, day, activity) VALUES
(1, 2025, 3, 1.4),
(1, 2025, 6, 1.0),
(1, 2025, 9, 1.1),
(1, 2025, 12, 1.5),
(1, 2025, 15, 1.3),
(1, 2025, 18, 0.8),
(1, 2025, 21, 1.4),
(1, 2025, 23, 1.2),
(1, 2025, 26, 1.5),
(1, 2025, 29, 1.1),
(1, 2025, 32, 1.3),
(1, 2025, 35, 1.0),
(1, 2025, 38, 1.4),
(1, 2025, 41, 1.1),
(1, 2025, 44, 1.2),
(1, 2025, 47, 1.3),
(1, 2025, 50, 0.9),
(1, 2025, 53, 1.5),
(1, 2025, 56, 1.2),
(1, 2025, 59, 1.3),
(1, 2025, 62, 1.1),
(1, 2025, 65, 1.4),
(1, 2025, 68, 1.0),
(1, 2025, 71, 1.2),
(1, 2025, 74, 1.5),
(1, 2025, 77, 1.3),
(1, 2025, 80, 1.1),
(1, 2025, 83, 0.7),
(1, 2025, 86, 1.4),
(1, 2025, 89, 1.3),
(1, 2025, 92, 1.1),
(1, 2025, 95, 1.2),
(1, 2025, 98, 1.5),
(1, 2025, 101, 1.4),
(1, 2025, 104, 1.1),
(1, 2025, 107, 1.3),
(1, 2025, 110, 1.0),
(1, 2025, 113, 1.4),
(1, 2025, 116, 1.2),
(1, 2025, 119, 1.5),
(1, 2025, 122, 1.3),
(1, 2025, 125, 1.1),
(1, 2025, 128, 0.9),
(1, 2025, 131, 1.4),
(1, 2025, 134, 1.0),
(1, 2025, 137, 1.3),
(1, 2025, 140, 1.1),
(1, 2025, 143, 1.4);
