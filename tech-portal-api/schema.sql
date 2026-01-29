-- ================================
-- 📝 POSTS TABLOSU
-- ================================
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- İngilizce içerik (kaynak)
  title_en TEXT,
  summary_en TEXT,
  content_en TEXT,

  -- Türkçe içerik
  title_tr TEXT NOT NULL,
  summary_tr TEXT,
  content_tr TEXT,

  -- URL ve kategori
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  source_url TEXT UNIQUE,
  image_url TEXT,

  -- Durum
  is_featured INTEGER DEFAULT 0,
  published INTEGER DEFAULT 0,
  ai_generated INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',

  -- Zaman damgaları
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- 👤 USERS TABLOSU
-- ================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,

  -- Doğrulama
  email_verified INTEGER DEFAULT 0,
  verification_token TEXT,
  verification_expires DATETIME,

  -- Şifre sıfırlama
  reset_token TEXT,
  reset_expires DATETIME,

  -- Durum
  role TEXT DEFAULT 'user',
  is_active INTEGER DEFAULT 1,

  -- Zaman damgaları
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- ================================
-- 🔐 SESSIONS TABLOSU
-- ================================
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  ip TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================
-- 📊 POLLS TABLOSU (Anketler)
-- ================================
CREATE TABLE IF NOT EXISTS polls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  ends_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- 📊 POLL OPTIONS TABLOSU
-- ================================
CREATE TABLE IF NOT EXISTS poll_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  poll_id INTEGER NOT NULL,
  option_text TEXT NOT NULL,
  vote_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,

  FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
);

-- ================================
-- 📊 POLL VOTES TABLOSU
-- ================================
CREATE TABLE IF NOT EXISTS poll_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  poll_id INTEGER NOT NULL,
  option_id INTEGER NOT NULL,
  user_id INTEGER,
  ip_hash TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
  FOREIGN KEY (option_id) REFERENCES poll_options(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ================================
-- 📊 ADMIN LOGS TABLOSU
-- ================================
CREATE TABLE IF NOT EXISTS admin_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  post_id INTEGER,
  ip TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL
);

-- ================================
-- 🔍 İNDEKSLER
-- ================================
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_source_url ON posts(source_url);

CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_polls_active ON polls(is_active);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_ip_hash ON poll_votes(ip_hash);

-- ================================
-- 🔄 TRIGGER: updated_at otomatik güncelleme
-- ================================
CREATE TRIGGER IF NOT EXISTS update_posts_timestamp
AFTER UPDATE ON posts
BEGIN
  UPDATE posts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
