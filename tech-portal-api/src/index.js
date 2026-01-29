// ================================
// 🔧 CONFIGURATION
// ================================
const CONFIG = {
  CACHE_TTL: 300, // 5 dakika cache
  RATE_LIMIT_WINDOW: 60000, // 1 dakika
  RATE_LIMIT_MAX: 300, // dakikada max istek (artırıldı)
  RATE_LIMIT_ADMIN: 60, // admin için dakikada max istek
  PAGINATION_DEFAULT: 12,
  PAGINATION_MAX: 50,
  CRON_ENABLED: true, // Cron'u açıp kapatmak için
  CRON_MAX_ITEMS_PER_SOURCE: 3, // Her kaynaktan max item
  CRON_DELAY_BETWEEN_REQUESTS: 1500, // İstekler arası bekleme (ms)
  CRON_SOURCE_TIMEOUT: 8000, // Kaynak timeout (ms)
  R2_PUBLIC_URL: "https://pub-9142f11355e84e1da1dd96a4c14e4afb.r2.dev", // R2 public URL
};

// Varsayılan RSS kaynakları (DB'de yoksa kullanılır)
const DEFAULT_RSS_SOURCES = {
  "3d-baski": [
    "https://3dprintingindustry.com/feed/",
    "https://3dprint.com/feed/",
    "https://all3dp.com/feed/",
    "https://www.fabbaloo.com/feed",
    "https://hackaday.com/tag/3d-printer/feed/",
    "https://blog.prusa3d.com/feed/"
  ],
  "teknoloji": [
    "https://techcrunch.com/feed/",
    "https://www.theverge.com/rss/index.xml",
    "https://feeds.arstechnica.com/arstechnica/technology-lab",
    "https://www.wired.com/feed/rss",
    "https://www.engadget.com/rss.xml",
    "https://thenewstack.io/feed/",
    "https://news.ycombinator.com/rss"
  ],
  "yapay-zeka": [
    "https://www.artificialintelligence-news.com/feed/",
    "https://venturebeat.com/category/ai/feed/",
    "https://syncedreview.com/feed/",
    "https://openai.com/blog/rss.xml",
    "https://blog.google/technology/ai/rss/",
    "https://www.marktechpost.com/feed/"
  ]
};

// RSS kaynaklarını DB'den al (yoksa varsayılanları kullan)
async function getRssSources(env) {
  try {
    const sources = await env.DB.prepare(`
      SELECT category, url, name, is_active FROM rss_sources WHERE is_active = 1 ORDER BY category, name
    `).all();

    if (!sources.results || sources.results.length === 0) {
      return DEFAULT_RSS_SOURCES;
    }

    const result = {};
    for (const source of sources.results) {
      if (!result[source.category]) {
        result[source.category] = [];
      }
      result[source.category].push(source.url);
    }
    return result;
  } catch (error) {
    console.error("RSS sources fetch error:", error);
    return DEFAULT_RSS_SOURCES;
  }
}

const CATEGORIES = ["3d-baski", "teknoloji", "yapay-zeka", "incelemeler", "rehberler", "sorun-cozumleri"];
const POST_TYPES = ["haber", "inceleme", "rehber", "tartisma"];

// ================================
// 🔧 CORS & RESPONSE HELPERS
// ================================
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-ADMIN-SECRET, Authorization",
  "Access-Control-Max-Age": "86400"
};

function jsonResponse(data, status = 200, cacheSeconds = 0) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    ...CORS_HEADERS
  };

  if (cacheSeconds > 0) {
    headers["Cache-Control"] = `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`;
  } else {
    headers["Cache-Control"] = "no-store";
  }

  return new Response(JSON.stringify(data), { status, headers });
}

function errorResponse(message, status = 500, code = "ERROR") {
  return jsonResponse({ error: message, code }, status, 0);
}

// ================================
// 🛡️ RATE LIMITING (In-Memory)
// ================================
const rateLimitStore = new Map();

function checkRateLimit(ip, isAdmin = false) {
  const now = Date.now();
  const limit = isAdmin ? CONFIG.RATE_LIMIT_ADMIN : CONFIG.RATE_LIMIT_MAX;
  const key = `${ip}:${isAdmin ? 'admin' : 'public'}`;

  const record = rateLimitStore.get(key) || { count: 0, resetAt: now + CONFIG.RATE_LIMIT_WINDOW };

  // Pencere süresi dolduysa sıfırla
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + CONFIG.RATE_LIMIT_WINDOW;
  }

  record.count++;
  rateLimitStore.set(key, record);

  // Eski kayıtları temizle (memory leak önleme)
  if (rateLimitStore.size > 10000) {
    const threshold = now - CONFIG.RATE_LIMIT_WINDOW * 2;
    for (const [k, v] of rateLimitStore) {
      if (v.resetAt < threshold) rateLimitStore.delete(k);
    }
  }

  return {
    allowed: record.count <= limit,
    remaining: Math.max(0, limit - record.count),
    resetAt: record.resetAt
  };
}

// ================================
// 🔒 INPUT VALIDATION
// ================================
function sanitizeString(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, maxLength);
}

function validateCategory(category) {
  return CATEGORIES.includes(category);
}

function validatePostType(postType) {
  return POST_TYPES.includes(postType);
}

function validateId(id) {
  const num = parseInt(id, 10);
  return !isNaN(num) && num > 0 ? num : null;
}

function validatePagination(page, limit) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(CONFIG.PAGINATION_MAX, Math.max(1, parseInt(limit, 10) || CONFIG.PAGINATION_DEFAULT));
  return { page: p, limit: l, offset: (p - 1) * l };
}

// ================================
// 🔐 AUTH HELPERS
// ================================
async function hashPassword(password, salt) {
  if (!salt) {
    const saltBytes = new Uint8Array(16);
    crypto.getRandomValues(saltBytes);
    salt = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return salt + ':' + hash;
}

async function verifyPassword(password, storedHash) {
  const [salt] = storedHash.split(':');
  if (!salt) return false;
  const computed = await hashPassword(password, salt);
  return computed === storedHash;
}

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    token += chars[randomValues[i] % chars.length];
  }
  return token;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateUsername(username) {
  // 3-20 karakter, harf, rakam ve alt çizgi
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
}

function validatePassword(password) {
  // Min 8 karakter
  return password && password.length >= 8;
}

async function sendVerificationEmail(env, email, token, username) {
  const verifyUrl = `https://3d-labx.com/auth/verify?token=${token}`;

  // Debug için log
  console.log('Sending verification email to:', email);
  console.log('RESEND_API_KEY exists:', !!env.RESEND_API_KEY);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: email,
      subject: '3D-labX - E-posta Adresinizi Doğrulayın',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563EB;">3D-labX'e Hoş Geldiniz!</h1>
          <p>Merhaba <strong>${username}</strong>,</p>
          <p>Hesabınızı aktifleştirmek için aşağıdaki butona tıklayın:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="background: #2563EB; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">E-postamı Doğrula</a>
          </div>
          <p style="color: #666; font-size: 14px;">Bu link 24 saat geçerlidir.</p>
          <p style="color: #666; font-size: 14px;">Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #999; font-size: 12px;">3D-labX - 3D Baskı, Teknoloji ve Yapay Zeka</p>
        </div>
      `
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Resend API error:', response.status, errorData);
    }

    return response.ok;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

async function sendPasswordResetEmail(env, email, token, username) {
  const resetUrl = `https://3d-labx.com/auth/reset-password?token=${token}`;

  console.log('Sending password reset email to:', email);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: email,
        subject: '3D-labX - Şifre Sıfırlama',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563EB;">Şifre Sıfırlama</h1>
            <p>Merhaba <strong>${username}</strong>,</p>
            <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="background: #2563EB; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Şifremi Sıfırla</a>
            </div>
            <p style="color: #666; font-size: 14px;">Bu link 1 saat geçerlidir.</p>
            <p style="color: #666; font-size: 14px;">Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
            <p style="color: #999; font-size: 12px;">3D-labX - 3D Baskı, Teknoloji ve Yapay Zeka</p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Password reset email error:', response.status, errorData);
    }

    return response.ok;
  } catch (error) {
    console.error('Password reset email error:', error);
    return false;
  }
}

async function getSessionUser(env, request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  if (!token) return null;

  const session = await env.DB.prepare(`
    SELECT s.*, u.id as user_id, u.email, u.username, u.display_name, u.avatar_url, u.role, u.email_verified
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > datetime('now') AND u.is_active = 1
  `).bind(token).first();

  return session;
}

// ================================
// 🔤 TÜRKÇE SLUG OLUŞTURUCU
// ================================
function createSlug(text) {
  if (!text) return `post-${Date.now().toString(36)}`;

  const turkishMap = {
    'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u'
  };

  let slug = text.toLowerCase();
  for (const [tr, en] of Object.entries(turkishMap)) {
    slug = slug.replace(new RegExp(tr, 'g'), en);
  }

  slug = slug
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);

  return `${slug}-${Date.now().toString(36)}`;
}

// ================================
// 📰 RSS HELPERS
// ================================
async function fetchRSS(url, timeout = CONFIG.CRON_SOURCE_TIMEOUT) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'TechPortal/2.0 (+https://3d-labx.com)' }
    });

    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (error) {
    console.error(`RSS fetch error [${url}]:`, error.message);
    return null;
  }
}

function parseRSS(xml) {
  if (!xml) return [];

  const items = [];

  // RSS 2.0 ve Atom formatlarını destekle
  const isAtom = xml.includes('<feed') && xml.includes('xmlns="http://www.w3.org/2005/Atom"');
  const itemRegex = isAtom ? /<entry>([\s\S]*?)<\/entry>/g : /<item>([\s\S]*?)<\/item>/g;

  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    const get = (tag) => {
      const m = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
    };

    const getLink = () => {
      // Atom format - href attribute
      const atomMatch = item.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']alternate["']/);
      if (atomMatch) return atomMatch[1];

      const atomMatch2 = item.match(/<link[^>]*href=["']([^"']+)["']/);
      if (atomMatch2) return atomMatch2[1];

      // RSS format - link element
      let link = get("link");
      if (link) return link;

      return "";
    };

    const getImage = () => {
      const patterns = [
        /<media:content[^>]*url=["']([^"']+)["']/,
        /<media:thumbnail[^>]*url=["']([^"']+)["']/,
        /<enclosure[^>]*url=["']([^"']+\.(?:jpg|jpeg|png|gif|webp)[^"']*)["']/i,
        /<img[^>]*src=["']([^"']+)["']/,
        /src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|gif|webp)[^"']*)["']/i
      ];
      for (const pattern of patterns) {
        const m = item.match(pattern);
        if (m) return m[1];
      }
      return null;
    };

    const title = isAtom ? get("title") : get("title");
    const description = isAtom ? (get("summary") || get("content")) : get("description");

    if (title) {
      items.push({
        title: title.replace(/<[^>]*>/g, '').trim(),
        link: getLink(),
        description: description.replace(/<[^>]*>/g, '').substring(0, 500),
        image: getImage()
      });
    }
  }

  return items;
}

// ================================
// 🧠 GEMINI AI
// ================================
async function generateWithGemini(env, prompt) {
  if (!env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not configured");
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" }
          ]
        })
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error("Gemini API error:", res.status);
      return null;
    }

    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.error("Gemini error:", error.message);
    return null;
  }
}

// ================================
// 🧠 DEEPSEEK AI
// ================================
async function generateWithDeepSeek(env, prompt) {
  if (!env.deep_seek_api_key) {
    console.error("deep_seek_api_key not configured");
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const res = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.deep_seek_api_key}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "Sen bir teknoloji ve 3D baskı uzmanısın. Türkçe yanıt ver." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4096
        })
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error("DeepSeek API error:", res.status);
      return null;
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error("DeepSeek error:", error.message);
    return null;
  }
}

// 🧠 AI - Unified (tries Gemini first, falls back to DeepSeek)
async function generateWithAI(env, prompt) {
  // Try Gemini first
  let result = await generateWithGemini(env, prompt);
  if (result) return result;

  // Fallback to DeepSeek
  console.log("Gemini failed, trying DeepSeek...");
  result = await generateWithDeepSeek(env, prompt);
  return result;
}

// ================================
// 📊 LOGGING
// ================================
async function logAdminAction(env, request, action, postId = null, details = null) {
  try {
    const ip = request.headers.get("CF-Connecting-IP") ||
               request.headers.get("X-Forwarded-For")?.split(',')[0] ||
               "unknown";
    const ua = (request.headers.get("User-Agent") || "unknown").substring(0, 255);

    await env.DB.prepare(`
      INSERT INTO admin_logs (action, post_id, ip, user_agent)
      VALUES (?, ?, ?, ?)
    `).bind(action, postId, ip, ua).run();
  } catch (error) {
    console.error("Log error:", error.message);
  }
}

// ================================
// 🧱 MAIN WORKER
// ================================
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS Preflight
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Get client IP
    const clientIP = request.headers.get("CF-Connecting-IP") ||
                     request.headers.get("X-Forwarded-For")?.split(',')[0] ||
                     "unknown";

    // Rate limit check - sadece yazma işlemleri ve admin için uygula
    // GET istekleri cache'leniyor, rate limit gereksiz
    const isAdminPath = path.startsWith("/admin");
    const isWriteOperation = method !== "GET";

    if (isWriteOperation || isAdminPath) {
      const rateCheck = checkRateLimit(clientIP, isAdminPath);
      if (!rateCheck.allowed) {
        return errorResponse("Rate limit exceeded. Please wait a moment.", 429, "RATE_LIMIT");
      }
    }

    try {
      // ================================
      // 🔓 PUBLIC ENDPOINTS
      // ================================

      // Health Check
      if (path === "/api/health") {
        const dbCheck = await env.DB.prepare("SELECT 1").first();
        return jsonResponse({
          status: "ok",
          timestamp: new Date().toISOString(),
          database: dbCheck ? "connected" : "error"
        }, 200, 10);
      }

      // Stats (ana sayfa için)
      if (path === "/api/stats" && method === "GET") {
        const stats = await env.DB.prepare(`
          SELECT
            COUNT(*) as total,
            SUM(CASE WHEN category = '3d-baski' THEN 1 ELSE 0 END) as baski_3d,
            SUM(CASE WHEN category = 'teknoloji' THEN 1 ELSE 0 END) as teknoloji,
            SUM(CASE WHEN category = 'yapay-zeka' THEN 1 ELSE 0 END) as yapay_zeka
          FROM posts WHERE published = 1
        `).first();

        return jsonResponse(stats, 200, CONFIG.CACHE_TTL);
      }

      // Ana Sayfa (kategorilere göre gruplu)
      if (path === "/api/home" && method === "GET") {
        const result = {};

        for (const category of CATEGORIES) {
          const posts = await env.DB.prepare(`
            SELECT id, title_tr, summary_tr, slug, category, post_type, image_url, is_featured, created_at
            FROM posts
            WHERE published = 1 AND category = ?
            ORDER BY is_featured DESC, created_at DESC
            LIMIT 6
          `).bind(category).all();

          result[category] = posts.results || [];
        }

        return jsonResponse(result, 200, CONFIG.CACHE_TTL);
      }

      // Kategori Listesi (sayfalama ile)
      if (path === "/api/posts" && method === "GET") {
        const category = url.searchParams.get("category");
        const postType = url.searchParams.get("post_type");
        const { page, limit, offset } = validatePagination(
          url.searchParams.get("page"),
          url.searchParams.get("limit")
        );

        let query = `
          SELECT id, title_tr, summary_tr, slug, category, post_type, image_url, is_featured, created_at
          FROM posts
          WHERE published = 1
        `;
        const bindings = [];

        if (category && validateCategory(category)) {
          query += ` AND category = ?`;
          bindings.push(category);
        }

        if (postType && validatePostType(postType)) {
          query += ` AND post_type = ?`;
          bindings.push(postType);
        }

        // Total count
        const countQuery = query.replace(/SELECT .* FROM/, "SELECT COUNT(*) as total FROM");
        const countResult = await env.DB.prepare(countQuery).bind(...bindings).first();
        const total = countResult?.total || 0;

        // Get posts
        query += ` ORDER BY is_featured DESC, created_at DESC LIMIT ? OFFSET ?`;
        bindings.push(limit, offset);

        const posts = await env.DB.prepare(query).bind(...bindings).all();

        return jsonResponse({
          posts: posts.results || [],
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: offset + limit < total,
            hasPrev: page > 1
          }
        }, 200, CONFIG.CACHE_TTL);
      }

      // Tek Post
      if (path.startsWith("/api/post/") && method === "GET") {
        const slug = sanitizeString(path.replace("/api/post/", ""), 150);
        if (!slug) return errorResponse("Slug required", 400, "INVALID_SLUG");

        const post = await env.DB.prepare(`
          SELECT id, title_tr, summary_tr, content_tr, slug, category, post_type, image_url, source_url, created_at
          FROM posts
          WHERE slug = ? AND published = 1
        `).bind(slug).first();

        if (!post) return errorResponse("Post not found", 404, "NOT_FOUND");

        return jsonResponse(post, 200, CONFIG.CACHE_TTL);
      }

      // Arama
      if (path === "/api/search" && method === "GET") {
        const query = sanitizeString(url.searchParams.get("q"), 100);
        if (!query || query.length < 2) {
          return jsonResponse({ results: [], query: "" }, 200, 60);
        }

        const searchTerm = `%${query}%`;
        const results = await env.DB.prepare(`
          SELECT id, title_tr, summary_tr, slug, category, image_url
          FROM posts
          WHERE published = 1 AND (title_tr LIKE ? OR summary_tr LIKE ?)
          ORDER BY
            CASE WHEN title_tr LIKE ? THEN 0 ELSE 1 END,
            created_at DESC
          LIMIT 20
        `).bind(searchTerm, searchTerm, searchTerm).all();

        return jsonResponse({
          results: results.results || [],
          query,
          count: results.results?.length || 0
        }, 200, 60);
      }

      // ================================
      // 📦 CONTENT BOXES ENDPOINTS
      // ================================

      // Content boxes listesi (public - sadece görünür olanlar)
      if (path === "/api/content-boxes" && method === "GET") {
        const boxes = await env.DB.prepare(`
          SELECT id, slot_key, display_order, size, content_type, config, color_theme
          FROM content_boxes
          WHERE is_visible = 1
          ORDER BY display_order ASC
        `).all();

        return jsonResponse(boxes.results || [], 200, CONFIG.CACHE_TTL);
      }

      // ================================
      // 💰 FİLAMENT FİYAT ENDPOINTS
      // ================================

      // Filament fiyatları listesi (public)
      if (path === "/api/filament-prices" && method === "GET") {
        const filamentType = url.searchParams.get("type"); // PLA, PETG, Reçine, TPU, ABS
        const store = url.searchParams.get("store");
        const bestDeals = url.searchParams.get("best") === "1";
        const sortBy = url.searchParams.get("sort") || "price"; // price, discount, rating

        let query = `SELECT * FROM filament_prices WHERE in_stock = 1`;
        const params = [];

        if (filamentType) {
          query += ` AND filament_type = ?`;
          params.push(filamentType);
        }
        if (store) {
          query += ` AND store_name = ?`;
          params.push(store);
        }
        if (bestDeals) {
          query += ` AND is_best_deal = 1`;
        }

        // Sıralama
        if (sortBy === "discount") {
          query += ` ORDER BY discount_percent DESC, price_tl ASC`;
        } else if (sortBy === "rating") {
          query += ` ORDER BY rating DESC, price_tl ASC`;
        } else {
          query += ` ORDER BY price_tl ASC`;
        }

        query += ` LIMIT 50`;

        const stmt = params.length > 0
          ? env.DB.prepare(query).bind(...params)
          : env.DB.prepare(query);

        const results = await stmt.all();

        // Benzersiz türleri ve mağazaları da dön
        const types = await env.DB.prepare(`SELECT DISTINCT filament_type FROM filament_prices WHERE in_stock = 1 ORDER BY filament_type`).all();
        const stores = await env.DB.prepare(`SELECT DISTINCT store_name FROM filament_prices WHERE in_stock = 1 ORDER BY store_name`).all();

        return jsonResponse({
          prices: results.results || [],
          filters: {
            types: (types.results || []).map(t => t.filament_type),
            stores: (stores.results || []).map(s => s.store_name)
          },
          count: results.results?.length || 0,
          lastUpdated: new Date().toISOString()
        }, 200, 300);
      }

      // ================================
      // 👤 AUTH ENDPOINTS
      // ================================

      // Kayıt ol
      if (path === "/api/auth/register" && method === "POST") {
        const body = await request.json();
        const email = sanitizeString(body.email, 255).toLowerCase();
        const username = sanitizeString(body.username, 20).toLowerCase();
        const password = body.password;
        const displayName = sanitizeString(body.displayName || body.username, 50);

        // Validasyonlar
        if (!validateEmail(email)) {
          return errorResponse("Geçerli bir e-posta adresi girin", 400, "INVALID_EMAIL");
        }
        if (!validateUsername(username)) {
          return errorResponse("Kullanıcı adı 3-20 karakter olmalı (harf, rakam, alt çizgi)", 400, "INVALID_USERNAME");
        }
        if (!validatePassword(password)) {
          return errorResponse("Şifre en az 8 karakter olmalı", 400, "INVALID_PASSWORD");
        }

        // Email/username kontrolü
        const existingEmail = await env.DB.prepare(
          "SELECT id FROM users WHERE email = ?"
        ).bind(email).first();
        if (existingEmail) {
          return errorResponse("Bu e-posta adresi zaten kullanılıyor", 400, "EMAIL_EXISTS");
        }

        const existingUsername = await env.DB.prepare(
          "SELECT id FROM users WHERE username = ?"
        ).bind(username).first();
        if (existingUsername) {
          return errorResponse("Bu kullanıcı adı zaten kullanılıyor", 400, "USERNAME_EXISTS");
        }

        // Kullanıcı oluştur
        const passwordHash = await hashPassword(password);
        const verificationToken = generateToken(48);
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        await env.DB.prepare(`
          INSERT INTO users (email, password_hash, username, display_name, verification_token, verification_expires)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(email, passwordHash, username, displayName, verificationToken, verificationExpires).run();

        // Doğrulama e-postası gönder
        const emailSent = await sendVerificationEmail(env, email, verificationToken, username);

        return jsonResponse({
          success: true,
          message: "Hesabınız oluşturuldu. Lütfen e-postanızı kontrol edin.",
          emailSent
        }, 201);
      }

      // E-posta doğrulama
      if (path === "/api/auth/verify" && method === "POST") {
        const body = await request.json();
        const token = sanitizeString(body.token, 100);

        if (!token) {
          return errorResponse("Doğrulama kodu gerekli", 400, "TOKEN_REQUIRED");
        }

        const user = await env.DB.prepare(`
          SELECT id, email, username FROM users
          WHERE verification_token = ? AND verification_expires > datetime('now') AND email_verified = 0
        `).bind(token).first();

        if (!user) {
          return errorResponse("Geçersiz veya süresi dolmuş doğrulama kodu", 400, "INVALID_TOKEN");
        }

        await env.DB.prepare(`
          UPDATE users SET email_verified = 1, verification_token = NULL, verification_expires = NULL
          WHERE id = ?
        `).bind(user.id).run();

        return jsonResponse({
          success: true,
          message: "E-posta adresiniz doğrulandı. Artık giriş yapabilirsiniz."
        });
      }

      // Giriş yap
      if (path === "/api/auth/login" && method === "POST") {
        const body = await request.json();
        const emailOrUsername = sanitizeString(body.email || body.username, 255).toLowerCase();
        const password = body.password;

        if (!emailOrUsername || !password) {
          return errorResponse("E-posta/kullanıcı adı ve şifre gerekli", 400, "CREDENTIALS_REQUIRED");
        }

        const user = await env.DB.prepare(`
          SELECT id, email, username, display_name, avatar_url, role, email_verified, is_active, password_hash
          FROM users
          WHERE (email = ? OR username = ?)
        `).bind(emailOrUsername, emailOrUsername).first();

        if (!user || !(await verifyPassword(password, user.password_hash))) {
          return errorResponse("E-posta/kullanıcı adı veya şifre hatalı", 401, "INVALID_CREDENTIALS");
        }

        if (!user.is_active) {
          return errorResponse("Hesabınız devre dışı bırakılmış", 403, "ACCOUNT_DISABLED");
        }

        if (!user.email_verified) {
          return errorResponse("Lütfen önce e-posta adresinizi doğrulayın", 403, "EMAIL_NOT_VERIFIED");
        }

        // Session oluştur
        const sessionToken = generateToken(64);
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 gün
        const ip = request.headers.get("CF-Connecting-IP") || "unknown";
        const userAgent = request.headers.get("User-Agent") || "unknown";

        await env.DB.prepare(`
          INSERT INTO sessions (user_id, token, expires_at, ip, user_agent)
          VALUES (?, ?, ?, ?, ?)
        `).bind(user.id, sessionToken, expiresAt, ip, userAgent).run();

        // Last login güncelle
        await env.DB.prepare(`
          UPDATE users SET last_login = datetime('now') WHERE id = ?
        `).bind(user.id).run();

        return jsonResponse({
          success: true,
          token: sessionToken,
          expiresAt,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            displayName: user.display_name,
            avatarUrl: user.avatar_url,
            role: user.role
          }
        });
      }

      // Çıkış yap
      if (path === "/api/auth/logout" && method === "POST") {
        const session = await getSessionUser(env, request);
        if (session) {
          await env.DB.prepare("DELETE FROM sessions WHERE token = ?")
            .bind(session.token).run();
        }
        return jsonResponse({ success: true });
      }

      // Mevcut kullanıcı bilgisi
      if (path === "/api/auth/me" && method === "GET") {
        const session = await getSessionUser(env, request);
        if (!session) {
          return errorResponse("Oturum geçersiz", 401, "UNAUTHORIZED");
        }

        return jsonResponse({
          user: {
            id: session.user_id,
            email: session.email,
            username: session.username,
            displayName: session.display_name,
            avatarUrl: session.avatar_url,
            role: session.role
          }
        });
      }

      // Şifre sıfırlama isteği
      if (path === "/api/auth/forgot-password" && method === "POST") {
        const body = await request.json();
        const email = sanitizeString(body.email, 255).toLowerCase();

        if (!validateEmail(email)) {
          return errorResponse("Geçerli bir e-posta adresi girin", 400, "INVALID_EMAIL");
        }

        const user = await env.DB.prepare(
          "SELECT id, username FROM users WHERE email = ? AND is_active = 1"
        ).bind(email).first();

        // Güvenlik: Kullanıcı olsun olmasın aynı mesajı ver
        if (user) {
          const resetToken = generateToken(48);
          const resetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 saat

          await env.DB.prepare(`
            UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?
          `).bind(resetToken, resetExpires, user.id).run();

          await sendPasswordResetEmail(env, email, resetToken, user.username);
        }

        return jsonResponse({
          success: true,
          message: "Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi."
        });
      }

      // Şifre sıfırlama
      if (path === "/api/auth/reset-password" && method === "POST") {
        const body = await request.json();
        const token = sanitizeString(body.token, 100);
        const newPassword = body.password;

        if (!token) {
          return errorResponse("Sıfırlama kodu gerekli", 400, "TOKEN_REQUIRED");
        }
        if (!validatePassword(newPassword)) {
          return errorResponse("Şifre en az 8 karakter olmalı", 400, "INVALID_PASSWORD");
        }

        const user = await env.DB.prepare(`
          SELECT id FROM users
          WHERE reset_token = ? AND reset_expires > datetime('now')
        `).bind(token).first();

        if (!user) {
          return errorResponse("Geçersiz veya süresi dolmuş sıfırlama kodu", 400, "INVALID_TOKEN");
        }

        const passwordHash = await hashPassword(newPassword);

        await env.DB.prepare(`
          UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL
          WHERE id = ?
        `).bind(passwordHash, user.id).run();

        // Tüm oturumları sonlandır
        await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?")
          .bind(user.id).run();

        return jsonResponse({
          success: true,
          message: "Şifreniz başarıyla değiştirildi. Yeni şifrenizle giriş yapabilirsiniz."
        });
      }

      // Doğrulama e-postasını yeniden gönder
      if (path === "/api/auth/resend-verification" && method === "POST") {
        const body = await request.json();
        const email = sanitizeString(body.email, 255).toLowerCase();

        if (!validateEmail(email)) {
          return errorResponse("Geçerli bir e-posta adresi girin", 400, "INVALID_EMAIL");
        }

        const user = await env.DB.prepare(
          "SELECT id, username FROM users WHERE email = ? AND email_verified = 0"
        ).bind(email).first();

        if (user) {
          const verificationToken = generateToken(48);
          const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

          await env.DB.prepare(`
            UPDATE users SET verification_token = ?, verification_expires = ? WHERE id = ?
          `).bind(verificationToken, verificationExpires, user.id).run();

          await sendVerificationEmail(env, email, verificationToken, user.username);
        }

        return jsonResponse({
          success: true,
          message: "Doğrulama e-postası gönderildi."
        });
      }

      // ================================
      // 📬 CONTACT FORM
      // ================================

      if (path === "/api/contact" && method === "POST") {
        const body = await request.json();
        const name = sanitizeString(body.name, 100);
        const email = sanitizeString(body.email, 200);
        const subject = sanitizeString(body.subject, 100);
        const message = sanitizeString(body.message, 5000);

        if (!name || !email || !subject || !message) {
          return errorResponse("Tüm alanlar zorunludur", 400, "MISSING_FIELDS");
        }

        // Basic email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return errorResponse("Geçersiz e-posta adresi", 400, "INVALID_EMAIL");
        }

        const subjectLabels = {
          genel: "Genel Soru",
          oneri: "Öneri",
          hata: "Hata Bildirimi",
          isbirligi: "İşbirliği",
          diger: "Diğer"
        };
        const subjectLabel = subjectLabels[subject] || subject;

        try {
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'onboarding@resend.dev',
              to: '3d-labx@3d-labx.com',
              reply_to: email,
              subject: `[3D-labX İletişim] ${subjectLabel} - ${name}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #2563EB;">Yeni İletişim Formu Mesajı</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; font-weight: bold; color: #333;">İsim:</td><td style="padding: 8px;">${name}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold; color: #333;">E-posta:</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
                    <tr><td style="padding: 8px; font-weight: bold; color: #333;">Konu:</td><td style="padding: 8px;">${subjectLabel}</td></tr>
                  </table>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
                  <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
                    <p style="margin: 0; white-space: pre-wrap; color: #333;">${message}</p>
                  </div>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
                  <p style="color: #999; font-size: 12px;">Bu mesaj 3D-labX iletişim formundan gönderilmiştir.</p>
                </div>
              `
            })
          });

          if (!response.ok) {
            console.error('Contact email error:', response.status);
            return errorResponse("E-posta gönderilemedi. Lütfen tekrar deneyin.", 500, "EMAIL_ERROR");
          }

          return jsonResponse({ success: true, message: "Mesajınız başarıyla gönderildi." });
        } catch (error) {
          console.error('Contact form error:', error);
          return errorResponse("Bir hata oluştu. Lütfen tekrar deneyin.", 500, "SEND_ERROR");
        }
      }

      // ================================
      // 📊 POLL ENDPOINTS
      // ================================

      // Aktif anketi getir
      if (path === "/api/poll/active" && method === "GET") {
        const poll = await env.DB.prepare(`
          SELECT id, question, ends_at, created_at
          FROM polls
          WHERE is_active = 1
          ORDER BY created_at DESC
          LIMIT 1
        `).first();

        if (!poll) {
          return jsonResponse({ poll: null });
        }

        const options = await env.DB.prepare(`
          SELECT id, option_text, vote_count
          FROM poll_options
          WHERE poll_id = ?
          ORDER BY display_order ASC
        `).bind(poll.id).all();

        const totalVotes = options.results.reduce((sum, opt) => sum + opt.vote_count, 0);

        // Kullanıcının oy verip vermediğini kontrol et
        const ipHash = await sha256(clientIP + poll.id);
        const existingVote = await env.DB.prepare(`
          SELECT option_id FROM poll_votes WHERE poll_id = ? AND ip_hash = ?
        `).bind(poll.id, ipHash).first();

        return jsonResponse({
          poll: {
            ...poll,
            options: options.results.map(opt => ({
              id: opt.id,
              text: opt.option_text,
              votes: opt.vote_count,
              percent: totalVotes > 0 ? Math.round((opt.vote_count / totalVotes) * 100) : 0
            })),
            totalVotes,
            hasVoted: !!existingVote,
            votedOptionId: existingVote?.option_id || null
          }
        }, 200, 60);
      }

      // Oy kullan
      if (path === "/api/poll/vote" && method === "POST") {
        const { pollId, optionId } = await request.json();

        if (!pollId || !optionId) {
          return errorResponse("Poll ID ve Option ID gerekli", 400, "MISSING_DATA");
        }

        // Anketin aktif olup olmadığını kontrol et
        const poll = await env.DB.prepare(`
          SELECT id FROM polls WHERE id = ? AND is_active = 1
        `).bind(pollId).first();

        if (!poll) {
          return errorResponse("Anket bulunamadı veya aktif değil", 404, "POLL_NOT_FOUND");
        }

        // Option'ın geçerli olup olmadığını kontrol et
        const option = await env.DB.prepare(`
          SELECT id FROM poll_options WHERE id = ? AND poll_id = ?
        `).bind(optionId, pollId).first();

        if (!option) {
          return errorResponse("Geçersiz seçenek", 400, "INVALID_OPTION");
        }

        // IP hash ile daha önce oy verilmiş mi kontrol et
        const ipHash = await sha256(clientIP + pollId);
        const existingVote = await env.DB.prepare(`
          SELECT id FROM poll_votes WHERE poll_id = ? AND ip_hash = ?
        `).bind(pollId, ipHash).first();

        if (existingVote) {
          return errorResponse("Bu ankete zaten oy verdiniz", 400, "ALREADY_VOTED");
        }

        // Session'dan user ID al (varsa)
        let userId = null;
        const authHeader = request.headers.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          const session = await env.DB.prepare(`
            SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime('now')
          `).bind(token).first();
          if (session) {
            userId = session.user_id;
          }
        }

        // Oy kaydet
        await env.DB.prepare(`
          INSERT INTO poll_votes (poll_id, option_id, user_id, ip_hash)
          VALUES (?, ?, ?, ?)
        `).bind(pollId, optionId, userId, ipHash).run();

        // Vote count güncelle
        await env.DB.prepare(`
          UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = ?
        `).bind(optionId).run();

        // Güncel sonuçları döndür
        const options = await env.DB.prepare(`
          SELECT id, option_text, vote_count
          FROM poll_options
          WHERE poll_id = ?
          ORDER BY display_order ASC
        `).bind(pollId).all();

        const totalVotes = options.results.reduce((sum, opt) => sum + opt.vote_count, 0);

        return jsonResponse({
          success: true,
          options: options.results.map(opt => ({
            id: opt.id,
            text: opt.option_text,
            votes: opt.vote_count,
            percent: totalVotes > 0 ? Math.round((opt.vote_count / totalVotes) * 100) : 0
          })),
          totalVotes,
          votedOptionId: optionId
        });
      }

      // ================================
      // 🔐 ADMIN ENDPOINTS
      // ================================
      if (isAdminPath) {
        const secret = request.headers.get("X-ADMIN-SECRET");
        if (!secret || secret !== env.ADMIN_SECRET) {
          return errorResponse("Forbidden", 403, "FORBIDDEN");
        }

        // Admin: Anket Oluştur
        if (path === "/admin/poll/create" && method === "POST") {
          const { question, options } = await request.json();

          if (!question || !options || !Array.isArray(options) || options.length < 2) {
            return errorResponse("Soru ve en az 2 seçenek gerekli", 400, "INVALID_DATA");
          }

          // Önceki aktif anketleri kapat
          await env.DB.prepare(`UPDATE polls SET is_active = 0`).run();

          // Yeni anket oluştur
          const result = await env.DB.prepare(`
            INSERT INTO polls (question, is_active, created_at)
            VALUES (?, 1, datetime('now'))
          `).bind(question).run();

          const pollId = result.meta.last_row_id;

          // Seçenekleri ekle
          for (let i = 0; i < options.length; i++) {
            await env.DB.prepare(`
              INSERT INTO poll_options (poll_id, option_text, display_order, vote_count)
              VALUES (?, ?, ?, 0)
            `).bind(pollId, options[i], i + 1).run();
          }

          await logAdminAction(env, request, "CREATE_POLL", pollId, question);

          return jsonResponse({ success: true, pollId });
        }

        // Admin: Anketleri Listele
        if (path === "/admin/polls" && method === "GET") {
          const polls = await env.DB.prepare(`
            SELECT p.*,
              (SELECT SUM(vote_count) FROM poll_options WHERE poll_id = p.id) as total_votes
            FROM polls p
            ORDER BY created_at DESC
            LIMIT 20
          `).all();

          return jsonResponse(polls.results || []);
        }

        // Admin: Tüm Yazılar
        if (path === "/admin/posts" && method === "GET") {
          const posts = await env.DB.prepare(`
            SELECT id, title_tr, summary_tr, slug, category, post_type, is_featured, published, status, ai_generated, created_at
            FROM posts
            ORDER BY created_at DESC
            LIMIT 200
          `).all();

          return jsonResponse(posts.results || []);
        }

        // Admin: Tek Post Detay
        if (path.startsWith("/admin/post/") && method === "GET") {
          const pathId = path.replace("/admin/post/", "");
          const id = validateId(pathId);
          if (!id) return errorResponse("Invalid ID", 400, "INVALID_ID");

          const post = await env.DB.prepare(`
            SELECT id, title_tr, summary_tr, content_tr, title_en, summary_en, content_en,
                   slug, category, post_type, image_url, source_url, is_featured, published, status, ai_generated, created_at
            FROM posts
            WHERE id = ?
          `).bind(id).first();

          if (!post) return errorResponse("Post not found", 404, "NOT_FOUND");

          return jsonResponse(post);
        }

        // Admin: Öne Çıkar
        if (path === "/admin/feature" && method === "POST") {
          const body = await request.json();
          const id = validateId(body.id);
          if (!id) return errorResponse("Invalid ID", 400, "INVALID_ID");

          const featured = body.featured ? 1 : 0;
          await env.DB.prepare(`UPDATE posts SET is_featured = ? WHERE id = ?`).bind(featured, id).run();
          await logAdminAction(env, request, featured ? "feature" : "unfeature", id);

          return jsonResponse({ success: true, id, featured: !!featured });
        }

        // Admin: Güncelle (POST /admin/update veya PUT /admin/update/:id)
        if ((path === "/admin/update" && method === "POST") ||
            (path.startsWith("/admin/update/") && (method === "PUT" || method === "POST"))) {

          let id;
          let body;

          if (path === "/admin/update") {
            // POST /admin/update - ID body'de
            body = await request.json();
            id = validateId(body.id);
          } else {
            // PUT/POST /admin/update/:id - ID URL'de
            const pathId = path.replace("/admin/update/", "");
            id = validateId(pathId);
            body = await request.json();
          }

          if (!id) return errorResponse("Invalid ID", 400, "INVALID_ID");

          const updates = [];
          const bindings = [];

          if (body.title_tr !== undefined) {
            updates.push("title_tr = ?");
            bindings.push(sanitizeString(body.title_tr, 300));
          }
          if (body.summary_tr !== undefined) {
            updates.push("summary_tr = ?");
            bindings.push(sanitizeString(body.summary_tr, 500));
          }
          if (body.content_tr !== undefined) {
            updates.push("content_tr = ?");
            bindings.push(sanitizeString(body.content_tr, 50000));
          }
          if (body.title_en !== undefined) {
            updates.push("title_en = ?");
            bindings.push(body.title_en ? sanitizeString(body.title_en, 300) : null);
          }
          if (body.summary_en !== undefined) {
            updates.push("summary_en = ?");
            bindings.push(body.summary_en ? sanitizeString(body.summary_en, 500) : null);
          }
          if (body.content_en !== undefined) {
            updates.push("content_en = ?");
            bindings.push(body.content_en ? sanitizeString(body.content_en, 50000) : null);
          }
          if (body.published !== undefined) {
            updates.push("published = ?");
            bindings.push(body.published ? 1 : 0);
          }
          if (body.is_featured !== undefined) {
            updates.push("is_featured = ?");
            bindings.push(body.is_featured ? 1 : 0);
          }
          if (body.category !== undefined && validateCategory(body.category)) {
            updates.push("category = ?");
            bindings.push(body.category);
          }
          if (body.post_type !== undefined && validatePostType(body.post_type)) {
            updates.push("post_type = ?");
            bindings.push(body.post_type);
          }
          if (body.image_url !== undefined) {
            updates.push("image_url = ?");
            bindings.push(sanitizeString(body.image_url, 500) || null);
          }
          if (body.source_url !== undefined) {
            updates.push("source_url = ?");
            bindings.push(sanitizeString(body.source_url, 500) || null);
          }

          if (updates.length === 0) {
            return errorResponse("No fields to update", 400, "NO_FIELDS");
          }

          bindings.push(id);
          await env.DB.prepare(`UPDATE posts SET ${updates.join(", ")} WHERE id = ?`).bind(...bindings).run();
          await logAdminAction(env, request, "update", id);

          return jsonResponse({ success: true, id });
        }

        // Admin: Sil (POST /admin/delete veya DELETE /admin/delete/:id)
        if ((path === "/admin/delete" && method === "POST") ||
            (path.startsWith("/admin/delete/") && (method === "DELETE" || method === "POST"))) {

          let id;

          if (path === "/admin/delete") {
            // POST /admin/delete - ID body'de
            const body = await request.json();
            id = validateId(body.id);
          } else {
            // DELETE/POST /admin/delete/:id - ID URL'de
            const pathId = path.replace("/admin/delete/", "");
            id = validateId(pathId);
          }

          if (!id) return errorResponse("Invalid ID", 400, "INVALID_ID");

          await env.DB.prepare(`DELETE FROM posts WHERE id = ?`).bind(id).run();
          await logAdminAction(env, request, "delete", id);

          return jsonResponse({ success: true, id });
        }

        // Admin: Yeni Post Ekle
        if (path === "/admin/create" && method === "POST") {
          const body = await request.json();

          const title = sanitizeString(body.title_tr, 300);
          const summary = sanitizeString(body.summary_tr, 500);
          const content = sanitizeString(body.content_tr, 50000);
          const category = validateCategory(body.category) ? body.category : "teknoloji";
          const postType = validatePostType(body.post_type) ? body.post_type : "haber";
          const imageUrl = sanitizeString(body.image_url, 500) || null;

          if (!title) return errorResponse("Title required", 400, "TITLE_REQUIRED");

          const slug = createSlug(title);

          const result = await env.DB.prepare(`
            INSERT INTO posts (title_tr, summary_tr, content_tr, slug, category, post_type, image_url, published, ai_generated, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'draft')
          `).bind(title, summary, content, slug, category, postType, imageUrl, body.published ? 1 : 0).run();

          await logAdminAction(env, request, "create", result.meta?.last_row_id);

          return jsonResponse({ success: true, id: result.meta?.last_row_id, slug });
        }

        // Admin: AI Test
        if (path === "/admin/ai-test" && method === "GET") {
          const text = await generateWithAI(env, "Say 'AI is working!' in Turkish");
          return jsonResponse({ result: text, configured: !!env.GEMINI_API_KEY, deepseek: !!env.deep_seek_api_key });
        }

        // Admin: AI Generate
        if (path === "/admin/ai-generate" && method === "POST") {
          const body = await request.json();
          const sourceText = sanitizeString(body.source_text, 5000);
          const category = validateCategory(body.category) ? body.category : "teknoloji";

          if (!sourceText) return errorResponse("source_text required", 400, "SOURCE_REQUIRED");

          const prompt = `Aşağıdaki metni Türkçe bir teknoloji haberi haline getir.
Sadece JSON döndür, başka hiçbir şey yazma.

{
  "title_tr": "Başlık (max 100 karakter)",
  "summary_tr": "Özet (max 200 karakter)",
  "content_tr": "Detaylı içerik (paragraflar halinde, min 500 karakter)"
}

Kaynak metin:
${sourceText}`;

          const aiText = await generateWithAI(env, prompt);
          if (!aiText) return errorResponse("AI generation failed", 500, "AI_ERROR");

          let parsed;
          try {
            const cleanJson = aiText.replace(/```json\n?|\n?```/g, "").trim();
            parsed = JSON.parse(cleanJson);
          } catch {
            return errorResponse("AI response parse failed", 500, "PARSE_ERROR");
          }

          const slug = createSlug(parsed.title_tr);
          const postType = validatePostType(body.post_type) ? body.post_type : "haber";

          const result = await env.DB.prepare(`
            INSERT INTO posts (title_tr, summary_tr, content_tr, slug, category, post_type, ai_generated, status, published)
            VALUES (?, ?, ?, ?, ?, ?, 1, 'draft', 0)
          `).bind(parsed.title_tr, parsed.summary_tr, parsed.content_tr, slug, category, postType).run();

          await logAdminAction(env, request, "ai-generate", result.meta?.last_row_id);

          return jsonResponse({
            success: true,
            id: result.meta?.last_row_id,
            slug,
            title: parsed.title_tr
          });
        }

        // Admin: Loglar
        if (path === "/admin/logs" && method === "GET") {
          const logs = await env.DB.prepare(`
            SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 100
          `).all();
          return jsonResponse(logs.results || []);
        }

        // Admin: R2 Image Upload
        if (path === "/admin/upload-image" && method === "POST") {
          if (!env.R2_IMAGES) {
            return errorResponse("R2 storage not configured", 500, "R2_NOT_CONFIGURED");
          }

          const contentType = request.headers.get("Content-Type") || "";

          try {
            let imageBuffer;
            let fileName;
            let mimeType;

            if (contentType.includes("multipart/form-data")) {
              // Direct file upload
              const formData = await request.formData();
              const file = formData.get("file");
              if (!file) {
                return errorResponse("File required", 400, "FILE_REQUIRED");
              }
              imageBuffer = await file.arrayBuffer();
              fileName = file.name || `image-${Date.now()}`;
              mimeType = file.type || "image/jpeg";
            } else if (contentType.includes("application/json")) {
              // URL-based upload
              const body = await request.json();
              if (!body.url) {
                return errorResponse("URL required for URL-based upload", 400, "URL_REQUIRED");
              }

              // Fetch image from URL
              const imageRes = await fetch(body.url);
              if (!imageRes.ok) {
                return errorResponse("Failed to fetch image from URL", 400, "FETCH_ERROR");
              }

              imageBuffer = await imageRes.arrayBuffer();
              mimeType = imageRes.headers.get("Content-Type") || "image/jpeg";

              // Extract filename from URL or generate one
              const urlPath = new URL(body.url).pathname;
              fileName = urlPath.split("/").pop() || `image-${Date.now()}.jpg`;
            } else {
              return errorResponse("Invalid content type", 400, "INVALID_CONTENT_TYPE");
            }

            // Generate unique key
            const ext = fileName.split(".").pop() || "jpg";
            const key = `images/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

            // Upload to R2
            await env.R2_IMAGES.put(key, imageBuffer, {
              httpMetadata: {
                contentType: mimeType
              }
            });

            // Construct public URL (requires R2 public access to be enabled)
            const publicUrl = `${CONFIG.R2_PUBLIC_URL}/${key}`;

            await logAdminAction(env, request, "upload-image", null, key);

            return jsonResponse({
              success: true,
              key,
              url: publicUrl,
              size: imageBuffer.byteLength
            });
          } catch (error) {
            console.error("Upload error:", error);
            return errorResponse("Upload failed: " + error.message, 500, "UPLOAD_ERROR");
          }
        }

        // Admin: AI Image Generate
        if (path === "/admin/ai-image" && method === "POST") {
          if (!env.AI) {
            return errorResponse("AI not configured", 500, "AI_NOT_CONFIGURED");
          }
          if (!env.R2_IMAGES) {
            return errorResponse("R2 storage not configured", 500, "R2_NOT_CONFIGURED");
          }

          try {
            const body = await request.json();
            const title = sanitizeString(body.title, 200);
            const category = sanitizeString(body.category, 50);

            if (!title) {
              return errorResponse("Title required", 400, "TITLE_REQUIRED");
            }

            // Generate prompt based on title and category
            let style = "modern, professional, tech blog header image, minimalist design";
            if (category === "3d-baski") {
              style = "3D printing, filament, 3D printer, technology, modern, professional";
            } else if (category === "yapay-zeka") {
              style = "artificial intelligence, neural network, futuristic, digital, abstract";
            } else if (category === "teknoloji") {
              style = "technology, gadgets, innovation, modern, sleek design";
            }

            const prompt = `${title}, ${style}, high quality, 16:9 aspect ratio, no text`;

            // Generate image using Workers AI (Stable Diffusion)
            const aiResponse = await env.AI.run("@cf/stabilityai/stable-diffusion-xl-base-1.0", {
              prompt: prompt,
              num_steps: 20,
            });

            if (!aiResponse) {
              return errorResponse("AI image generation failed", 500, "AI_GENERATION_FAILED");
            }

            // Convert response to buffer
            const imageBuffer = aiResponse;

            // Generate unique key
            const key = `ai-images/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

            // Upload to R2
            await env.R2_IMAGES.put(key, imageBuffer, {
              httpMetadata: {
                contentType: "image/png"
              }
            });

            const publicUrl = `${CONFIG.R2_PUBLIC_URL}/${key}`;

            await logAdminAction(env, request, "ai-image-generate", null, key);

            return jsonResponse({
              success: true,
              key,
              url: publicUrl,
              prompt: prompt
            });
          } catch (error) {
            console.error("AI image generation error:", error);
            return errorResponse("AI image generation failed: " + error.message, 500, "AI_IMAGE_ERROR");
          }
        }

        // Admin: R2 Image Delete
        if (path.startsWith("/admin/delete-image/") && method === "DELETE") {
          if (!env.R2_IMAGES) {
            return errorResponse("R2 storage not configured", 500, "R2_NOT_CONFIGURED");
          }

          const key = decodeURIComponent(path.replace("/admin/delete-image/", ""));
          if (!key) {
            return errorResponse("Image key required", 400, "KEY_REQUIRED");
          }

          try {
            await env.R2_IMAGES.delete(key);
            await logAdminAction(env, request, "delete-image", null, key);

            return jsonResponse({ success: true, key });
          } catch (error) {
            console.error("Delete error:", error);
            return errorResponse("Delete failed: " + error.message, 500, "DELETE_ERROR");
          }
        }

        // Admin: List R2 Images
        if (path === "/admin/images" && method === "GET") {
          if (!env.R2_IMAGES) {
            return errorResponse("R2 storage not configured", 500, "R2_NOT_CONFIGURED");
          }

          const cursor = url.searchParams.get("cursor") || undefined;
          const limit = Math.min(100, parseInt(url.searchParams.get("limit") || "20", 10));

          try {
            const listed = await env.R2_IMAGES.list({
              prefix: "images/",
              limit,
              cursor
            });

            const images = listed.objects.map(obj => ({
              key: obj.key,
              url: `https://images.3d-labx.com/${obj.key}`,
              size: obj.size,
              uploaded: obj.uploaded
            }));

            return jsonResponse({
              success: true,
              images,
              truncated: listed.truncated,
              cursor: listed.truncated ? listed.cursor : null
            });
          } catch (error) {
            console.error("List error:", error);
            return errorResponse("List failed: " + error.message, 500, "LIST_ERROR");
          }
        }

        // Admin: Anket Listesi
        if (path === "/admin/polls" && method === "GET") {
          const polls = await env.DB.prepare(`
            SELECT p.id, p.question, p.is_active, p.ends_at, p.created_at,
                   (SELECT SUM(vote_count) FROM poll_options WHERE poll_id = p.id) as total_votes
            FROM polls p
            ORDER BY p.created_at DESC
          `).all();

          return jsonResponse(polls.results || []);
        }

        // Admin: Anket Oluştur
        if (path === "/admin/polls" && method === "POST") {
          const { question, options } = await request.json();

          if (!question || !options || options.length < 2) {
            return errorResponse("Soru ve en az 2 seçenek gerekli", 400, "INVALID_DATA");
          }

          // Anket oluştur
          const pollResult = await env.DB.prepare(`
            INSERT INTO polls (question, is_active) VALUES (?, 1)
          `).bind(question).run();

          const pollId = pollResult.meta.last_row_id;

          // Seçenekleri ekle
          for (let i = 0; i < options.length; i++) {
            await env.DB.prepare(`
              INSERT INTO poll_options (poll_id, option_text, display_order) VALUES (?, ?, ?)
            `).bind(pollId, options[i], i).run();
          }

          // Diğer anketleri pasif yap
          await env.DB.prepare(`
            UPDATE polls SET is_active = 0 WHERE id != ?
          `).bind(pollId).run();

          return jsonResponse({ success: true, pollId });
        }

        // Admin: Anket Sil
        if (path.startsWith("/admin/polls/") && method === "DELETE") {
          const pollId = validateId(path.replace("/admin/polls/", ""));
          if (!pollId) return errorResponse("Invalid ID", 400, "INVALID_ID");

          await env.DB.prepare(`DELETE FROM polls WHERE id = ?`).bind(pollId).run();

          return jsonResponse({ success: true });
        }

        // Admin: Anket Aktif/Pasif
        if (path.startsWith("/admin/polls/") && path.endsWith("/toggle") && method === "POST") {
          const pollId = validateId(path.replace("/admin/polls/", "").replace("/toggle", ""));
          if (!pollId) return errorResponse("Invalid ID", 400, "INVALID_ID");

          // Önce mevcut durumu al
          const poll = await env.DB.prepare(`SELECT is_active FROM polls WHERE id = ?`).bind(pollId).first();
          if (!poll) return errorResponse("Poll not found", 404, "NOT_FOUND");

          const newStatus = poll.is_active ? 0 : 1;

          // Eğer aktif yapılıyorsa diğerlerini pasif yap
          if (newStatus === 1) {
            await env.DB.prepare(`UPDATE polls SET is_active = 0`).run();
          }

          await env.DB.prepare(`UPDATE polls SET is_active = ? WHERE id = ?`).bind(newStatus, pollId).run();

          return jsonResponse({ success: true, is_active: newStatus });
        }

        // Admin: Cron Durumu
        if (path === "/admin/cron-status" && method === "GET") {
          const lastAiPost = await env.DB.prepare(`
            SELECT created_at FROM posts WHERE ai_generated = 1 ORDER BY created_at DESC LIMIT 1
          `).first();

          const rssSources = await getRssSources(env);

          return jsonResponse({
            enabled: CONFIG.CRON_ENABLED,
            lastRun: lastAiPost?.created_at || null,
            sources: Object.keys(rssSources).length,
            maxItemsPerSource: CONFIG.CRON_MAX_ITEMS_PER_SOURCE
          });
        }

        // Admin: RSS Kaynakları Listele
        if (path === "/admin/rss" && method === "GET") {
          try {
            const sources = await env.DB.prepare(`
              SELECT id, category, url, name, is_active, created_at
              FROM rss_sources
              ORDER BY category, name
            `).all();

            // Eğer tablo boşsa varsayılanları döndür
            if (!sources.results || sources.results.length === 0) {
              const defaultList = [];
              for (const [category, urls] of Object.entries(DEFAULT_RSS_SOURCES)) {
                for (const url of urls) {
                  defaultList.push({
                    id: null,
                    category,
                    url,
                    name: new URL(url).hostname.replace('www.', ''),
                    is_active: 1,
                    is_default: true
                  });
                }
              }
              return jsonResponse({ sources: defaultList, isDefault: true });
            }

            return jsonResponse({ sources: sources.results, isDefault: false });
          } catch (error) {
            // Tablo yoksa oluştur ve varsayılanları döndür
            console.error("RSS fetch error:", error);
            const defaultList = [];
            for (const [category, urls] of Object.entries(DEFAULT_RSS_SOURCES)) {
              for (const url of urls) {
                defaultList.push({
                  id: null,
                  category,
                  url,
                  name: new URL(url).hostname.replace('www.', ''),
                  is_active: 1,
                  is_default: true
                });
              }
            }
            return jsonResponse({ sources: defaultList, isDefault: true });
          }
        }

        // Admin: RSS Kaynak Ekle
        if (path === "/admin/rss" && method === "POST") {
          const { category, url, name } = await request.json();

          if (!category || !url) {
            return errorResponse("Kategori ve URL gerekli", 400, "MISSING_DATA");
          }

          if (!validateCategory(category)) {
            return errorResponse("Geçersiz kategori", 400, "INVALID_CATEGORY");
          }

          // URL geçerliliğini kontrol et
          try {
            new URL(url);
          } catch {
            return errorResponse("Geçersiz URL formatı", 400, "INVALID_URL");
          }

          const sourceName = name || new URL(url).hostname.replace('www.', '');

          try {
            const result = await env.DB.prepare(`
              INSERT INTO rss_sources (category, url, name, is_active) VALUES (?, ?, ?, 1)
            `).bind(category, url, sourceName).run();

            return jsonResponse({
              success: true,
              id: result.meta?.last_row_id,
              message: "RSS kaynağı eklendi"
            });
          } catch (error) {
            if (error.message?.includes('UNIQUE')) {
              return errorResponse("Bu URL zaten mevcut", 400, "DUPLICATE_URL");
            }
            throw error;
          }
        }

        // Admin: RSS Kaynak Güncelle
        if (path.startsWith("/admin/rss/") && method === "PUT") {
          const id = validateId(path.replace("/admin/rss/", ""));
          if (!id) return errorResponse("Geçersiz ID", 400, "INVALID_ID");

          const { is_active, name, category, url } = await request.json();

          const updates = [];
          const bindings = [];

          if (is_active !== undefined) {
            updates.push("is_active = ?");
            bindings.push(is_active ? 1 : 0);
          }
          if (name !== undefined) {
            updates.push("name = ?");
            bindings.push(sanitizeString(name, 100));
          }
          if (category !== undefined && validateCategory(category)) {
            updates.push("category = ?");
            bindings.push(category);
          }
          if (url !== undefined) {
            try {
              new URL(url);
              updates.push("url = ?");
              bindings.push(url);
            } catch {
              return errorResponse("Geçersiz URL formatı", 400, "INVALID_URL");
            }
          }

          if (updates.length === 0) {
            return errorResponse("Güncellenecek alan yok", 400, "NO_FIELDS");
          }

          bindings.push(id);
          await env.DB.prepare(`UPDATE rss_sources SET ${updates.join(", ")} WHERE id = ?`).bind(...bindings).run();

          return jsonResponse({ success: true, message: "RSS kaynağı güncellendi" });
        }

        // Admin: RSS Kaynak Sil
        if (path.startsWith("/admin/rss/") && method === "DELETE") {
          const id = validateId(path.replace("/admin/rss/", ""));
          if (!id) return errorResponse("Geçersiz ID", 400, "INVALID_ID");

          await env.DB.prepare(`DELETE FROM rss_sources WHERE id = ?`).bind(id).run();

          return jsonResponse({ success: true, message: "RSS kaynağı silindi" });
        }

        // Admin: Varsayılan RSS'leri DB'ye aktar
        if (path === "/admin/rss/init" && method === "POST") {
          let added = 0;
          for (const [category, urls] of Object.entries(DEFAULT_RSS_SOURCES)) {
            for (const url of urls) {
              try {
                const name = new URL(url).hostname.replace('www.', '');
                await env.DB.prepare(`
                  INSERT OR IGNORE INTO rss_sources (category, url, name, is_active) VALUES (?, ?, ?, 1)
                `).bind(category, url, name).run();
                added++;
              } catch (e) {
                console.error("RSS init error:", e);
              }
            }
          }
          return jsonResponse({ success: true, added, message: "Varsayılan RSS kaynakları eklendi" });
        }

        // ================================
        // 💰 ADMIN: FİLAMENT FİYATLAR
        // ================================

        // Admin: Filament fiyatları listesi
        if (path === "/admin/filament-prices" && method === "GET") {
          const results = await env.DB.prepare(`SELECT * FROM filament_prices ORDER BY created_at DESC`).all();
          return jsonResponse({ prices: results.results || [] });
        }

        // Admin: Filament fiyat ekle
        if (path === "/admin/filament-prices" && method === "POST") {
          const body = await request.json();

          // Tekli veya toplu ekleme
          const items = Array.isArray(body) ? body : [body];
          let added = 0;

          for (const item of items) {
            const brand = sanitizeString(item.brand, 100);
            const productName = sanitizeString(item.product_name, 200);
            const filamentType = sanitizeString(item.filament_type, 50);
            const priceTl = parseFloat(item.price_tl);

            if (!brand || !productName || !filamentType || isNaN(priceTl)) continue;

            await env.DB.prepare(`
              INSERT INTO filament_prices (brand, product_name, filament_type, weight_grams, color, price_tl, original_price_tl, store_name, store_url, image_url, in_stock, rating, discount_percent, is_best_deal)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              brand,
              productName,
              filamentType,
              item.weight_grams || 1000,
              item.color || 'Çeşitli',
              priceTl,
              item.original_price_tl || null,
              item.store_name || '',
              item.store_url || null,
              item.image_url || null,
              item.in_stock !== undefined ? item.in_stock : 1,
              item.rating || null,
              item.discount_percent || 0,
              item.is_best_deal || 0
            ).run();
            added++;
          }

          return jsonResponse({ success: true, added, message: `${added} filament fiyatı eklendi` });
        }

        // Admin: Filament fiyat sil
        if (path.startsWith("/admin/filament-prices/") && method === "DELETE") {
          const id = validateId(path.replace("/admin/filament-prices/", ""));
          if (!id) return errorResponse("Geçersiz ID", 400, "INVALID_ID");
          await env.DB.prepare(`DELETE FROM filament_prices WHERE id = ?`).bind(id).run();
          return jsonResponse({ success: true, message: "Filament fiyatı silindi" });
        }

        // Admin: Tüm filament fiyatları temizle ve yeniden yükle
        if (path === "/admin/filament-prices/reset" && method === "POST") {
          await env.DB.prepare(`DELETE FROM filament_prices`).run();
          return jsonResponse({ success: true, message: "Tüm filament fiyatları temizlendi" });
        }

        // Admin: Filament fiyatlarını web'den manuel güncelle
        if (path === "/admin/filament-prices/scrape" && method === "POST") {
          try {
            await updateFilamentPrices(env);
            const count = await env.DB.prepare("SELECT COUNT(*) as cnt FROM filament_prices").first();
            return jsonResponse({
              success: true,
              message: "Filament fiyatları web'den güncellendi",
              count: count?.cnt || 0,
              updated_at: new Date().toISOString()
            });
          } catch (error) {
            return jsonResponse({ success: false, error: error.message }, 500);
          }
        }

        // ================================
        // 📦 CONTENT BOXES ADMIN ENDPOINTS
        // ================================

        // Admin: Tüm content boxes listele
        if (path === "/admin/content-boxes" && method === "GET") {
          const boxes = await env.DB.prepare(`
            SELECT * FROM content_boxes ORDER BY display_order ASC
          `).all();
          return jsonResponse(boxes.results || []);
        }

        // Admin: Yeni content box oluştur
        if (path === "/admin/content-boxes" && method === "POST") {
          const body = await request.json();
          const { slot_key, display_order, size, content_type, config, color_theme, is_visible } = body;

          if (!slot_key || !content_type) {
            return errorResponse("slot_key ve content_type gerekli", 400, "MISSING_FIELDS");
          }

          const configStr = typeof config === 'object' ? JSON.stringify(config) : (config || '{}');

          const result = await env.DB.prepare(`
            INSERT INTO content_boxes (slot_key, display_order, size, content_type, config, color_theme, is_visible)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).bind(
            sanitizeString(slot_key),
            display_order || 0,
            size || 'normal',
            sanitizeString(content_type),
            configStr,
            color_theme || 'orange',
            is_visible !== undefined ? (is_visible ? 1 : 0) : 1
          ).run();

          await logAdminAction(env, "content_box_create", null, request);
          return jsonResponse({ success: true, id: result.meta.last_row_id, message: "İçerik kutusu oluşturuldu" }, 201);
        }

        // Admin: Content box güncelle
        if (path.match(/^\/admin\/content-boxes\/\d+$/) && method === "PUT") {
          const id = parseInt(path.split("/").pop());
          const body = await request.json();
          const { slot_key, display_order, size, content_type, config, color_theme, is_visible } = body;

          const existing = await env.DB.prepare(`SELECT id FROM content_boxes WHERE id = ?`).bind(id).first();
          if (!existing) {
            return errorResponse("İçerik kutusu bulunamadı", 404, "NOT_FOUND");
          }

          const configStr = typeof config === 'object' ? JSON.stringify(config) : config;

          const updates = [];
          const params = [];

          if (slot_key !== undefined) { updates.push("slot_key = ?"); params.push(sanitizeString(slot_key)); }
          if (display_order !== undefined) { updates.push("display_order = ?"); params.push(display_order); }
          if (size !== undefined) { updates.push("size = ?"); params.push(size); }
          if (content_type !== undefined) { updates.push("content_type = ?"); params.push(sanitizeString(content_type)); }
          if (config !== undefined) { updates.push("config = ?"); params.push(configStr); }
          if (color_theme !== undefined) { updates.push("color_theme = ?"); params.push(color_theme); }
          if (is_visible !== undefined) { updates.push("is_visible = ?"); params.push(is_visible ? 1 : 0); }

          if (updates.length === 0) {
            return errorResponse("Güncellenecek alan yok", 400, "NO_UPDATES");
          }

          updates.push("updated_at = CURRENT_TIMESTAMP");
          params.push(id);

          await env.DB.prepare(`UPDATE content_boxes SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();
          await logAdminAction(env, "content_box_update", id, request);
          return jsonResponse({ success: true, message: "İçerik kutusu güncellendi" });
        }

        // Admin: Content box sil
        if (path.match(/^\/admin\/content-boxes\/\d+$/) && method === "DELETE") {
          const id = parseInt(path.split("/").pop());

          const existing = await env.DB.prepare(`SELECT id FROM content_boxes WHERE id = ?`).bind(id).first();
          if (!existing) {
            return errorResponse("İçerik kutusu bulunamadı", 404, "NOT_FOUND");
          }

          await env.DB.prepare(`DELETE FROM content_boxes WHERE id = ?`).bind(id).run();
          await logAdminAction(env, "content_box_delete", id, request);
          return jsonResponse({ success: true, message: "İçerik kutusu silindi" });
        }

        // Admin: Content boxes sıralama güncelle
        if (path === "/admin/content-boxes/reorder" && method === "POST") {
          const body = await request.json();
          const { order } = body;

          if (!Array.isArray(order)) {
            return errorResponse("order dizisi gerekli", 400, "INVALID_DATA");
          }

          for (const item of order) {
            if (item.id && item.display_order !== undefined) {
              await env.DB.prepare(`UPDATE content_boxes SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
                .bind(item.display_order, item.id).run();
            }
          }

          await logAdminAction(env, "content_boxes_reorder", null, request);
          return jsonResponse({ success: true, message: "Sıralama güncellendi" });
        }

        // Admin: Varsayılan content boxes yükle (seed)
        if (path === "/admin/content-boxes/seed" && method === "POST") {
          const count = await env.DB.prepare(`SELECT COUNT(*) as cnt FROM content_boxes`).first();
          if (count && count.cnt > 0) {
            return jsonResponse({ success: false, message: "Zaten veri mevcut. Önce temizleyin." });
          }

          await env.DB.prepare(`
            INSERT INTO content_boxes (slot_key, display_order, size, content_type, config, color_theme, is_visible) VALUES
            ('3d-baski', 1, 'large', 'category_post', '{"category":"3d-baski","tag_label":"Katmanlı İmalat","stat_text":"+%12 Hız Artışı"}', 'orange', 1),
            ('teknoloji', 2, 'normal', 'category_post', '{"category":"teknoloji","tag_label":"Gömülü Sistemler","stat_text":"Isı: 42°C (Yükte)","stat_type":"warning"}', 'cyan', 1),
            ('yapay-zeka', 3, 'normal', 'category_post', '{"category":"yapay-zeka","tag_label":"Üretken AI","stat_text":"Prompt: --tile"}', 'purple', 1),
            ('rehber', 4, 'large', 'custom_html', '{"title":"Klipper Kurulum Rehberi","description":"Eski yazıcıya yeni bir beyin takın. Adım adım KIAUH kurulumu.","code_block":"$ git clone klipper\\n$ ./install-octopi.sh","link_url":"/rehberler","tag_label":"Rehberler"}', 'green', 1),
            ('ai-tools', 5, 'normal', 'ai_tools', '{"tools":["Obico","Luma AI","Meshy"],"extra_count":5,"title":"Dijital Asistanlar","description":"3D tasarım ve üretim için AI araçları.","tag_label":"AI Studyo","link_url":"/ai-araclar"}', 'purple', 1),
            ('topluluk', 6, 'normal', 'community', '{"title":"ABS Çatlama Sorunu","description":"Kapalı kasa olmadan ABS basmanın püf noktaları.","comments":24,"likes":156,"tag_label":"Sıcak Tartışma","link_url":"/topluluk"}', 'orange', 1),
            ('anket', 7, 'normal', 'poll', '{"tag_label":"Anket"}', 'yellow', 1),
            ('yazilim', 8, 'wide', 'custom_html', '{"title":"OrcaSlicer: Yeni Ağaç Destekleri","description":"Daha az malzeme harcayan yeni destek algoritması geldi.","version":"v2.1.0","tag_label":"Yazılım","link_url":"/teknoloji"}', 'cyan', 1)
          `).run();

          await logAdminAction(env, "content_boxes_seed", null, request);
          return jsonResponse({ success: true, message: "8 varsayılan içerik kutusu yüklendi" });
        }

        // ================================
        // 👥 ADMIN: KULLANICI YÖNETİMİ
        // ================================

        // Admin: Kullanıcıları Listele
        if (path === "/admin/users" && method === "GET") {
          const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
          const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
          const offset = (page - 1) * limit;
          const search = url.searchParams.get("search") || "";
          const role = url.searchParams.get("role") || "";
          const status = url.searchParams.get("status") || "";

          let whereClause = "WHERE 1=1";
          const params = [];

          if (search) {
            whereClause += " AND (username LIKE ? OR email LIKE ? OR display_name LIKE ?)";
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
          }
          if (role) {
            whereClause += " AND role = ?";
            params.push(role);
          }
          if (status === "active") {
            whereClause += " AND is_active = 1";
          } else if (status === "inactive") {
            whereClause += " AND is_active = 0";
          } else if (status === "unverified") {
            whereClause += " AND email_verified = 0";
          }

          const countResult = await env.DB.prepare(`SELECT COUNT(*) as total FROM users ${whereClause}`).bind(...params).first();
          const total = countResult?.total || 0;

          const users = await env.DB.prepare(`
            SELECT id, username, email, display_name, avatar_url, role, is_active, email_verified,
                   bio, website, location, created_at, last_login
            FROM users ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
          `).bind(...params, limit, offset).all();

          return jsonResponse({
            users: users.results || [],
            pagination: {
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit)
            }
          });
        }

        // Admin: Tek Kullanıcı Detay
        if (path.match(/^\/admin\/users\/\d+$/) && method === "GET") {
          const userId = parseInt(path.split("/").pop());

          const user = await env.DB.prepare(`
            SELECT id, username, email, display_name, avatar_url, role, is_active, email_verified,
                   bio, website, location, twitter, github, created_at, last_login
            FROM users WHERE id = ?
          `).bind(userId).first();

          if (!user) {
            return errorResponse("Kullanıcı bulunamadı", 404, "NOT_FOUND");
          }

          // Kullanıcının aktiviteleri
          const posts = await env.DB.prepare(`
            SELECT COUNT(*) as count FROM posts WHERE author_id = ?
          `).bind(userId).first();

          const comments = await env.DB.prepare(`
            SELECT COUNT(*) as count FROM comments WHERE user_id = ?
          `).bind(userId).first();

          return jsonResponse({
            ...user,
            stats: {
              posts: posts?.count || 0,
              comments: comments?.count || 0
            }
          });
        }

        // Admin: Kullanıcı Güncelle
        if (path.match(/^\/admin\/users\/\d+$/) && method === "PUT") {
          const userId = parseInt(path.split("/").pop());
          const body = await request.json();

          const existing = await env.DB.prepare(`SELECT id FROM users WHERE id = ?`).bind(userId).first();
          if (!existing) {
            return errorResponse("Kullanıcı bulunamadı", 404, "NOT_FOUND");
          }

          const updates = [];
          const params = [];

          if (body.display_name !== undefined) {
            updates.push("display_name = ?");
            params.push(sanitizeString(body.display_name, 100));
          }
          if (body.role !== undefined && ["user", "moderator", "admin"].includes(body.role)) {
            updates.push("role = ?");
            params.push(body.role);
          }
          if (body.is_active !== undefined) {
            updates.push("is_active = ?");
            params.push(body.is_active ? 1 : 0);
          }
          if (body.email_verified !== undefined) {
            updates.push("email_verified = ?");
            params.push(body.email_verified ? 1 : 0);
          }
          if (body.bio !== undefined) {
            updates.push("bio = ?");
            params.push(sanitizeString(body.bio, 500));
          }
          if (body.website !== undefined) {
            updates.push("website = ?");
            params.push(sanitizeString(body.website, 200));
          }
          if (body.location !== undefined) {
            updates.push("location = ?");
            params.push(sanitizeString(body.location, 100));
          }

          if (updates.length === 0) {
            return errorResponse("Güncellenecek alan yok", 400, "NO_UPDATES");
          }

          params.push(userId);
          await env.DB.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();
          await logAdminAction(env, request, "user_update", userId);

          return jsonResponse({ success: true, message: "Kullanıcı güncellendi" });
        }

        // Admin: Kullanıcı Sil
        if (path.match(/^\/admin\/users\/\d+$/) && method === "DELETE") {
          const userId = parseInt(path.split("/").pop());

          const existing = await env.DB.prepare(`SELECT id, role FROM users WHERE id = ?`).bind(userId).first();
          if (!existing) {
            return errorResponse("Kullanıcı bulunamadı", 404, "NOT_FOUND");
          }

          // Admin kullanıcıyı silmeyi engelle
          if (existing.role === "admin") {
            return errorResponse("Admin kullanıcı silinemez", 403, "FORBIDDEN");
          }

          // Kullanıcının verilerini temizle
          await env.DB.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(userId).run();
          await env.DB.prepare(`DELETE FROM users WHERE id = ?`).bind(userId).run();
          await logAdminAction(env, request, "user_delete", userId);

          return jsonResponse({ success: true, message: "Kullanıcı silindi" });
        }

        // Admin: Kullanıcı Şifre Sıfırla
        if (path.match(/^\/admin\/users\/\d+\/reset-password$/) && method === "POST") {
          const userId = parseInt(path.split("/")[3]);
          const body = await request.json();
          const { newPassword } = body;

          if (!newPassword || newPassword.length < 6) {
            return errorResponse("Şifre en az 6 karakter olmalı", 400, "INVALID_PASSWORD");
          }

          const existing = await env.DB.prepare(`SELECT id FROM users WHERE id = ?`).bind(userId).first();
          if (!existing) {
            return errorResponse("Kullanıcı bulunamadı", 404, "NOT_FOUND");
          }

          const passwordHash = await hashPassword(newPassword);
          await env.DB.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`).bind(passwordHash, userId).run();

          // Tüm oturumları sonlandır
          await env.DB.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(userId).run();
          await logAdminAction(env, request, "user_password_reset", userId);

          return jsonResponse({ success: true, message: "Şifre sıfırlandı" });
        }

        // Admin: Dashboard İstatistikleri
        if (path === "/admin/dashboard-stats" && method === "GET") {
          const [totalUsers, activeUsers, totalPosts, publishedPosts, totalComments, todayUsers] = await Promise.all([
            env.DB.prepare(`SELECT COUNT(*) as count FROM users`).first(),
            env.DB.prepare(`SELECT COUNT(*) as count FROM users WHERE is_active = 1`).first(),
            env.DB.prepare(`SELECT COUNT(*) as count FROM posts`).first(),
            env.DB.prepare(`SELECT COUNT(*) as count FROM posts WHERE published = 1`).first(),
            env.DB.prepare(`SELECT COUNT(*) as count FROM comments`).first(),
            env.DB.prepare(`SELECT COUNT(*) as count FROM users WHERE date(created_at) = date('now')`).first()
          ]);

          // Son 7 günlük kayıt trendi
          const userTrend = await env.DB.prepare(`
            SELECT date(created_at) as date, COUNT(*) as count
            FROM users
            WHERE created_at >= datetime('now', '-7 days')
            GROUP BY date(created_at)
            ORDER BY date ASC
          `).all();

          // Son aktiviteler
          const recentActivities = await env.DB.prepare(`
            SELECT 'user' as type, username as title, created_at, 'Yeni kullanıcı kaydı' as description
            FROM users
            ORDER BY created_at DESC
            LIMIT 5
          `).all();

          return jsonResponse({
            stats: {
              totalUsers: totalUsers?.count || 0,
              activeUsers: activeUsers?.count || 0,
              totalPosts: totalPosts?.count || 0,
              publishedPosts: publishedPosts?.count || 0,
              totalComments: totalComments?.count || 0,
              todayUsers: todayUsers?.count || 0
            },
            userTrend: userTrend.results || [],
            recentActivities: recentActivities.results || []
          });
        }
      }

      return errorResponse("Not Found", 404, "NOT_FOUND");

    } catch (error) {
      console.error("Worker error:", error);
      return errorResponse("Internal Server Error", 500, "INTERNAL_ERROR");
    }
  },

  // ================================
  // ⏰ SCHEDULED (CRON)
  // ================================
  async scheduled(event, env, ctx) {
    if (!CONFIG.CRON_ENABLED) {
      console.log("Cron disabled");
      return;
    }

    ctx.waitUntil(runCron(env));
  }
};

// ================================
// ⏰ CRON JOB
// ================================
async function runCron(env) {
  console.log("Cron started:", new Date().toISOString());

  let totalAdded = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  // RSS kaynaklarını DB'den al
  const RSS_SOURCES = await getRssSources(env);

  for (const category of Object.keys(RSS_SOURCES)) {
    for (const rssUrl of RSS_SOURCES[category]) {
      try {
        // Rate limiting için bekleme
        await new Promise(resolve => setTimeout(resolve, CONFIG.CRON_DELAY_BETWEEN_REQUESTS));

        const xml = await fetchRSS(rssUrl);
        if (!xml) {
          totalErrors++;
          continue;
        }

        const items = parseRSS(xml).slice(0, CONFIG.CRON_MAX_ITEMS_PER_SOURCE);

        for (const item of items) {
          if (!item.link) continue;

          // Duplicate check
          const existing = await env.DB.prepare(
            `SELECT id FROM posts WHERE source_url = ?`
          ).bind(item.link).first();

          if (existing) {
            totalSkipped++;
            continue;
          }

          // AI translation
          const prompt = `Aşağıdaki İngilizce haber özetini Türkçe'ye çevir ve genişlet.
Sadece JSON döndür:

{
  "title_tr": "Türkçe başlık",
  "summary_tr": "Türkçe özet (max 200 karakter)",
  "content_tr": "Türkçe detaylı içerik (min 300 karakter)"
}

Başlık: ${item.title}
Özet: ${item.description}`;

          const aiText = await generateWithAI(env, prompt);
          if (!aiText) {
            totalErrors++;
            continue;
          }

          let parsed;
          try {
            const cleanJson = aiText.replace(/```json\n?|\n?```/g, "").trim();
            parsed = JSON.parse(cleanJson);
          } catch {
            totalErrors++;
            continue;
          }

          const slug = createSlug(parsed.title_tr);

          try {
            await env.DB.prepare(`
              INSERT INTO posts (title_tr, summary_tr, content_tr, slug, category, post_type, source_url, image_url, ai_generated, status, published)
              VALUES (?, ?, ?, ?, ?, 'haber', ?, ?, 1, 'draft', 0)
            `).bind(
              parsed.title_tr,
              parsed.summary_tr,
              parsed.content_tr,
              slug,
              category,
              item.link,
              item.image
            ).run();

            totalAdded++;
            console.log("Added:", parsed.title_tr.substring(0, 50));
          } catch (dbError) {
            console.error("DB error:", dbError.message);
            totalErrors++;
          }

          // Her AI isteği arasında bekleme (rate limit)
          await new Promise(resolve => setTimeout(resolve, CONFIG.CRON_DELAY_BETWEEN_REQUESTS));
        }
      } catch (error) {
        console.error(`Source error [${rssUrl}]:`, error.message);
        totalErrors++;
      }
    }
  }

  console.log(`Cron completed: added=${totalAdded}, skipped=${totalSkipped}, errors=${totalErrors}`);

  // Filament fiyatlarını güncelle (günde 1 kez - sabah 09:00'da)
  const now = new Date();
  const hour = now.getUTCHours();
  if (hour === 6) { // UTC 6 = TR 09:00
    await updateFilamentPrices(env);
  }
}

// ================================
// 💰 FİLAMENT FİYAT GÜNCELLEYİCİ
// ================================
async function updateFilamentPrices(env) {
  console.log("Filament price update started:", new Date().toISOString());

  const sources = [
    // Robo90
    { url: "https://www.robo90.com/filament", name: "Robo90" },
    { url: "https://www.robo90.com/filament?pg=2", name: "Robo90" },
    { url: "https://www.robo90.com/filament?pg=3", name: "Robo90" },
    { url: "https://www.robo90.com/recine", name: "Robo90" },
    // Filament Marketim
    { url: "https://www.filamentmarketim.com/pla-filament", name: "FilamentMarketim" },
    { url: "https://www.filamentmarketim.com/petg-filament", name: "FilamentMarketim" },
    { url: "https://www.filamentmarketim.com/abs-filament", name: "FilamentMarketim" },
    { url: "https://www.filamentmarketim.com/asa-filament", name: "FilamentMarketim" },
  ];

  const allProducts = [];

  for (const source of sources) {
    try {
      const response = await fetch(source.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "tr-TR,tr;q=0.9",
        },
      });

      if (!response.ok) {
        console.log(`Fetch failed for ${source.url}: ${response.status}`);
        continue;
      }

      const html = await response.text();
      const products = source.name === "FilamentMarketim"
        ? parseFilamentMarketimHtml(html, source.url)
        : parseFilamentHtml(html, source.name);
      allProducts.push(...products);

      console.log(`Parsed ${products.length} products from ${source.url}`);

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error fetching ${source.url}:`, error.message);
    }
  }

  if (allProducts.length === 0) {
    console.log("No products found, keeping existing prices");
    return;
  }

  // Veritabanını güncelle
  try {
    // Önce mevcut fiyatları temizle
    await env.DB.prepare("DELETE FROM filament_prices").run();

    // Yeni fiyatları ekle
    let added = 0;
    for (const p of allProducts) {
      try {
        await env.DB.prepare(`
          INSERT INTO filament_prices
          (filament_type, brand, product_name, weight_grams, color, price_tl, original_price_tl, discount_percent, rating, store_name, store_url, is_best_deal)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          p.filament_type,
          p.brand,
          p.product_name,
          p.weight_grams || 1000,
          p.color || "Çeşitli",
          p.price_tl,
          p.original_price_tl || 0,
          p.discount_percent || 0,
          p.rating || 0,
          p.store_name,
          p.store_url || "",
          p.is_best_deal || 0
        ).run();
        added++;
      } catch (dbErr) {
        console.error("DB insert error:", dbErr.message);
      }
    }

    // En uygun fiyatları işaretle
    await markBestDeals(env);

    console.log(`Filament prices updated: ${added} products added`);
  } catch (error) {
    console.error("Filament DB update error:", error.message);
  }
}

// FilamentMarketim için özel parser
function parseFilamentMarketimHtml(html, sourceUrl) {
  const products = [];

  // URL'den filament türünü belirle
  let defaultType = "PLA";
  if (sourceUrl.includes("petg")) defaultType = "PETG";
  else if (sourceUrl.includes("abs-filament")) defaultType = "ABS";
  else if (sourceUrl.includes("asa")) defaultType = "ASA";
  else if (sourceUrl.includes("tpu")) defaultType = "TPU";

  // Fiyat pattern: 608,43 TL veya 608.43 TL
  const pricePattern = /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*(?:TL|₺)/gi;

  // Ürün bloklarını bul - col-list-p-v-1 FilamentMarketim'in ürün kartı class'ı
  const productBlocks = html.split(/class="[^"]*col-list-p-v-1[^"]*"|class="[^"]*product-item[^"]*"|class="[^"]*product-card[^"]*"/gi);

  for (const block of productBlocks.slice(1)) {
    try {
      // Fiyat bul
      const priceMatches = block.match(pricePattern);
      if (!priceMatches) continue;

      // İlk fiyatı al (genelde güncel fiyat)
      let priceStr = priceMatches[0].replace(/[^\d.,]/g, "");
      // Türk formatı: 1.234,56 -> 1234.56
      if (priceStr.includes(",")) {
        priceStr = priceStr.replace(/\./g, "").replace(",", ".");
      }
      const price = parseFloat(priceStr);
      if (isNaN(price) || price < 50 || price > 10000) continue;

      // Ürün adı bul
      const titleMatch = block.match(/title="([^"]{10,})"/i) ||
                         block.match(/<h[234][^>]*>([^<]{10,})</i) ||
                         block.match(/alt="([^"]{10,})"/i) ||
                         block.match(/class="[^"]*product-name[^"]*"[^>]*>([^<]+)</i);
      if (!titleMatch) continue;

      const productName = titleMatch[1].trim();
      if (productName.length < 5 || productName.includes("undefined")) continue;

      // Tür belirle (ürün adından veya URL'den)
      let type = detectFilamentType(productName) || defaultType;

      // Marka bul
      const brand = detectBrand(productName);

      // Renk bul
      const color = detectColor(productName);

      // Duplicate kontrolü
      const isDuplicate = products.some(p =>
        p.product_name === productName && p.price_tl === price
      );
      if (isDuplicate) continue;

      products.push({
        filament_type: type,
        brand: brand,
        product_name: productName,
        weight_grams: 1000,
        color: color,
        price_tl: price,
        original_price_tl: 0,
        discount_percent: 0,
        rating: 0,
        store_name: "FilamentMarketim",
        store_url: "https://www.filamentmarketim.com",
        is_best_deal: 0
      });
    } catch (e) {
      // Skip invalid blocks
    }
  }

  return products;
}

function parseFilamentHtml(html, storeName) {
  const products = [];

  // Basit regex ile ürün bilgilerini çıkar
  // Robo90 sayfasındaki tipik yapı: ürün adı, fiyat, marka

  // Fiyat pattern: 466.56 TL veya 466,56 TL
  const pricePattern = /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*(?:TL|₺)/gi;

  // Ürün kartı pattern (basitleştirilmiş)
  const productBlocks = html.split(/class="[^"]*product[^"]*"/gi);

  for (const block of productBlocks.slice(1)) { // İlk parça genellikle header
    try {
      // Fiyat bul
      const priceMatch = block.match(pricePattern);
      if (!priceMatch) continue;

      const priceStr = priceMatch[0].replace(/[^\d.,]/g, "").replace(",", ".");
      const price = parseFloat(priceStr);
      if (isNaN(price) || price < 100 || price > 10000) continue;

      // Ürün adı bul
      const titleMatch = block.match(/title="([^"]+)"/i) ||
                         block.match(/<h[23][^>]*>([^<]+)</i) ||
                         block.match(/alt="([^"]+)"/i);
      if (!titleMatch) continue;

      const productName = titleMatch[1].trim();
      if (productName.length < 5) continue;

      // Filament türünü belirle
      const type = detectFilamentType(productName);
      if (!type) continue;

      // Marka bul
      const brand = detectBrand(productName);

      // Renk bul
      const color = detectColor(productName);

      products.push({
        filament_type: type,
        brand: brand,
        product_name: productName,
        weight_grams: 1000,
        color: color,
        price_tl: price,
        original_price_tl: 0,
        discount_percent: 0,
        rating: 0,
        store_name: storeName,
        store_url: `https://www.robo90.com/filament`,
        is_best_deal: 0
      });
    } catch (e) {
      // Skip invalid blocks
    }
  }

  return products;
}

function detectFilamentType(name) {
  const upperName = name.toUpperCase();
  if (upperName.includes("REÇINE") || upperName.includes("RECINE") || upperName.includes("RESIN")) return "Reçine";
  if (upperName.includes("PLA")) return "PLA";
  if (upperName.includes("PETG")) return "PETG";
  if (upperName.includes("ABS")) return "ABS";
  if (upperName.includes("TPU")) return "TPU";
  if (upperName.includes("ASA")) return "ASA";
  return null;
}

function detectBrand(name) {
  const brands = ["Creality", "Filamix", "Robo90", "Nanelab", "Flashforge", "Polymaker", "Anycubic", "eSUN", "Esun", "Beta", "Sunlu"];
  for (const brand of brands) {
    if (name.toLowerCase().includes(brand.toLowerCase())) return brand;
  }
  return "Diğer";
}

function detectColor(name) {
  const colors = {
    "siyah": "Siyah", "black": "Siyah",
    "beyaz": "Beyaz", "white": "Beyaz",
    "kırmızı": "Kırmızı", "red": "Kırmızı", "kirmizi": "Kırmızı",
    "mavi": "Mavi", "blue": "Mavi",
    "yeşil": "Yeşil", "green": "Yeşil", "yesil": "Yeşil",
    "sarı": "Sarı", "yellow": "Sarı", "sari": "Sarı",
    "turuncu": "Turuncu", "orange": "Turuncu",
    "mor": "Mor", "purple": "Mor",
    "gri": "Gri", "grey": "Gri", "gray": "Gri",
    "şeffaf": "Şeffaf", "transparent": "Şeffaf", "clear": "Şeffaf", "seffaf": "Şeffaf",
    "natural": "Natural", "naturel": "Natural"
  };
  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(colors)) {
    if (lowerName.includes(key)) return value;
  }
  return "Çeşitli";
}

async function markBestDeals(env) {
  const types = ["PLA", "PETG", "ABS", "TPU", "ASA", "Reçine"];

  for (const type of types) {
    try {
      // Her tür için en ucuz ürünü bul ve işaretle
      const cheapest = await env.DB.prepare(`
        SELECT id FROM filament_prices
        WHERE filament_type = ?
        ORDER BY price_tl ASC
        LIMIT 1
      `).bind(type).first();

      if (cheapest) {
        await env.DB.prepare(`
          UPDATE filament_prices SET is_best_deal = 1 WHERE id = ?
        `).bind(cheapest.id).run();
      }
    } catch (e) {
      console.error(`markBestDeals error for ${type}:`, e.message);
    }
  }
}
