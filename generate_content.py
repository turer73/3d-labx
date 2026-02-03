"""
3D-labX - Content Generation & Update Script
1. Updates existing posts that have no content_tr
2. Creates new posts for empty categories (rehberler, sorun-cozumleri, incelemeler)
"""
import json
import time
import urllib.request
import urllib.error
import ssl

import os

API_BASE = os.environ.get("API_BASE", "https://tech-portal-api.turgut-d01.workers.dev")
ADMIN_SECRET = os.environ.get("ADMIN_SECRET", "")

if not ADMIN_SECRET:
    print("HATA: ADMIN_SECRET environment variable gerekli!")
    print("Kullanım: ADMIN_SECRET=your_secret python generate_content.py")
    exit(1)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    "Content-Type": "application/json",
    "X-ADMIN-SECRET": ADMIN_SECRET,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

def api(path, method="GET", data=None):
    url = f"{API_BASE}{path}"
    req = urllib.request.Request(url, headers=HEADERS, method=method)
    if data:
        req.data = json.dumps(data).encode("utf-8")
    try:
        resp = urllib.request.urlopen(req, context=ctx, timeout=90)
        return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        print(f"  HTTP {e.code}: {e.read().decode()[:200]}")
        return None
    except Exception as e:
        print(f"  Error: {e}")
        return None

# ============================================================
# STEP 1: Update existing posts without content
# ============================================================
print("=" * 60)
print("STEP 1: Finding posts without content...")
print("=" * 60)

all_posts = api("/admin/posts")
if not all_posts:
    print("Failed to get posts!")
    exit(1)

print(f"Total posts in DB: {len(all_posts)}")

posts_to_update = []
for p in all_posts:
    detail = api(f"/admin/post/{p['id']}")
    if detail and not detail.get("content_tr"):
        posts_to_update.append(detail)
        print(f"  [NO CONTENT] ID:{detail['id']} cat:{detail['category']} - {detail['title_tr'][:50]}")
    time.sleep(0.2)

print(f"\nPosts needing content: {len(posts_to_update)}")

# Generate content for each
for i, post in enumerate(posts_to_update):
    print(f"\n[{i+1}/{len(posts_to_update)}] Generating for: {post['title_tr'][:55]}...")

    result = api("/admin/ai-generate", method="POST", data={
        "source_text": f"""Baslik: {post['title_tr']}
Ozet: {post.get('summary_tr', '')}
Kategori: {post['category']}

Bu baslik ve ozete gore detayli bir Turkce makale yaz.
En az 600 kelime olsun. HTML formatinda paragraflar halinde yaz (<p>, <h2>, <h3>, <ul>, <li> etiketleri kullan).
Sadece icerik metnini dondur.""",
        "category": post["category"]
    })

    if result and result.get("success"):
        new_id = result.get("id")
        new_post = api(f"/admin/post/{new_id}")
        if new_post and new_post.get("content_tr"):
            # Update original post with generated content
            upd = api(f"/admin/update/{post['id']}", method="PUT", data={
                "content_tr": new_post["content_tr"],
                "published": True
            })
            if upd and upd.get("success"):
                print(f"  OK - Updated post {post['id']}")
                # Delete the duplicate
                api(f"/admin/delete/{new_id}", method="DELETE")
            else:
                print(f"  FAIL - Could not update post {post['id']}")
        else:
            print(f"  FAIL - No content in generated post")
    else:
        print(f"  FAIL - AI generation failed")

    time.sleep(3)

# ============================================================
# STEP 2: Create new posts for empty categories
# ============================================================
print("\n" + "=" * 60)
print("STEP 2: Creating posts for empty categories...")
print("=" * 60)

NEW_POSTS = [
    # REHBERLER
    {
        "source_text": """Klipper Firmware Kurulum Rehberi - Ender 3 ve benzeri FDM yazicilar icin adim adim Klipper kurulumu.
Konular: Klipper nedir, Marlin vs Klipper, gerekli donanim (Raspberry Pi), KIAUH ile kurulum, MainsailOS/FluiddPi,
printer.cfg yapılandirmasi, Input Shaper kalibrasyonu, Pressure Advance ayari, makro olusturma (START_PRINT, END_PRINT).
En az 800 kelime, HTML formatinda (<p>, <h2>, <h3>, <ul>, <li>, <code> etiketleri). Turkce teknik dilde yaz.""",
        "category": "rehberler",
        "post_type": "rehber"
    },
    {
        "source_text": """PLA vs PETG vs ABS Filament Karsilastirma Rehberi.
Konular: Her filamentin ozellikleri, mekanik ozellikler (cekme dayanimi, esneklik), termal ozellikler,
baski kolayligi, optimum sicakliklar, yapisma ve warping, kimyasal direnc, UV direnci, gida guvenligi,
Turkiye pazar fiyatlari, kullanim alanlari, karsilastirma tablosu.
En az 800 kelime, HTML formatinda. Turkce teknik dilde yaz.""",
        "category": "rehberler",
        "post_type": "rehber"
    },
    {
        "source_text": """OctoPrint Kurulum ve Kullanim Rehberi.
Konular: OctoPrint nedir, gerekli donanim (Raspberry Pi, kamera), OctoPi image kurulumu,
ilk yapilandirma, web arayuzu, uzaktan baski, kamera ve timelapse, onerilen eklentiler
(Bed Visualizer, OctoLapse, Spaghetti Detective), guvenlik ayarlari, mobil uygulamalar.
En az 800 kelime, HTML formatinda. Turkce teknik dilde yaz.""",
        "category": "rehberler",
        "post_type": "rehber"
    },
    # SORUN COZUMLERI
    {
        "source_text": """3D Yazicida ABS Catlama Sorunu ve Cozumleri.
Konular: ABS catlamasinin nedenleri (sicaklik farki, soguma hizi, nem), ortam sicakligi kontrolu (enclosure),
yatak isitma ve yapisma cozumleri (ABS juice, kapton tape, PEI), optimum baski sicakliklari,
dilimleyici ayarlari (infill, fan hizi, katman yuksekligi), ruzgar engelleme, basarili baski ipuclari.
En az 800 kelime, HTML formatinda. Turkce teknik dilde yaz.""",
        "category": "sorun-cozumleri",
        "post_type": "rehber"
    },
    {
        "source_text": """3D Baskida Ilk Katman Yapisma Sorunlari ve Cozumleri.
Konular: Ilk katmanin onemi, yatak levelleme (manuel ve BLTouch), Z-offset ayari,
yatak sicakligi (PLA/PETG/ABS icin), yatak yuzey secimi (cam, PEI, BuildTak),
yapisma artiricilar (oje, yapistirici, sac spreyi), ilk katman hizi, skirt/brim/raft kullanimi.
En az 800 kelime, HTML formatinda. Turkce teknik dilde yaz.""",
        "category": "sorun-cozumleri",
        "post_type": "rehber"
    },
    {
        "source_text": """3D Baskida Stringing (Ipliklenme) Sorunu Nasil Cozulur.
Konular: Stringing nedir, retraction ayarlari (mesafe ve hiz), Bowden vs Direct Drive icin degerler,
sicaklik kulesi testi, travel hizi, combing modu, Z-hop, nem kontrolu ve filament kurutma,
nozzle temizligi, filament tipine gore ayarlar, test baski modelleri.
En az 800 kelime, HTML formatinda. Turkce teknik dilde yaz.""",
        "category": "sorun-cozumleri",
        "post_type": "rehber"
    },
    # INCELEMELER
    {
        "source_text": """Creality Ender-3 V3 SE Detayli Inceleme.
Konular: Kutu acilimi ve kurulum, teknik ozellikler (baski hacmi, hiz, cozunurluk),
otomatik yatak leveling (CR Touch), direct drive ekstruder, baski kalitesi testleri (benchy, calibration cube),
PLA/PETG/TPU performansi, gurultu seviyesi, yazilim uyumlulugu, fiyat/performans, artilari ve eksileri.
En az 800 kelime, HTML formatinda. Turkce teknik dilde yaz.""",
        "category": "incelemeler",
        "post_type": "inceleme"
    },
    {
        "source_text": """Cura vs PrusaSlicer vs OrcaSlicer: Dilimleyici Karsilastirmasi 2025.
Konular: Her dilimleyicinin tanitimi, arayuz karsilastirmasi, desteklenen yazicilar,
dilimleme hizi, destek yapisi kalitesi, coklu malzeme destegi, ozel ozellikler (tree supports, ironing),
profil yonetimi, topluluk destegi, hangi kullanici icin hangisi ideal.
En az 800 kelime, HTML formatinda. Turkce teknik dilde yaz.""",
        "category": "incelemeler",
        "post_type": "inceleme"
    },
    {
        "source_text": """Bambu Lab P1S 3D Yazici Detayli Inceleme.
Konular: Kurulum, teknik ozellikler (CoreXY, hiz, baski hacmi), kapali kasa avantajlari,
AMS ile coklu renk/malzeme, Bambu Studio yazilimi, baski kalitesi testleri,
desteklenen malzemeler, gurultu, Wi-Fi ve uzaktan kontrol, kamera ve AI hata tespiti,
Turkiye fiyati, artilari/eksileri, sonuc ve puan.
En az 800 kelime, HTML formatinda. Turkce teknik dilde yaz.""",
        "category": "incelemeler",
        "post_type": "inceleme"
    },
]

for i, item in enumerate(NEW_POSTS):
    cat = item["category"]
    print(f"\n[{i+1}/{len(NEW_POSTS)}] Creating {cat} post...")

    result = api("/admin/ai-generate", method="POST", data=item)
    if result and result.get("success"):
        new_id = result.get("id")
        # Publish it
        api(f"/admin/update/{new_id}", method="PUT", data={"published": True})
        print(f"  OK - ID:{new_id} slug:{result.get('slug','?')[:50]}")
    else:
        print(f"  FAIL - Could not create post")

    time.sleep(3)

print("\n" + "=" * 60)
print("ALL DONE!")
print("=" * 60)
