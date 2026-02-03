import json
import urllib.request
import os

API_BASE = os.environ.get("API_BASE", "https://tech-portal-api.turgut-d01.workers.dev")
API_URL = f"{API_BASE}/admin/filament-prices"
SECRET = os.environ.get("ADMIN_SECRET", "")

if not SECRET:
    print("HATA: ADMIN_SECRET environment variable gerekli!")
    print("Kullanım: ADMIN_SECRET=your_secret python seed_filament_prices.py")
    exit(1)

prices = [
    # PLA Filamentler
    {"brand": "Porima", "product_name": "Porima PLA+ 1.75mm Filament", "filament_type": "PLA", "weight_grams": 1000, "color": "Beyaz", "price_tl": 219.90, "original_price_tl": 279.90, "store_name": "3DMarket", "store_url": "https://3dmarket.com.tr", "rating": 4.7, "discount_percent": 21, "is_best_deal": 1},
    {"brand": "eSUN", "product_name": "eSUN PLA+ 1.75mm Premium", "filament_type": "PLA", "weight_grams": 1000, "color": "Siyah", "price_tl": 249.00, "original_price_tl": 299.00, "store_name": "Amazon.com.tr", "store_url": "https://amazon.com.tr", "rating": 4.5, "discount_percent": 17, "is_best_deal": 0},
    {"brand": "Filameon", "product_name": "Filameon PLA Economy 1.75mm", "filament_type": "PLA", "weight_grams": 1000, "color": "Gri", "price_tl": 189.90, "original_price_tl": 229.90, "store_name": "Trendyol", "store_url": "https://trendyol.com", "rating": 4.3, "discount_percent": 17, "is_best_deal": 1},
    {"brand": "Creality", "product_name": "Creality Hyper PLA 1.75mm", "filament_type": "PLA", "weight_grams": 1000, "color": "Turuncu", "price_tl": 269.00, "original_price_tl": 349.00, "store_name": "Hepsiburada", "store_url": "https://hepsiburada.com", "rating": 4.6, "discount_percent": 23, "is_best_deal": 1},
    {"brand": "Sunlu", "product_name": "Sunlu PLA 1.75mm Standart", "filament_type": "PLA", "weight_grams": 1000, "color": "Mavi", "price_tl": 179.00, "original_price_tl": 199.00, "store_name": "Amazon.com.tr", "store_url": "https://amazon.com.tr", "rating": 4.2, "discount_percent": 10, "is_best_deal": 0},
    {"brand": "Kexcelled", "product_name": "Kexcelled PLA K5M 1.75mm", "filament_type": "PLA", "weight_grams": 1000, "color": "Yeşil", "price_tl": 199.90, "original_price_tl": None, "store_name": "3DMarket", "store_url": "https://3dmarket.com.tr", "rating": 4.4, "discount_percent": 0, "is_best_deal": 0},
    # PETG Filamentler
    {"brand": "Porima", "product_name": "Porima PETG Premium 1.75mm", "filament_type": "PETG", "weight_grams": 1000, "color": "Şeffaf", "price_tl": 259.90, "original_price_tl": 329.90, "store_name": "3DMarket", "store_url": "https://3dmarket.com.tr", "rating": 4.8, "discount_percent": 21, "is_best_deal": 1},
    {"brand": "eSUN", "product_name": "eSUN PETG 1.75mm Filament", "filament_type": "PETG", "weight_grams": 1000, "color": "Siyah", "price_tl": 279.00, "original_price_tl": 319.00, "store_name": "Amazon.com.tr", "store_url": "https://amazon.com.tr", "rating": 4.5, "discount_percent": 13, "is_best_deal": 0},
    {"brand": "Filameon", "product_name": "Filameon PETG 1.75mm", "filament_type": "PETG", "weight_grams": 1000, "color": "Beyaz", "price_tl": 229.90, "original_price_tl": 269.90, "store_name": "Trendyol", "store_url": "https://trendyol.com", "rating": 4.4, "discount_percent": 15, "is_best_deal": 1},
    {"brand": "Creality", "product_name": "Creality PETG 1.75mm", "filament_type": "PETG", "weight_grams": 1000, "color": "Mavi", "price_tl": 289.00, "original_price_tl": 359.00, "store_name": "Hepsiburada", "store_url": "https://hepsiburada.com", "rating": 4.3, "discount_percent": 19, "is_best_deal": 0},
    {"brand": "Sunlu", "product_name": "Sunlu PETG 1.75mm", "filament_type": "PETG", "weight_grams": 1000, "color": "Kırmızı", "price_tl": 209.00, "original_price_tl": None, "store_name": "Amazon.com.tr", "store_url": "https://amazon.com.tr", "rating": 4.1, "discount_percent": 0, "is_best_deal": 0},
    # ABS Filamentler
    {"brand": "Porima", "product_name": "Porima ABS 1.75mm", "filament_type": "ABS", "weight_grams": 1000, "color": "Siyah", "price_tl": 199.90, "original_price_tl": 249.90, "store_name": "3DMarket", "store_url": "https://3dmarket.com.tr", "rating": 4.5, "discount_percent": 20, "is_best_deal": 1},
    {"brand": "eSUN", "product_name": "eSUN ABS+ 1.75mm", "filament_type": "ABS", "weight_grams": 1000, "color": "Beyaz", "price_tl": 239.00, "original_price_tl": 279.00, "store_name": "Trendyol", "store_url": "https://trendyol.com", "rating": 4.4, "discount_percent": 14, "is_best_deal": 0},
    # TPU Filamentler
    {"brand": "eSUN", "product_name": "eSUN TPU 95A 1.75mm Esnek", "filament_type": "TPU", "weight_grams": 500, "color": "Siyah", "price_tl": 289.00, "original_price_tl": 349.00, "store_name": "Amazon.com.tr", "store_url": "https://amazon.com.tr", "rating": 4.6, "discount_percent": 17, "is_best_deal": 1},
    {"brand": "Sunlu", "product_name": "Sunlu TPU 95A 1.75mm", "filament_type": "TPU", "weight_grams": 500, "color": "Kırmızı", "price_tl": 249.00, "original_price_tl": None, "store_name": "Trendyol", "store_url": "https://trendyol.com", "rating": 4.2, "discount_percent": 0, "is_best_deal": 0},
    # Reçine
    {"brand": "Elegoo", "product_name": "Elegoo Standard Reçine 1000g", "filament_type": "Reçine", "weight_grams": 1000, "color": "Gri", "price_tl": 449.00, "original_price_tl": 549.00, "store_name": "Amazon.com.tr", "store_url": "https://amazon.com.tr", "rating": 4.7, "discount_percent": 18, "is_best_deal": 1},
    {"brand": "Anycubic", "product_name": "Anycubic Basic Reçine 1000g", "filament_type": "Reçine", "weight_grams": 1000, "color": "Yeşil-Gri", "price_tl": 399.00, "original_price_tl": 499.00, "store_name": "Trendyol", "store_url": "https://trendyol.com", "rating": 4.5, "discount_percent": 20, "is_best_deal": 1},
    {"brand": "Phrozen", "product_name": "Phrozen Aqua Reçine 1000g", "filament_type": "Reçine", "weight_grams": 1000, "color": "Şeffaf", "price_tl": 529.00, "original_price_tl": 649.00, "store_name": "3DMarket", "store_url": "https://3dmarket.com.tr", "rating": 4.8, "discount_percent": 18, "is_best_deal": 0},
    {"brand": "Creality", "product_name": "Creality Standart UV Reçine 500g", "filament_type": "Reçine", "weight_grams": 500, "color": "Beyaz", "price_tl": 249.00, "original_price_tl": 299.00, "store_name": "Hepsiburada", "store_url": "https://hepsiburada.com", "rating": 4.3, "discount_percent": 17, "is_best_deal": 0},
    # ASA  
    {"brand": "Porima", "product_name": "Porima ASA 1.75mm UV Dayanımlı", "filament_type": "ASA", "weight_grams": 1000, "color": "Siyah", "price_tl": 299.90, "original_price_tl": 369.90, "store_name": "3DMarket", "store_url": "https://3dmarket.com.tr", "rating": 4.6, "discount_percent": 19, "is_best_deal": 1},
    # SILK PLA
    {"brand": "Sunlu", "product_name": "Sunlu Silk PLA 1.75mm Parlak", "filament_type": "PLA", "weight_grams": 1000, "color": "Altın", "price_tl": 229.00, "original_price_tl": None, "store_name": "Amazon.com.tr", "store_url": "https://amazon.com.tr", "rating": 4.5, "discount_percent": 0, "is_best_deal": 0},
]

data = json.dumps(prices).encode('utf-8')
req = urllib.request.Request(API_URL, data=data, method='POST')
req.add_header('Content-Type', 'application/json')
req.add_header('X-ADMIN-SECRET', SECRET)
req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        result = json.loads(resp.read().decode('utf-8'))
        print(f"Sonuc: {json.dumps(result, ensure_ascii=False)}")
except Exception as e:
    print(f"Hata: {e}")
