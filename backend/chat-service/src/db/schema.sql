CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar TEXT,
  online BOOLEAN DEFAULT FALSE,
  last_seen INTEGER,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS friends (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  friend_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'blocked')),
  blocked_by INTEGER,
  UNIQUE(user_id, friend_id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(friend_id) REFERENCES users(id)
);

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

INSERT OR IGNORE INTO users (id, name, username, password_hash, avatar, online, last_seen, message)
VALUES
(1, 'zakaria', 'zelabbas', 'hash123', 'https://cdn.intra.42.fr/users/520fcec86c5c997878e60f48d447f0a1/zelabbas.jpg', 1, strftime('%s','now') - 2*60, 'Hello! It is nice to meet you. Is there something I can help you with...'),

(2, 'mohamed', 'mkarim', 'hash123', 'https://cdn.intra.42.fr/users/db4a3023c112e0d3d3bcf65d84609d6f/mkarim.jpg', 1, strftime('%s','now') - 5*60, 'Hello! It is nice to meet you. Is there something I can help you with...'),

(3, 'zechechafoui', 'zechi', 'hash123', 'https://cdn.intra.42.fr/users/d450751394f7288bce91b5b7123585d4/zech-chi.jpg', 0, strftime('%s','now') - 10*60, 'Hello! It is nice to meet you. Is there something I can help you with...'),

(4, 'taha', 'tkannane', 'hash123', 'https://cdn.intra.42.fr/users/48278b81919442a7e864dd8fc9810d81/tkannane.jpg', 1, strftime('%s','now') - 15*60, 'Hello! It is nice to meet you. Is there something I can help you with...'),

(5, 'mohamed takrayout', 'mohtakara', 'hash123', 'https://cdn.intra.42.fr/users/999ab4136febfd6fb81fb7d0aaea002a/mohtakra.jpg', 0, strftime('%s','now') - 20*60, 'Hello! It is nice to meet you. Is there something I can help you with...'),

(6, 'Youssef Momen', 'youssef', 'hash123', 'https://cdn.intra.42.fr/users/482db2393d65a8be9100b6c3f1782d36/ymomen.jpg', 1, strftime('%s','now') - 60*60, 'Hi there!'),

(7, 'said karim', 'skaim', 'hash123', 'https://cdn.intra.42.fr/users/73f492a6c8054950e96a3cdc923fba0f/skarim.jpg', 0, strftime('%s','now') - 2*60*60, 'Hello! It is nice to meet you. Is there something I can help you with...'),

(8, 'taha boussadan', 'tboussad', 'hash123', 'https://cdn.intra.42.fr/users/9a6bfae27cee69ffd2749dd460957b63/tboussad.jpg', 1, strftime('%s','now') - 2*60*60, 'Hello! It is nice to meet you. Is there something I can help you with...'),
(9, 'ilayss ezzam', 'iezzam', 'hash123', 'https://cdn.intra.42.fr/users/456d9a4c3b8c43b4b94e6e8eb6950b7d/iezzam.jpg', 1, strftime('%s','now') - 2*60*60, 'Hello! It is nice to meet you. Is there something I can help you with...');


INSERT OR IGNORE INTO friends (user_id, friend_id)
VALUES ((SELECT id FROM users WHERE username = 'zelabbas'),
        (SELECT id FROM users WHERE username = 'mohtakara'));

INSERT OR IGNORE INTO friends (user_id, friend_id)
VALUES ((SELECT id FROM users WHERE username = 'zelabbas'),
        (SELECT id FROM users WHERE username = 'zechi'));

INSERT OR IGNORE INTO friends (user_id, friend_id)
VALUES ((SELECT id FROM users WHERE username = 'zelabbas'),
        (SELECT id FROM users WHERE username = 'iezzam'));

