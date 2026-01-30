-- ================================
-- 🏘️ TOPLULUK SİSTEMİ - VERİTABANI ŞEMASI
-- ================================

-- ================================
-- 💬 YORUMLAR TABLOSU (Post Yorumları)
-- ================================
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  parent_id INTEGER DEFAULT NULL,
  content TEXT NOT NULL,
  
  -- Durum
  is_approved INTEGER DEFAULT 1,
  is_deleted INTEGER DEFAULT 0,
  
  -- İstatistikler
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  
  -- Spam koruması
  ip_hash TEXT,
  
  -- Zaman damgaları
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- ================================
-- 📁 FORUM KATEGORİLERİ
-- ================================
CREATE TABLE IF NOT EXISTS forum_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '💬',
  color TEXT DEFAULT '#F97316',
  
  -- Sıralama ve durum
  display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  
  -- İstatistikler
  thread_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- 📋 FORUM KONULARI (Threads)
-- ================================
CREATE TABLE IF NOT EXISTS forum_threads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  
  -- İçerik
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  
  -- Durum
  is_pinned INTEGER DEFAULT 0,
  is_locked INTEGER DEFAULT 0,
  is_solved INTEGER DEFAULT 0,
  is_deleted INTEGER DEFAULT 0,
  
  -- İstatistikler
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  
  -- En iyi cevap
  best_reply_id INTEGER DEFAULT NULL,
  
  -- Son aktivite
  last_reply_at DATETIME,
  last_reply_user_id INTEGER,
  
  -- Zaman damgaları
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (category_id) REFERENCES forum_categories(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================
-- 💭 FORUM CEVAPLARI (Replies)
-- ================================
CREATE TABLE IF NOT EXISTS forum_replies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  thread_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  parent_id INTEGER DEFAULT NULL,
  
  -- İçerik
  content TEXT NOT NULL,
  
  -- Durum
  is_best_answer INTEGER DEFAULT 0,
  is_deleted INTEGER DEFAULT 0,
  
  -- İstatistikler
  like_count INTEGER DEFAULT 0,
  
  -- Spam koruması
  ip_hash TEXT,
  
  -- Zaman damgaları
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (thread_id) REFERENCES forum_threads(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES forum_replies(id) ON DELETE SET NULL
);

-- ================================
-- 🎨 KULLANICI PROJELERİ (Showcase)
-- ================================
CREATE TABLE IF NOT EXISTS user_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  
  -- İçerik
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Medya (JSON array)
  images TEXT DEFAULT '[]',
  
  -- 3D Baskı detayları
  printer_model TEXT,
  filament_type TEXT,
  filament_brand TEXT,
  print_settings TEXT,
  print_time_hours REAL,
  
  -- STL/Model linki (opsiyonel)
  model_url TEXT,
  model_source TEXT,
  
  -- Durum
  is_featured INTEGER DEFAULT 0,
  is_approved INTEGER DEFAULT 1,
  is_deleted INTEGER DEFAULT 0,
  
  -- İstatistikler
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  
  -- Zaman damgaları
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================
-- ❤️ BEĞENİLER (Polimorfik)
-- ================================
CREATE TABLE IF NOT EXISTS likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  
  -- Polimorfik ilişki
  likeable_type TEXT NOT NULL,
  likeable_id INTEGER NOT NULL,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, likeable_type, likeable_id)
);

-- ================================
-- 🏅 ROZETLER
-- ================================
CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#F97316',
  
  -- Kazanma koşulu
  requirement_type TEXT,
  requirement_value INTEGER DEFAULT 0,
  
  -- Puan değeri
  points INTEGER DEFAULT 10,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- 👤 KULLANICI ROZETLERİ
-- ================================
CREATE TABLE IF NOT EXISTS user_badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  badge_id INTEGER NOT NULL,
  
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
  UNIQUE(user_id, badge_id)
);

-- ================================
-- 📊 KULLANICI İSTATİSTİKLERİ
-- ================================
CREATE TABLE IF NOT EXISTS user_stats (
  user_id INTEGER PRIMARY KEY,
  
  -- Forum
  thread_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  best_answer_count INTEGER DEFAULT 0,
  
  -- Projeler
  project_count INTEGER DEFAULT 0,
  
  -- Yorumlar
  comment_count INTEGER DEFAULT 0,
  
  -- Sosyal
  like_given_count INTEGER DEFAULT 0,
  like_received_count INTEGER DEFAULT 0,
  
  -- Puan
  reputation_points INTEGER DEFAULT 0,
  
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================
-- 🔔 BİLDİRİMLER
-- ================================
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  
  -- Bildirim tipi
  type TEXT NOT NULL,
  
  -- İlgili içerik
  reference_type TEXT,
  reference_id INTEGER,
  
  -- Mesaj
  title TEXT NOT NULL,
  message TEXT,
  url TEXT,
  
  -- Durum
  is_read INTEGER DEFAULT 0,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================
-- 🔍 İNDEKSLER
-- ================================

-- Comments
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Forum Categories
CREATE INDEX IF NOT EXISTS idx_forum_categories_slug ON forum_categories(slug);
CREATE INDEX IF NOT EXISTS idx_forum_categories_order ON forum_categories(display_order);

-- Forum Threads
CREATE INDEX IF NOT EXISTS idx_forum_threads_category ON forum_threads(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_user ON forum_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_slug ON forum_threads(slug);
CREATE INDEX IF NOT EXISTS idx_forum_threads_pinned ON forum_threads(is_pinned DESC, last_reply_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_threads_solved ON forum_threads(is_solved);

-- Forum Replies
CREATE INDEX IF NOT EXISTS idx_forum_replies_thread ON forum_replies(thread_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_user ON forum_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_best ON forum_replies(is_best_answer);

-- User Projects
CREATE INDEX IF NOT EXISTS idx_user_projects_user ON user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_slug ON user_projects(slug);
CREATE INDEX IF NOT EXISTS idx_user_projects_featured ON user_projects(is_featured DESC, created_at DESC);

-- Likes
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(likeable_type, likeable_id);

-- User Badges
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ================================
-- 📥 VARSAYILAN VERİLER
-- ================================

-- Forum Kategorileri
INSERT OR IGNORE INTO forum_categories (name, slug, description, icon, color, display_order) VALUES
('Sorular & Yardım', 'sorular', '3D baskı ile ilgili sorularınızı sorun, topluluktan yardım alın', '❓', '#3B82F6', 1),
('Projeler & Showcase', 'projeler', 'Baskı projelerinizi paylaşın, ilham alın', '🎨', '#10B981', 2),
('Tartışmalar', 'tartismalar', 'Genel 3D baskı tartışmaları, haberler, görüşler', '💬', '#8B5CF6', 3),
('Alım Satım', 'alim-satim', 'İkinci el yazıcı, filament ve aksesuar alım satımı', '🛒', '#F97316', 4),
('Duyurular', 'duyurular', 'Site duyuruları ve güncellemeler', '📢', '#EF4444', 5);

-- Rozetler
INSERT OR IGNORE INTO badges (name, slug, description, icon, requirement_type, requirement_value, points) VALUES
('Yeni Üye', 'yeni-uye', 'Topluluğa hoş geldiniz!', '👋', 'registration', 1, 5),
('İlk Yorum', 'ilk-yorum', 'İlk yorumunuzu yaptınız', '💬', 'comment_count', 1, 10),
('İlk Konu', 'ilk-konu', 'İlk forum konunuzu açtınız', '📝', 'thread_count', 1, 15),
('Yardımsever', 'yardimsever', '10 soruya cevap verdiniz', '🤝', 'reply_count', 10, 25),
('Uzman', 'uzman', '5 en iyi cevap aldınız', '🏆', 'best_answer_count', 5, 50),
('Popüler', 'populer', '50 beğeni aldınız', '⭐', 'like_received_count', 50, 30),
('Maker', 'maker', '5 proje paylaştınız', '🎨', 'project_count', 5, 40),
('Veteran', 'veteran', '100 yorum/cevap yaptınız', '🎖️', 'total_posts', 100, 75),
('Efsane', 'efsane', '500 itibar puanı kazandınız', '👑', 'reputation_points', 500, 100);
