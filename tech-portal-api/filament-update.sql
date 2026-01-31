-- Eski verileri temizle
DELETE FROM turkish_filaments;

-- Gerçek Türk Filament Markaları
-- 1. Filamix (Türkiye'nin en bilinen markası)
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Filamix', 'PLA+', 'PLA+', 'Beyaz', 1.75, 1000, 249.00, 'Türk üretimi yüksek kaliteli PLA+, mükemmel katman yapışması', 1, 'https://www.filamix.com.tr'),
('Filamix', 'PLA+', 'PLA+', 'Siyah', 1.75, 1000, 249.00, 'Türk üretimi yüksek kaliteli PLA+, mat siyah renk', 1, 'https://www.filamix.com.tr'),
('Filamix', 'PETG', 'PETG', 'Şeffaf', 1.75, 1000, 289.00, 'Dayanıklı PETG filament, gıdaya uygun', 1, 'https://www.filamix.com.tr'),
('Filamix', 'ABS', 'ABS', 'Gri', 1.75, 1000, 269.00, 'Yüksek sıcaklık dayanımı, mekanik parçalar için', 1, 'https://www.filamix.com.tr');

-- 2. Microzey
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Microzey', 'PLA Pro', 'PLA', 'Beyaz', 1.75, 1000, 259.00, 'Premium kalite Türk üretimi PLA', 1, 'https://www.microzey.com'),
('Microzey', 'PLA Pro', 'PLA', 'Kırmızı', 1.75, 1000, 259.00, 'Canlı renkler, tutarlı çap', 1, 'https://www.microzey.com'),
('Microzey', 'PETG', 'PETG', 'Mavi', 1.75, 1000, 299.00, 'Yüksek mukavemet PETG', 1, 'https://www.microzey.com'),
('Microzey', 'Silk PLA', 'Silk PLA', 'Altın', 1.75, 1000, 329.00, 'İpeksi parlak yüzey', 1, 'https://www.microzey.com');

-- 3. Beta Filament
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Beta Filament', 'PLA', 'PLA', 'Beyaz', 1.75, 1000, 239.00, 'Ekonomik fiyat, güvenilir kalite', 1, 'https://www.betafilament.com'),
('Beta Filament', 'PLA', 'PLA', 'Siyah', 1.75, 1000, 239.00, 'Günlük kullanım için ideal', 1, 'https://www.betafilament.com'),
('Beta Filament', 'PETG', 'PETG', 'Naturel', 1.75, 1000, 279.00, 'Şeffaf PETG, fonksiyonel parçalar için', 1, 'https://www.betafilament.com');

-- 4. Nanelab
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Nanelab', 'PLA+', 'PLA+', 'Yeşil', 1.75, 1000, 269.00, 'Yüksek dayanıklılık PLA+', 1, 'https://www.nanelab.com'),
('Nanelab', 'PLA+', 'PLA+', 'Turuncu', 1.75, 1000, 269.00, 'Canlı turuncu, hobi projeleri için', 1, 'https://www.nanelab.com'),
('Nanelab', 'TPU 95A', 'TPU', 'Siyah', 1.75, 500, 349.00, 'Esnek filament, 95A Shore sertlik', 1, 'https://www.nanelab.com');

-- 5. Valment
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Valment', 'PLA', 'PLA', 'Beyaz', 1.75, 1000, 229.00, 'Uygun fiyatlı Türk üretimi PLA', 1, 'https://www.valment.com.tr'),
('Valment', 'PLA', 'PLA', 'Gri', 1.75, 1000, 229.00, 'Mat gri, prototipleme için ideal', 1, 'https://www.valment.com.tr'),
('Valment', 'ABS', 'ABS', 'Beyaz', 1.75, 1000, 259.00, 'Endüstriyel kullanım için ABS', 1, 'https://www.valment.com.tr');

-- 6. Revo Filament
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Revo Filament', 'PLA+', 'PLA+', 'Beyaz', 1.75, 1000, 259.00, 'Premium PLA+, düşük warping', 1, 'https://www.revofilament.com'),
('Revo Filament', 'PLA+', 'PLA+', 'Mavi', 1.75, 1000, 259.00, 'Parlak mavi, dekoratif baskılar için', 1, 'https://www.revofilament.com'),
('Revo Filament', 'PETG', 'PETG', 'Siyah', 1.75, 1000, 299.00, 'Dayanıklı siyah PETG', 1, 'https://www.revofilament.com'),
('Revo Filament', 'Wood PLA', 'Wood PLA', 'Kahverengi', 1.75, 500, 329.00, 'Ahşap katkılı PLA, doğal görünüm', 1, 'https://www.revofilament.com');

-- 7. Porima (zaten Türk markası, kalabilir)
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Porima', 'PLA', 'PLA', 'Beyaz', 1.75, 1000, 249.00, 'Türk üretimi kaliteli PLA', 1, 'https://www.porima3d.com'),
('Porima', 'PLA', 'PLA', 'Siyah', 1.75, 1000, 249.00, 'Mat siyah PLA', 1, 'https://www.porima3d.com'),
('Porima', 'PETG', 'PETG', 'Şeffaf', 1.75, 1000, 289.00, 'Kristal berraklıkta PETG', 1, 'https://www.porima3d.com');
