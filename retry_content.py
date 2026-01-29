"""Retry failed content generation for empty categories"""
import json, time, urllib.request, ssl

API_BASE = "https://tech-portal-api.turgut-d01.workers.dev"
HEADERS = {
    "Content-Type": "application/json",
    "X-ADMIN-SECRET": "Tur04520,",
    "User-Agent": "Mozilla/5.0"
}
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

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

# Posts that failed - retry with simpler prompts
RETRY_POSTS = [
    {
        "source_text": "PLA, PETG ve ABS filament turlerinin karsilastirma rehberi. Mekanik ozellikler, sicaklik gereksinimleri, baski kolayligi, fiyat farklari ve kullanim alanlari. Turkce detayli makale yaz, HTML formatinda.",
        "category": "rehberler",
        "post_type": "rehber"
    },
    {
        "source_text": "3D yazicida ABS filament ile baski yaparken catlama ve warping sorunu. Nedenleri: sicaklik farki, hizli soguma, nem. Cozumler: enclosure kullanimi, yatak isitma, ABS juice, fan ayarlari. Turkce detayli makale yaz, HTML formatinda.",
        "category": "sorun-cozumleri",
        "post_type": "rehber"
    },
    {
        "source_text": "3D baskida ilk katman yapisma sorunu cozum rehberi. Yatak levelleme, Z-offset, sicaklik ayarlari, yatak yuzey secimi, yapistirici kullanimi, brim ve raft. Turkce detayli makale yaz, HTML formatinda.",
        "category": "sorun-cozumleri",
        "post_type": "rehber"
    },
    {
        "source_text": "Cura, PrusaSlicer ve OrcaSlicer dilimleyici yazilimlari karsilastirmasi. Ozellikler, hiz, destek kalitesi, kullanim kolayligi. Turkce detayli makale yaz, HTML formatinda.",
        "category": "incelemeler",
        "post_type": "inceleme"
    },
    {
        "source_text": "Bambu Lab P1S 3D yazici incelemesi. CoreXY, AMS, kapali kasa, hizli baski, Wi-Fi, kamera. Turkce detayli makale yaz, HTML formatinda.",
        "category": "incelemeler",
        "post_type": "inceleme"
    },
]

for i, item in enumerate(RETRY_POSTS):
    print(f"\n[{i+1}/{len(RETRY_POSTS)}] Creating {item['category']} post...")

    result = api("/admin/ai-generate", method="POST", data=item)
    if result and result.get("success"):
        new_id = result.get("id")
        api(f"/admin/update/{new_id}", method="PUT", data={"published": True})
        print(f"  OK - ID:{new_id} slug:{result.get('slug','?')[:50]}")
    else:
        print(f"  FAIL")

    time.sleep(4)

# Check final counts
print("\n\nFinal category counts:")
for cat in ["rehberler", "sorun-cozumleri", "incelemeler"]:
    req = urllib.request.Request(f"{API_BASE}/api/posts?category={cat}&limit=10", headers={"User-Agent": "Mozilla/5.0"})
    try:
        resp = urllib.request.urlopen(req, context=ctx, timeout=15)
        data = json.loads(resp.read().decode())
        count = data.get("pagination", {}).get("total", 0)
        print(f"  {cat}: {count} posts")
    except:
        print(f"  {cat}: error checking")

print("\nDONE!")
