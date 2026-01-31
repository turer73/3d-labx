-- Eski verileri temizle
DELETE FROM turkish_filaments;

-- Gerçek Türk Filament Markaları (Güncel Fiyatlar - Ocak 2026)

-- 1. Elas 3D (Yerli üretim, kaliteli)
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Elas 3D', 'PLA Pro', 'PLA', 'Beyaz', 1.75, 1000, 569.00, 'Yerli üretim premium PLA, mükemmel katman yapışması', 1, 'https://www.filamentmarketim.com/elas'),
('Elas 3D', 'PLA Pro', 'PLA', 'Siyah', 1.75, 1000, 569.00, 'Mat siyah PLA, detaylı baskılar için ideal', 1, 'https://www.filamentmarketim.com/elas'),
('Elas 3D', 'PLA Pro', 'PLA', 'Mor', 1.75, 1000, 569.00, 'Canlı mor renk, hobi projeleri için', 1, 'https://www.filamentmarketim.com/elas'),
('Elas 3D', 'PETG', 'PETG', 'Siyah', 1.75, 1000, 559.00, 'Dayanıklı PETG, mekanik parçalar için', 1, 'https://www.filamentmarketim.com/elas'),
('Elas 3D', 'PETG Plus', 'PETG', 'Beyaz', 1.75, 1000, 569.00, 'Geliştirilmiş PETG formülü, yüksek mukavemet', 1, 'https://www.filamentmarketim.com/elas'),
('Elas 3D', 'PETG Plus', 'PETG', 'Şeffaf', 1.75, 1000, 579.00, 'Kristal berraklıkta şeffaf PETG', 1, 'https://www.filamentmarketim.com/elas');

-- 2. Filamix (Türkiye'nin en bilinen markası)
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Filamix', 'PLA+', 'PLA+', 'Beyaz', 1.75, 1000, 700.00, 'Türk üretimi yüksek kaliteli PLA+, mükemmel katman yapışması', 1, 'https://www.filamentmarketim.com/filamix'),
('Filamix', 'PLA+', 'PLA+', 'Siyah', 1.75, 1000, 700.00, 'Mat siyah PLA+, profesyonel sonuçlar', 1, 'https://www.filamentmarketim.com/filamix'),
('Filamix', 'PLA+', 'PLA+', 'Turuncu', 1.75, 1000, 700.00, 'Canlı turuncu, dikkat çekici projeler için', 1, 'https://www.filamentmarketim.com/filamix'),
('Filamix', 'PETG', 'PETG', 'Şeffaf', 1.75, 1000, 750.00, 'Dayanıklı PETG filament, gıdaya uygun', 1, 'https://www.filamentmarketim.com/filamix'),
('Filamix', 'ABS', 'ABS', 'Gri', 1.75, 1000, 720.00, 'Yüksek sıcaklık dayanımı, mekanik parçalar için', 1, 'https://www.filamentmarketim.com/filamix'),
('Filamix', 'ASA', 'ASA', 'Beyaz', 1.75, 1000, 780.00, 'UV dayanıklı, dış mekan projeleri için', 1, 'https://www.filamentmarketim.com/filamix');

-- 3. Microzey
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Microzey', 'PLA Pro', 'PLA', 'Beyaz', 1.75, 1000, 549.00, 'Premium kalite Türk üretimi PLA', 1, 'https://www.filamentmarketim.com/microzey'),
('Microzey', 'PLA Pro', 'PLA', 'Kırmızı', 1.75, 1000, 549.00, 'Canlı kırmızı, tutarlı çap', 1, 'https://www.filamentmarketim.com/microzey'),
('Microzey', 'PETG', 'PETG', 'Mavi', 1.75, 1000, 599.00, 'Yüksek mukavemet PETG', 1, 'https://www.filamentmarketim.com/microzey'),
('Microzey', 'Silk PLA', 'Silk PLA', 'Altın', 1.75, 1000, 649.00, 'İpeksi parlak yüzey', 1, 'https://www.filamentmarketim.com/microzey');

-- 4. Beta Filament
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Beta Filament', 'PLA', 'PLA', 'Beyaz', 1.75, 1000, 499.00, 'Ekonomik fiyat, güvenilir kalite', 1, 'https://www.filamentmarketim.com/beta-filament'),
('Beta Filament', 'PLA', 'PLA', 'Siyah', 1.75, 1000, 499.00, 'Günlük kullanım için ideal', 1, 'https://www.filamentmarketim.com/beta-filament'),
('Beta Filament', 'PETG', 'PETG', 'Naturel', 1.75, 1000, 549.00, 'Şeffaf PETG, fonksiyonel parçalar için', 1, 'https://www.filamentmarketim.com/beta-filament');

-- 5. Nanelab
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Nanelab', 'PLA+', 'PLA+', 'Yeşil', 1.75, 1000, 529.00, 'Yüksek dayanıklılık PLA+', 1, 'https://www.filamentmarketim.com/nanelab'),
('Nanelab', 'PLA+', 'PLA+', 'Turuncu', 1.75, 1000, 529.00, 'Canlı turuncu, hobi projeleri için', 1, 'https://www.filamentmarketim.com/nanelab'),
('Nanelab', 'TPU 95A', 'TPU', 'Siyah', 1.75, 500, 449.00, 'Esnek filament, 95A Shore sertlik', 1, 'https://www.filamentmarketim.com/nanelab');

-- 6. Valment
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Valment', 'PLA', 'PLA', 'Beyaz', 1.75, 1000, 479.00, 'Uygun fiyatlı Türk üretimi PLA', 1, 'https://www.valment.com.tr'),
('Valment', 'PLA', 'PLA', 'Gri', 1.75, 1000, 479.00, 'Mat gri, prototipleme için ideal', 1, 'https://www.valment.com.tr'),
('Valment', 'ABS', 'ABS', 'Beyaz', 1.75, 1000, 519.00, 'Endüstriyel kullanım için ABS', 1, 'https://www.valment.com.tr');

-- 7. Revo Filament
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Revo Filament', 'PLA+', 'PLA+', 'Beyaz', 1.75, 1000, 539.00, 'Premium PLA+, düşük warping', 1, 'https://www.revofilament.com'),
('Revo Filament', 'PLA+', 'PLA+', 'Mavi', 1.75, 1000, 539.00, 'Parlak mavi, dekoratif baskılar için', 1, 'https://www.revofilament.com'),
('Revo Filament', 'PETG', 'PETG', 'Siyah', 1.75, 1000, 589.00, 'Dayanıklı siyah PETG', 1, 'https://www.revofilament.com'),
('Revo Filament', 'Wood PLA', 'Wood PLA', 'Kahverengi', 1.75, 500, 549.00, 'Ahşap katkılı PLA, doğal görünüm', 1, 'https://www.revofilament.com');

-- 8. Porima
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Porima', 'PLA', 'PLA', 'Beyaz', 1.75, 1000, 519.00, 'Türk üretimi kaliteli PLA', 1, 'https://www.porima3d.com'),
('Porima', 'PLA', 'PLA', 'Siyah', 1.75, 1000, 519.00, 'Mat siyah PLA', 1, 'https://www.porima3d.com'),
('Porima', 'PETG', 'PETG', 'Şeffaf', 1.75, 1000, 569.00, 'Kristal berraklıkta PETG', 1, 'https://www.porima3d.com');

-- 9. Filameon
INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, description, is_verified, vendor_url) VALUES
('Filameon', 'PLA+', 'PLA+', 'Beyaz', 1.75, 1000, 559.00, 'Yüksek kalite PLA+', 1, 'https://www.filamentmarketim.com/filameon'),
('Filameon', 'PLA+', 'PLA+', 'Siyah', 1.75, 1000, 559.00, 'Mat siyah PLA+', 1, 'https://www.filamentmarketim.com/filameon'),
('Filameon', 'PETG', 'PETG', 'Mavi', 1.75, 1000, 609.00, 'Dayanıklı PETG', 1, 'https://www.filamentmarketim.com/filameon');
