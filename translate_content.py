"""
3D-labX - Content Translation Script
Translates all Turkish content to English and German
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
    print("Kullanım: ADMIN_SECRET=your_secret python translate_content.py")
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
        resp = urllib.request.urlopen(req, context=ctx, timeout=120)
        return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        print(f"  HTTP {e.code}: {e.read().decode()[:200]}")
        return None
    except Exception as e:
        print(f"  Error: {e}")
        return None

def translate_batch(lang, batch_size=5):
    """Translate a batch of content to specified language"""
    print(f"\n{'='*60}")
    print(f"Translating to {lang.upper()}...")
    print(f"{'='*60}")

    result = api("/admin/translate-all", method="POST", data={
        "lang": lang,
        "limit": batch_size
    })

    if result:
        print(f"  Translated: {result.get('translated', 0)}/{result.get('total', 0)}")
        if result.get('errors'):
            print(f"  Errors: {result['errors']}")
        return result.get('translated', 0)
    return 0

def count_untranslated():
    """Count posts without translations"""
    posts = api("/admin/posts")
    if not posts:
        return 0, 0

    en_missing = 0
    de_missing = 0

    for p in posts:
        detail = api(f"/admin/post/{p['id']}")
        if detail:
            if not detail.get('title_en'):
                en_missing += 1
            if not detail.get('title_de'):
                de_missing += 1
        time.sleep(0.1)

    return en_missing, de_missing

# Main execution
print("="*60)
print("3D-labX Content Translation Script")
print("="*60)

# Translate in batches until done
BATCH_SIZE = 5
MAX_ITERATIONS = 100  # Safety limit

for iteration in range(MAX_ITERATIONS):
    print(f"\n--- Iteration {iteration + 1} ---")

    # Translate to English
    en_count = translate_batch("en", BATCH_SIZE)
    time.sleep(2)

    # Translate to German
    de_count = translate_batch("de", BATCH_SIZE)
    time.sleep(2)

    # Check if we're done
    if en_count == 0 and de_count == 0:
        print("\n" + "="*60)
        print("ALL TRANSLATIONS COMPLETE!")
        print("="*60)
        break

    print(f"\nProgress: EN={en_count}, DE={de_count} translated this batch")
    print("Waiting 5 seconds before next batch...")
    time.sleep(5)

print("\nDone!")
