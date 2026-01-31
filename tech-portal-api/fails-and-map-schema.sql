-- ================================
-- 🔥 BAŞARISIZLIK GALERİSİ ŞEMASI
-- ================================

-- Başarısız baskılar tablosu
CREATE TABLE IF NOT EXISTS print_fails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,

  -- İçerik
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,

  -- Ne oldu?
  fail_type TEXT NOT NULL, -- 'spaghetti', 'layer_shift', 'warping', 'stringing', 'adhesion', 'clog', 'other'

  -- Görsel (JSON array)
  images TEXT DEFAULT '[]',

  -- Baskı detayları
  printer_model TEXT,
  filament_type TEXT,
  filament_brand TEXT,

  -- Çözüm
  solution TEXT, -- Nasıl düzelttim?
  is_solved INTEGER DEFAULT 0,

  -- Durum
  is_approved INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 0,
  is_deleted INTEGER DEFAULT 0,

  -- İstatistikler
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0, -- "Bu bana da oldu" sayısı

  -- Zaman damgaları
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Başarısızlık yorumları
CREATE TABLE IF NOT EXISTS print_fail_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fail_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  parent_id INTEGER DEFAULT NULL,

  content TEXT NOT NULL,
  is_solution INTEGER DEFAULT 0, -- Çözüm önerisi mi?

  like_count INTEGER DEFAULT 0,
  is_deleted INTEGER DEFAULT 0,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (fail_id) REFERENCES print_fails(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES print_fail_comments(id) ON DELETE SET NULL
);

-- "Bu bana da oldu" tablosu
CREATE TABLE IF NOT EXISTS print_fail_metoo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fail_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (fail_id) REFERENCES print_fails(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(fail_id, user_id)
);

-- ================================
-- 🗺️ MAKER HARİTASI ŞEMASI
-- ================================

-- Maker profilleri (harita için)
CREATE TABLE IF NOT EXISTS maker_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,

  -- Konum (sadece il/ilçe, tam adres değil)
  city TEXT NOT NULL, -- İstanbul, Ankara, İzmir...
  district TEXT, -- Kadıköy, Çankaya, Konak...

  -- Koordinatlar (ilçe merkezi, yaklaşık)
  latitude REAL,
  longitude REAL,

  -- Yazıcı bilgileri
  printers TEXT DEFAULT '[]', -- JSON array: ["Ender 3 V2", "Prusa MK4"]

  -- Uzmanlık alanları
  specialties TEXT DEFAULT '[]', -- JSON: ["fonksiyonel", "minyatür", "cosplay"]

  -- Hizmetler
  offers_printing INTEGER DEFAULT 0, -- Baskı hizmeti veriyor mu?
  offers_help INTEGER DEFAULT 1, -- Yardım etmeye açık mı?

  -- İletişim tercihi
  contact_preference TEXT DEFAULT 'message', -- 'message', 'email', 'both'
  show_email INTEGER DEFAULT 0,

  -- Bio
  bio TEXT,

  -- Durum
  is_visible INTEGER DEFAULT 1,
  is_verified INTEGER DEFAULT 0,

  -- İstatistikler
  helped_count INTEGER DEFAULT 0, -- Kaç kişiye yardım etti

  -- Yasal onay
  terms_accepted INTEGER DEFAULT 0,
  terms_accepted_at DATETIME,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Türkiye illeri referans tablosu
CREATE TABLE IF NOT EXISTS turkey_cities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  latitude REAL,
  longitude REAL,
  maker_count INTEGER DEFAULT 0
);

-- ================================
-- 🏆 USTA SEVİYE SİSTEMİ
-- ================================

-- Seviyeler (user_stats tablosundaki reputation_points'e göre)
-- 🌱 Çırak: 0-100
-- 🔧 Kalfa: 101-500
-- ⚙️ Usta: 501-2000
-- 👑 Büyükusta: 2000+

-- Puan işlemleri log
CREATE TABLE IF NOT EXISTS reputation_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,

  action_type TEXT NOT NULL, -- 'project', 'fail_share', 'help', 'solution', 'like_received'
  points INTEGER NOT NULL,
  reference_type TEXT, -- 'project', 'fail', 'comment', etc.
  reference_id INTEGER,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================
-- 🔍 İNDEKSLER
-- ================================

CREATE INDEX IF NOT EXISTS idx_print_fails_user ON print_fails(user_id);
CREATE INDEX IF NOT EXISTS idx_print_fails_type ON print_fails(fail_type);
CREATE INDEX IF NOT EXISTS idx_print_fails_created ON print_fails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_print_fails_featured ON print_fails(is_featured DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_fail_comments_fail ON print_fail_comments(fail_id);
CREATE INDEX IF NOT EXISTS idx_fail_comments_user ON print_fail_comments(user_id);

CREATE INDEX IF NOT EXISTS idx_maker_profiles_city ON maker_profiles(city);
CREATE INDEX IF NOT EXISTS idx_maker_profiles_visible ON maker_profiles(is_visible);
CREATE INDEX IF NOT EXISTS idx_maker_profiles_printing ON maker_profiles(offers_printing);

CREATE INDEX IF NOT EXISTS idx_reputation_log_user ON reputation_log(user_id);

-- ================================
-- 📥 VARSAYILAN VERİLER
-- ================================

-- Türkiye'nin büyük illeri
INSERT OR IGNORE INTO turkey_cities (name, slug, latitude, longitude) VALUES
('İstanbul', 'istanbul', 41.0082, 28.9784),
('Ankara', 'ankara', 39.9334, 32.8597),
('İzmir', 'izmir', 38.4192, 27.1287),
('Bursa', 'bursa', 40.1885, 29.0610),
('Antalya', 'antalya', 36.8969, 30.7133),
('Adana', 'adana', 37.0000, 35.3213),
('Konya', 'konya', 37.8746, 32.4932),
('Gaziantep', 'gaziantep', 37.0662, 37.3833),
('Mersin', 'mersin', 36.8121, 34.6415),
('Kayseri', 'kayseri', 38.7312, 35.4787),
('Eskişehir', 'eskisehir', 39.7767, 30.5206),
('Kocaeli', 'kocaeli', 40.8533, 29.8815),
('Samsun', 'samsun', 41.2867, 36.3300),
('Denizli', 'denizli', 37.7765, 29.0864),
('Sakarya', 'sakarya', 40.7569, 30.3781),
('Tekirdağ', 'tekirdag', 40.9833, 27.5167),
('Trabzon', 'trabzon', 41.0015, 39.7178),
('Manisa', 'manisa', 38.6191, 27.4289),
('Balıkesir', 'balikesir', 39.6484, 27.8826),
('Kahramanmaraş', 'kahramanmaras', 37.5858, 36.9371),
('Diyarbakır', 'diyarbakir', 37.9144, 40.2306),
('Erzurum', 'erzurum', 39.9055, 41.2658),
('Şanlıurfa', 'sanliurfa', 37.1591, 38.7969),
('Malatya', 'malatya', 38.3552, 38.3095),
('Van', 'van', 38.4891, 43.4089);

-- Yeni rozetler (Başarısızlık Galerisi için)
INSERT OR IGNORE INTO badges (name, slug, description, icon, requirement_type, requirement_value, points) VALUES
('Cesur Paylaşımcı', 'cesur-paylasimci', 'İlk başarısız baskınızı paylaştınız', '🔥', 'fail_count', 1, 15),
('Hata Avcısı', 'hata-avcisi', '5 başarısız baskı paylaştınız', '🎯', 'fail_count', 5, 30),
('Çözüm Ustası', 'cozum-ustasi', '10 çözüm önerisi yaptınız', '💡', 'solution_count', 10, 40),
('Haritadaki Maker', 'haritadaki-maker', 'Maker haritasına katıldınız', '🗺️', 'map_profile', 1, 10),
('Yardımsever Komşu', 'yardimsever-komsu', '5 kişiye baskı yardımı ettiniz', '🤝', 'helped_count', 5, 35);
