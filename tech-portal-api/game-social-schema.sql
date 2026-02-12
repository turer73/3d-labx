-- ================================
-- 🎮 KELIME FETHI — Sosyal Katman Tabloları
-- ================================

-- Oyuncu profilleri (rumuz + avatar)
CREATE TABLE IF NOT EXISTS game_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  nickname_lower TEXT NOT NULL,
  avatar_emoji TEXT DEFAULT '🎮',
  leaderboard_opt_in INTEGER DEFAULT 1,
  total_score INTEGER DEFAULT 0,
  cities_conquered INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_game_profiles_nickname ON game_profiles(nickname_lower);
CREATE INDEX IF NOT EXISTS idx_game_profiles_player ON game_profiles(player_id);
CREATE INDEX IF NOT EXISTS idx_game_profiles_score ON game_profiles(total_score DESC);

-- Trigger: updated_at otomatik güncelleme
CREATE TRIGGER IF NOT EXISTS update_game_profiles_timestamp
AFTER UPDATE ON game_profiles
BEGIN
  UPDATE game_profiles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Günlük skorlar (liderboard için)
CREATE TABLE IF NOT EXISTS game_daily_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  guesses INTEGER NOT NULL,
  solved INTEGER DEFAULT 0,
  solve_time_ms INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  difficulty TEXT DEFAULT 'normal',
  word_length INTEGER DEFAULT 5,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_daily_scores_day ON game_daily_scores(day_number, score DESC);
CREATE INDEX IF NOT EXISTS idx_daily_scores_player ON game_daily_scores(player_id);

-- Meydan okuma (challenge) linkleri
CREATE TABLE IF NOT EXISTS game_challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  challenge_id TEXT UNIQUE NOT NULL,
  creator_id TEXT NOT NULL,
  word TEXT NOT NULL,
  word_length INTEGER DEFAULT 5,
  play_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_challenges_id ON game_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenges_expires ON game_challenges(expires_at);
