import urllib.request, json, ssl, os

API_BASE = os.environ.get("API_BASE", "https://tech-portal-api.turgut-d01.workers.dev")
ADMIN_SECRET = os.environ.get("ADMIN_SECRET", "")

if not ADMIN_SECRET:
    print("HATA: ADMIN_SECRET environment variable gerekli!")
    print("Kullanım: ADMIN_SECRET=your_secret python update_filament.py")
    exit(1)

HEADERS = {
    "Content-Type": "application/json",
    "X-ADMIN-SECRET": ADMIN_SECRET,
    "User-Agent": "Mozilla/5.0"
}

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Reset existing prices
req = urllib.request.Request(f"{API_BASE}/admin/filament-prices/reset", headers=HEADERS, method="POST")
req.data = b"{}"
try:
    resp = urllib.request.urlopen(req, context=ctx, timeout=30)
    print("Reset:", resp.read().decode())
except Exception as e:
    print("Reset error:", e)

# GÜNCEL FİYATLAR - 28 Ocak 2026
# Kaynak: FilamentMarketim (tek kaynak)
prices = [
    # ==================== PLA ====================
    {"filament_type": "PLA", "brand": "Porima", "product_name": "Porima Eco Smart PLA 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 409.99, "original_price_tl": 0, "discount_percent": 0, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/pla-filament", "is_best_deal": 1},
    {"filament_type": "PLA", "brand": "Porima", "product_name": "Porima Smart PLA 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 459.00, "original_price_tl": 0, "discount_percent": 0, "rating": 4.4, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/pla-filament", "is_best_deal": 0},
    {"filament_type": "PLA", "brand": "Elas", "product_name": "Elas PLA Pro 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 499.00, "original_price_tl": 0, "discount_percent": 0, "rating": 4.4, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/pla-filament", "is_best_deal": 0},
    {"filament_type": "PLA", "brand": "Elegoo", "product_name": "Elegoo PLA+ 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 534.55, "original_price_tl": 0, "discount_percent": 0, "rating": 4.5, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/pla-filament", "is_best_deal": 0},
    {"filament_type": "PLA", "brand": "Solvix", "product_name": "SOLVIX PLA 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 549.00, "original_price_tl": 0, "discount_percent": 0, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/pla-filament", "is_best_deal": 0},
    {"filament_type": "PLA", "brand": "Creality", "product_name": "Creality Ender PLA+ 1.75mm 1kg", "weight_grams": 1000, "color": "Turuncu", "price_tl": 564.97, "original_price_tl": 608.43, "discount_percent": 7, "rating": 4.5, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/pla-filament", "is_best_deal": 0},
    {"filament_type": "PLA", "brand": "Filamix", "product_name": "Filamix PLA Plus 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 564.97, "original_price_tl": 0, "discount_percent": 0, "rating": 4.4, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/pla-filament", "is_best_deal": 0},
    {"filament_type": "PLA", "brand": "Filamix", "product_name": "Filamix Hyper Speed PLA 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 564.97, "original_price_tl": 625.01, "discount_percent": 10, "rating": 4.5, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/pla-filament", "is_best_deal": 0},
    {"filament_type": "PLA", "brand": "Porima", "product_name": "Porima Eco PLA 1.75mm 1kg", "weight_grams": 1000, "color": "Rainbow", "price_tl": 576.00, "original_price_tl": 0, "discount_percent": 0, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/pla-filament", "is_best_deal": 0},
    {"filament_type": "PLA", "brand": "Beta", "product_name": "Beta PLA+ 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 586.70, "original_price_tl": 695.34, "discount_percent": 16, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/pla-filament", "is_best_deal": 0},

    # ==================== PETG ====================
    {"filament_type": "PETG", "brand": "Elas", "product_name": "Elas PETG Makarasız 1.75mm 1kg", "weight_grams": 1000, "color": "Siyah", "price_tl": 450.00, "original_price_tl": 470.00, "discount_percent": 4, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/petg-filament", "is_best_deal": 1},
    {"filament_type": "PETG", "brand": "Elas", "product_name": "Elas PETG Makarasız 1.75mm 1kg", "weight_grams": 1000, "color": "Turuncu", "price_tl": 450.00, "original_price_tl": 470.00, "discount_percent": 4, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/petg-filament", "is_best_deal": 0},
    {"filament_type": "PETG", "brand": "Elas", "product_name": "Elas PETG Makarasız 1.75mm 1kg", "weight_grams": 1000, "color": "Mavi", "price_tl": 450.00, "original_price_tl": 470.00, "discount_percent": 4, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/petg-filament", "is_best_deal": 0},
    {"filament_type": "PETG", "brand": "Elas", "product_name": "Elas PETG 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 499.00, "original_price_tl": 0, "discount_percent": 0, "rating": 4.4, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/petg-filament", "is_best_deal": 0},
    {"filament_type": "PETG", "brand": "Sunlu", "product_name": "Sunlu PETG 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 506.30, "original_price_tl": 0, "discount_percent": 0, "rating": 4.4, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/petg-filament", "is_best_deal": 0},
    {"filament_type": "PETG", "brand": "Revo", "product_name": "Revo Hyper PETG 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 579.00, "original_price_tl": 0, "discount_percent": 0, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/petg-filament", "is_best_deal": 0},
    {"filament_type": "PETG", "brand": "Filamix", "product_name": "Filamix Rapid PETG 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 651.89, "original_price_tl": 0, "discount_percent": 0, "rating": 4.4, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/petg-filament", "is_best_deal": 0},
    {"filament_type": "PETG", "brand": "Porima", "product_name": "Porima PETG 1.75mm 1kg", "weight_grams": 1000, "color": "Transparan", "price_tl": 708.00, "original_price_tl": 0, "discount_percent": 0, "rating": 4.4, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/petg-filament", "is_best_deal": 0},
    {"filament_type": "PETG", "brand": "Esun", "product_name": "Esun PETG 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 808.34, "original_price_tl": 0, "discount_percent": 0, "rating": 4.5, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/petg-filament", "is_best_deal": 0},

    # ==================== ABS ====================
    {"filament_type": "ABS", "brand": "Porima", "product_name": "Porima Eco ABS 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 529.00, "original_price_tl": 0, "discount_percent": 0, "rating": 4.2, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/abs-filament", "is_best_deal": 1},
    {"filament_type": "ABS", "brand": "Sunlu", "product_name": "Sunlu ABS 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 564.97, "original_price_tl": 0, "discount_percent": 0, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/abs-filament", "is_best_deal": 0},
    {"filament_type": "ABS", "brand": "Beta", "product_name": "Beta ABS+ 1.75mm 800g", "weight_grams": 800, "color": "Çeşitli", "price_tl": 564.97, "original_price_tl": 0, "discount_percent": 0, "rating": 4.2, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/abs-filament", "is_best_deal": 0},
    {"filament_type": "ABS", "brand": "Porima", "product_name": "Porima ABS 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 588.00, "original_price_tl": 0, "discount_percent": 0, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/abs-filament", "is_best_deal": 0},
    {"filament_type": "ABS", "brand": "Revo", "product_name": "Revo Hyper Speed ABS 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 599.73, "original_price_tl": 0, "discount_percent": 0, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/abs-filament", "is_best_deal": 0},
    {"filament_type": "ABS", "brand": "Elas", "product_name": "Elas HS ABS 1.75mm 1kg", "weight_grams": 1000, "color": "Beyaz", "price_tl": 600.00, "original_price_tl": 700.00, "discount_percent": 14, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/abs-filament", "is_best_deal": 0},
    {"filament_type": "ABS", "brand": "Filamix", "product_name": "Filamix HS-ABS 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 608.43, "original_price_tl": 0, "discount_percent": 0, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/abs-filament", "is_best_deal": 0},
    {"filament_type": "ABS", "brand": "Creality", "product_name": "Creality CR-ABS 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 712.73, "original_price_tl": 0, "discount_percent": 0, "rating": 4.4, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/abs-filament", "is_best_deal": 0},
    {"filament_type": "ABS", "brand": "Esun", "product_name": "Esun ABS+ 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 738.80, "original_price_tl": 0, "discount_percent": 0, "rating": 4.4, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/abs-filament", "is_best_deal": 0},

    # ==================== TPU ====================
    {"filament_type": "TPU", "brand": "Filamix", "product_name": "Filamix TPU Esnek 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 869.18, "original_price_tl": 0, "discount_percent": 0, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/esnek-filament", "is_best_deal": 1},
    {"filament_type": "TPU", "brand": "Beta", "product_name": "Beta TPU 95A 1.75mm 1kg", "weight_grams": 1000, "color": "Şeffaf Kırmızı", "price_tl": 1147.32, "original_price_tl": 0, "discount_percent": 0, "rating": 4.4, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/esnek-filament", "is_best_deal": 0},
    {"filament_type": "TPU", "brand": "Creality", "product_name": "Creality CR-TPU 1.75mm 1kg", "weight_grams": 1000, "color": "Mavi", "price_tl": 1216.85, "original_price_tl": 1303.77, "discount_percent": 7, "rating": 4.4, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/esnek-filament", "is_best_deal": 0},
    {"filament_type": "TPU", "brand": "Creality", "product_name": "Creality CR-TPU 1.75mm 1kg", "weight_grams": 1000, "color": "Siyah", "price_tl": 1216.85, "original_price_tl": 1303.77, "discount_percent": 7, "rating": 4.4, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/esnek-filament", "is_best_deal": 0},
    {"filament_type": "TPU", "brand": "Esun", "product_name": "Esun eTPU-95A 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 1350.00, "original_price_tl": 0, "discount_percent": 0, "rating": 4.5, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/esnek-filament", "is_best_deal": 0},

    # ==================== ASA ====================
    {"filament_type": "ASA", "brand": "Elas", "product_name": "Elas ASA 1.75mm 1kg", "weight_grams": 1000, "color": "Kırmızı", "price_tl": 620.00, "original_price_tl": 650.00, "discount_percent": 5, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/asa-filament", "is_best_deal": 1},
    {"filament_type": "ASA", "brand": "Elas", "product_name": "Elas ASA 1.75mm 1kg", "weight_grams": 1000, "color": "Siyah", "price_tl": 620.00, "original_price_tl": 650.00, "discount_percent": 5, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/asa-filament", "is_best_deal": 0},
    {"filament_type": "ASA", "brand": "Porima", "product_name": "Porima ASA 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 852.00, "original_price_tl": 0, "discount_percent": 0, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/asa-filament", "is_best_deal": 0},
    {"filament_type": "ASA", "brand": "Elegoo", "product_name": "Elegoo ASA 1.75mm 1kg", "weight_grams": 1000, "color": "Beyaz", "price_tl": 1043.02, "original_price_tl": 0, "discount_percent": 0, "rating": 4.4, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/asa-filament", "is_best_deal": 0},
    {"filament_type": "ASA", "brand": "Polymaker", "product_name": "PolyLite ASA 1.75mm 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 1793.84, "original_price_tl": 0, "discount_percent": 0, "rating": 4.5, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/asa-filament", "is_best_deal": 0},

    # ==================== REÇİNE ====================
    {"filament_type": "Reçine", "brand": "Porima", "product_name": "Porima PoResin Standart 1kg", "weight_grams": 1000, "color": "Çeşitli", "price_tl": 591.04, "original_price_tl": 0, "discount_percent": 0, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/sla-recineler", "is_best_deal": 1},
    {"filament_type": "Reçine", "brand": "Porima", "product_name": "Porima PoResin Transparan 1kg", "weight_grams": 1000, "color": "Transparan", "price_tl": 591.04, "original_price_tl": 0, "discount_percent": 0, "rating": 4.3, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/sla-recineler", "is_best_deal": 0},
    {"filament_type": "Reçine", "brand": "Anycubic", "product_name": "Anycubic Standard Reçine 1kg", "weight_grams": 1000, "color": "Şeffaf", "price_tl": 608.43, "original_price_tl": 695.34, "discount_percent": 13, "rating": 4.5, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/sla-recineler", "is_best_deal": 0},
    {"filament_type": "Reçine", "brand": "Anycubic", "product_name": "Anycubic Standard Reçine 1kg", "weight_grams": 1000, "color": "Bej", "price_tl": 608.43, "original_price_tl": 695.34, "discount_percent": 13, "rating": 4.5, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/sla-recineler", "is_best_deal": 0},
    {"filament_type": "Reçine", "brand": "Anycubic", "product_name": "Anycubic Standard Reçine 1kg", "weight_grams": 1000, "color": "Siyah", "price_tl": 695.34, "original_price_tl": 0, "discount_percent": 0, "rating": 4.5, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/sla-recineler", "is_best_deal": 0},
    {"filament_type": "Reçine", "brand": "Anycubic", "product_name": "Anycubic Suyla Yıkanabilen Reçine 1kg", "weight_grams": 1000, "color": "Siyah", "price_tl": 999.56, "original_price_tl": 0, "discount_percent": 0, "rating": 4.6, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/sla-recineler", "is_best_deal": 0},
    {"filament_type": "Reçine", "brand": "Anycubic", "product_name": "Anycubic Suyla Yıkanabilen Reçine 1kg", "weight_grams": 1000, "color": "Şeffaf", "price_tl": 999.56, "original_price_tl": 0, "discount_percent": 0, "rating": 4.6, "store_name": "FilamentMarketim", "store_url": "https://www.filamentmarketim.com/sla-recineler", "is_best_deal": 0},
]

# Bulk insert
req = urllib.request.Request(f"{API_BASE}/admin/filament-prices", headers=HEADERS, method="POST")
req.data = json.dumps(prices).encode("utf-8")
resp = urllib.request.urlopen(req, context=ctx, timeout=30)
result = json.loads(resp.read().decode())
print(f"Inserted: {json.dumps(result, ensure_ascii=False)}")

# Verify
req2 = urllib.request.Request(f"{API_BASE}/api/filament-prices", headers={"User-Agent": "Mozilla/5.0"})
resp2 = urllib.request.urlopen(req2, context=ctx, timeout=30)
data = json.loads(resp2.read().decode())
print(f"\nToplam: {data['count']} ürün")
print(f"Mağazalar: {data['filters']['stores']}")
print("\nEn uygun fiyatlar (FilamentMarketim):")
for ftype in ["PLA", "PETG", "ABS", "TPU", "ASA", "Reçine"]:
    items = [p for p in data["prices"] if p["filament_type"] == ftype]
    if items:
        best = min(items, key=lambda x: x["price_tl"])
        print(f"  {ftype}: {best['price_tl']:.2f} TL - {best['brand']} ({best['store_name']})")
