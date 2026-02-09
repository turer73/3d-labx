-- ================================
-- 🎮 GAME SAVES TABLOSU (Idle Kingdom Cloud Save)
-- ================================
CREATE TABLE IF NOT EXISTS game_saves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id TEXT UNIQUE NOT NULL,        -- Cihaz bazlı unique ID
  pin_hash TEXT NOT NULL,                -- 4 haneli PIN hash'i
  save_data TEXT NOT NULL,               -- JSON game state
  game_version TEXT DEFAULT '3.1',       -- Oyun versiyonu
  total_gold REAL DEFAULT 0,             -- Hızlı gösterim için
  prestige_stars INTEGER DEFAULT 0,      -- Hızlı gösterim için
  play_time INTEGER DEFAULT 0,           -- Toplam oynama süresi (saniye)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_game_saves_player_id ON game_saves(player_id);
CREATE INDEX IF NOT EXISTS idx_game_saves_updated_at ON game_saves(updated_at DESC);

-- Trigger: updated_at otomatik güncelleme
CREATE TRIGGER IF NOT EXISTS update_game_saves_timestamp
AFTER UPDATE ON game_saves
BEGIN
  UPDATE game_saves SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
