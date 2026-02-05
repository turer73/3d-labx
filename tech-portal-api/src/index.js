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
const ALLOWED_ORIGINS = [
  "https://3d-labx.com",
  "https://www.3d-labx.com",
  "https://en.3d-labx.com",
  "https://de.3d-labx.com",
  "https://magaza.3d-labx.com",
  "https://dergi.3d-labx.com",
  "https://tech-portal.pages.dev",
  "http://localhost:4321",
  "http://localhost:3000"
];

function getCorsHeaders(request) {
  const origin = request?.headers?.get("Origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-ADMIN-SECRET",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400"
  };
}

// Geriye uyumluluk için varsayılan headers (request olmadan)
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://3d-labx.com",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-ADMIN-SECRET",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400"
};

function jsonResponse(data, status = 200, cacheSeconds = 0, request = null) {
  const corsHeaders = request ? getCorsHeaders(request) : CORS_HEADERS;
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    ...corsHeaders
  };

  if (cacheSeconds > 0) {
    headers["Cache-Control"] = `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`;
  } else {
    headers["Cache-Control"] = "no-store";
  }

  return new Response(JSON.stringify(data), { status, headers });
}

function errorResponse(message, status = 500, code = "ERROR", request = null) {
  return jsonResponse({ error: message, code }, status, 0, request);
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

// XSS korumalı sanitize (HTML encode)
function sanitizeHtml(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .substring(0, maxLength)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
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

// Güvenli dil doğrulama (SQL injection koruması)
const ALLOWED_LANGUAGES = ["tr", "en", "de"];
function validateLang(lang) {
  return ALLOWED_LANGUAGES.includes(lang) ? lang : "tr";
}

// Güvenli JSON parse (hata yakalama ile)
async function safeParseJSON(request) {
  try {
    const text = await request.text();
    if (!text || text.trim() === '') {
      return { data: null, error: "Empty request body" };
    }
    const data = JSON.parse(text);
    return { data, error: null };
  } catch (e) {
    return { data: null, error: "Invalid JSON: " + e.message };
  }
}

// Dil bazlı alan adları (whitelist)
function getLangFields(lang) {
  const safeLang = validateLang(lang);
  const fieldMap = {
    tr: { titleField: "title_tr", summaryField: "summary_tr", contentField: "content_tr" },
    en: { titleField: "title_en", summaryField: "summary_en", contentField: "content_en" },
    de: { titleField: "title_de", summaryField: "summary_de", contentField: "content_de" }
  };
  return fieldMap[safeLang] || fieldMap.tr;
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

// IP adresini hash'le (GDPR uyumlu, geri dönüşümsüz)
async function hashIP(ip) {
  if (!ip || ip === 'unknown') return 'unknown';
  return await sha256(ip + '_3dlabx_salt');
}

// Token doğrulama (session bazlı)
async function verifyToken(token, env) {
  if (!token) return null;

  const session = await env.DB.prepare(`
    SELECT s.*, u.id, u.email, u.username, u.display_name, u.avatar_url, u.role, u.email_verified
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > datetime('now') AND u.is_active = 1
  `).bind(token).first();

  return session || null;
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
        from: '3D-labX <noreply@3d-labx.com>',
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
          <p style="color: #999; font-size: 12px;">3D-labX - Türkiye'nin 3D Baskı Topluluğu</p>
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
        from: '3D-labX <noreply@3d-labx.com>',
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
            <p style="color: #999; font-size: 12px;">3D-labX - Türkiye'nin 3D Baskı Topluluğu</p>
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
        if (m) {
          let imageUrl = m[1];
          // Düşük kaliteli boyut parametrelerini temizle
          imageUrl = imageUrl
            .replace(/-\d{2,3}x\d{2,3}\./, '.')  // -150x100. gibi
            .replace(/\.max-\d+x\d+/, '.max-1200x1200')  // Google storage boyutları
            .replace(/-small\./, '.')
            .replace(/-thumb\./, '.')
            .replace(/_thumb\./, '.')
            .replace(/\?w=\d+/, '?w=1200')  // Unsplash boyutları
            .replace(/&w=\d+/, '&w=1200');
          return imageUrl;
        }
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
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        })
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error("Gemini API error:", res.status, errBody.substring(0, 500));
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

// 🧠 Cloudflare Workers AI
async function generateWithWorkersAI(env, prompt) {
  if (!env.AI) {
    console.error("Workers AI binding not configured");
    return null;
  }

  try {
    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: "You are an expert translator. Respond with ONLY valid JSON. Keep content field SHORT (max 500 chars). No markdown wrapping." },
        { role: "user", content: prompt }
      ],
      max_tokens: 2048,
      temperature: 0.5
    });

    return response?.response || null;
  } catch (error) {
    console.error("Workers AI error:", error.message);
    return null;
  }
}

// 🧠 AI - Unified (tries Gemini → DeepSeek → Workers AI)
async function generateWithAI(env, prompt) {
  // Try Gemini first
  let result = await generateWithGemini(env, prompt);
  if (result) return result;

  // Fallback to DeepSeek
  console.log("Gemini failed, trying DeepSeek...");
  result = await generateWithDeepSeek(env, prompt);
  if (result) return result;

  // Fallback to Cloudflare Workers AI
  console.log("DeepSeek failed, trying Workers AI...");
  result = await generateWithWorkersAI(env, prompt);
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
    const detailsStr = details ? JSON.stringify(details).substring(0, 1000) : null;

    await env.DB.prepare(`
      INSERT INTO admin_logs (action, post_id, ip, user_agent, details)
      VALUES (?, ?, ?, ?, ?)
    `).bind(action, postId, ip, ua, detailsStr).run();
  } catch (error) {
    console.error("Log error:", error.message);
  }
}

// Hata loglama fonksiyonu
async function logError(env, request, errorType, errorMessage, context = {}) {
  try {
    const ip = request.headers.get("CF-Connecting-IP") ||
               request.headers.get("X-Forwarded-For")?.split(',')[0] ||
               "unknown";
    const ua = (request.headers.get("User-Agent") || "unknown").substring(0, 255);
    const url = new URL(request.url);

    const details = JSON.stringify({
      error: errorMessage,
      path: url.pathname,
      method: request.method,
      ...context
    }).substring(0, 1000);

    await env.DB.prepare(`
      INSERT INTO admin_logs (action, post_id, ip, user_agent, details)
      VALUES (?, ?, ?, ?, ?)
    `).bind(`error_${errorType}`, null, ip, ua, details).run();
  } catch (err) {
    console.error("Error log failed:", err.message);
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
      return new Response(null, { status: 204, headers: getCorsHeaders(request) });
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

      // R2 Image Serve (public access)
      if (path.startsWith("/r2/") && method === "GET") {
        const key = path.replace("/r2/", "");
        if (!key) return errorResponse("Image key required", 400, "INVALID_KEY");

        const object = await env.R2_IMAGES.get(key);
        if (!object) return errorResponse("Image not found", 404, "NOT_FOUND");

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        headers.set("Cache-Control", "public, max-age=31536000");
        headers.set("Access-Control-Allow-Origin", "*");

        return new Response(object.body, { headers });
      }

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

      // Ana Sayfa (kategorilere göre gruplu) - Çok dilli destek
      if (path === "/api/home" && method === "GET") {
        const lang = validateLang(url.searchParams.get("lang") || "tr");
        const { titleField, summaryField } = getLangFields(lang);
        const result = {};

        for (const category of CATEGORIES) {
          const posts = await env.DB.prepare(`
            SELECT id,
              COALESCE(NULLIF(${titleField}, ''), title_tr) as title_tr,
              COALESCE(NULLIF(${summaryField}, ''), summary_tr) as summary_tr,
              slug, category, post_type, image_url, is_featured, created_at
            FROM posts
            WHERE published = 1 AND category = ?
            ORDER BY created_at DESC
            LIMIT 6
          `).bind(category).all();

          result[category] = posts.results || [];
        }

        return jsonResponse(result, 200, CONFIG.CACHE_TTL);
      }

      // Kategori Listesi (sayfalama ile) - Çok dilli destek
      if (path === "/api/posts" && method === "GET") {
        const category = url.searchParams.get("category");
        const postType = url.searchParams.get("post_type");
        const lang = validateLang(url.searchParams.get("lang") || "tr");
        const { page, limit, offset } = validatePagination(
          url.searchParams.get("page"),
          url.searchParams.get("limit")
        );

        // Dile göre alan seçimi (güvenli whitelist)
        const { titleField, summaryField } = getLangFields(lang);

        let query = `
          SELECT id, ${titleField} as title, ${summaryField} as summary, slug, category, post_type, image_url, is_featured, created_at, language
          FROM posts
          WHERE published = 1 AND (language = ? OR language IS NULL OR language = 'tr')
        `;
        const bindings = [lang];

        if (category && validateCategory(category)) {
          query += ` AND category = ?`;
          bindings.push(category);
        }

        if (postType && validatePostType(postType)) {
          query += ` AND post_type = ?`;
          bindings.push(postType);
        }

        // Total count
        const countQuery = query.replace(/SELECT[\s\S]*?FROM/i, "SELECT COUNT(*) as total FROM");
        const countResult = await env.DB.prepare(countQuery).bind(...bindings).first();
        const total = countResult?.total || 0;

        // Get posts - sadece tarih sırasına göre (en yeni üstte)
        query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
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
          },
          language: lang
        }, 200, CONFIG.CACHE_TTL);
      }

      // Tek Post - Çok dilli destek
      if (path.startsWith("/api/post/") && method === "GET") {
        const slug = sanitizeString(path.replace("/api/post/", ""), 150);
        const lang = validateLang(url.searchParams.get("lang") || "tr");
        if (!slug) return errorResponse("Slug required", 400, "INVALID_SLUG");

        // Dile göre alan seçimi (güvenli whitelist)
        const { titleField, summaryField, contentField } = getLangFields(lang);

        const post = await env.DB.prepare(`
          SELECT id, ${titleField} as title, ${summaryField} as summary, ${contentField} as content,
                 slug, category, post_type, image_url, source_url, created_at, language, original_id
          FROM posts
          WHERE slug = ? AND published = 1
        `).bind(slug).first();

        if (!post) return errorResponse("Post not found", 404, "NOT_FOUND");

        // Diğer dillerdeki versiyonları bul
        const translations = await env.DB.prepare(`
          SELECT language, slug FROM posts
          WHERE (original_id = ? OR id = ? OR original_id = (SELECT original_id FROM posts WHERE id = ?))
          AND published = 1 AND id != ?
        `).bind(post.id, post.original_id || post.id, post.id, post.id).all();

        return jsonResponse({
          ...post,
          translations: translations.results || []
        }, 200, CONFIG.CACHE_TTL);
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
        return jsonResponse({ success: true }, 200, 0, request);
      }

      // Mevcut kullanıcı bilgisi
      if (path === "/api/auth/me" && method === "GET") {
        const session = await getSessionUser(env, request);
        if (!session) {
          return errorResponse("Oturum geçersiz", 401, "UNAUTHORIZED");
        }

        // Kullanıcının tam bilgilerini ve istatistiklerini al
        const userDetails = await env.DB.prepare(`
          SELECT u.id, u.email, u.username, u.display_name, u.avatar_url, u.bio, u.role, u.created_at,
                 us.reputation_points, us.thread_count, us.reply_count, us.like_received_count
          FROM users u
          LEFT JOIN user_stats us ON u.id = us.user_id
          WHERE u.id = ?
        `).bind(session.user_id).first();

        // Maker profili var mı kontrol et
        const makerProfile = await env.DB.prepare(`
          SELECT * FROM maker_profiles WHERE user_id = ?
        `).bind(session.user_id).first();

        return jsonResponse({
          id: userDetails.id,
          email: userDetails.email,
          username: userDetails.username,
          display_name: userDetails.display_name,
          avatar_url: userDetails.avatar_url,
          bio: userDetails.bio,
          role: userDetails.role,
          created_at: userDetails.created_at,
          reputation_points: userDetails.reputation_points || 0,
          stats: {
            posts: userDetails.thread_count || 0,
            comments: userDetails.reply_count || 0,
            likes: userDetails.like_received_count || 0,
            badges: 0
          },
          maker_profile: makerProfile || null
        }, 200, 0, request);
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
              from: '3D-labX <noreply@3d-labx.com>',
              to: 'turgut.urer@gmail.com',
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
      // 📬 NEWSLETTER
      // ================================

      if (path === "/api/newsletter/subscribe" && method === "POST") {
        const body = await request.json();
        const email = sanitizeString(body.email, 200);

        if (!email) {
          return errorResponse("E-posta adresi gerekli", 400, "MISSING_EMAIL");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return errorResponse("Geçersiz e-posta adresi", 400, "INVALID_EMAIL");
        }

        try {
          // Check if already subscribed
          const existing = await env.DB.prepare(
            `SELECT id, is_active FROM newsletter_subscribers WHERE email = ?`
          ).bind(email).first();

          if (existing) {
            if (existing.is_active) {
              return errorResponse("Bu e-posta zaten abone", 400, "ALREADY_SUBSCRIBED");
            } else {
              // Re-activate subscription
              await env.DB.prepare(
                `UPDATE newsletter_subscribers SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
              ).bind(existing.id).run();
              return jsonResponse({ success: true, message: "Aboneliğiniz yeniden aktifleştirildi." });
            }
          }

          // Insert new subscriber
          const ipHash = await hashIP(clientIP);
          await env.DB.prepare(
            `INSERT INTO newsletter_subscribers (email, ip_hash) VALUES (?, ?)`
          ).bind(email, ipHash).run();

          return jsonResponse({ success: true, message: "Bültene başarıyla abone oldunuz." }, 201);
        } catch (error) {
          console.error('Newsletter subscribe error:', error);
          return errorResponse("Bir hata oluştu", 500, "SUBSCRIBE_ERROR");
        }
      }

      if (path === "/api/newsletter/unsubscribe" && method === "POST") {
        const body = await request.json();
        const email = sanitizeString(body.email, 200);

        if (!email) {
          return errorResponse("E-posta adresi gerekli", 400, "MISSING_EMAIL");
        }

        try {
          await env.DB.prepare(
            `UPDATE newsletter_subscribers SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE email = ?`
          ).bind(email).run();

          return jsonResponse({ success: true, message: "Abonelikten çıkıldı." });
        } catch (error) {
          console.error('Newsletter unsubscribe error:', error);
          return errorResponse("Bir hata oluştu", 500, "UNSUBSCRIBE_ERROR");
        }
      }

      // ================================
      // 📊 POLL ENDPOINTS
      // ================================

      // Aktif anketi getir
      // Yazıcı markası anketi (ID: 5)
      if (path === "/api/poll/active" && method === "GET") {
        const poll = await env.DB.prepare(`
          SELECT id, question, ends_at, created_at
          FROM polls
          WHERE id = 5
        `).first();

        if (!poll) {
          return jsonResponse({ poll: null }, 200, 0, request);
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
        }, 200, 60, request);
      }

      // Slicer anketi (ID: 7)
      if (path === "/api/poll/slicer" && method === "GET") {
        const poll = await env.DB.prepare(`
          SELECT id, question, ends_at, created_at
          FROM polls
          WHERE id = 7
        `).first();

        if (!poll) {
          return jsonResponse({ poll: null }, 200, 0, request);
        }

        const options = await env.DB.prepare(`
          SELECT id, option_text, vote_count
          FROM poll_options
          WHERE poll_id = 7
          ORDER BY display_order ASC
        `).all();

        const totalVotes = options.results.reduce((sum, opt) => sum + opt.vote_count, 0);

        // Kullanıcının oy verip vermediğini kontrol et
        const ipHash = await sha256(clientIP + "7");
        const existingVote = await env.DB.prepare(`
          SELECT option_id FROM poll_votes WHERE poll_id = 7 AND ip_hash = ?
        `).bind(ipHash).first();

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
        }, 200, 60, request);
      }

      // ========================================
      // LOGGING ENDPOINTS
      // ========================================

      // Log kaydet (Frontend'den)
      if (path === "/api/logs" && method === "POST") {
        try {
          const { type, level, message, details, pageUrl } = await request.json();

          if (!type || !message) {
            return errorResponse("type ve message gerekli", 400, "MISSING_DATA");
          }

          const ipHash = await sha256(clientIP);
          const userAgent = request.headers.get('User-Agent') || '';

          // Session'dan user ID al (varsa)
          let userId = null;
          const authHeader = request.headers.get('Authorization');
          if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const session = await env.DB.prepare(`
              SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime('now')
            `).bind(token).first();
            if (session) userId = session.user_id;
          }

          await env.DB.prepare(`
            INSERT INTO site_logs (log_type, log_level, message, details, page_url, user_id, ip_hash, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            sanitizeString(type, 50),
            sanitizeString(level || 'info', 20),
            sanitizeString(message, 500),
            details ? sanitizeString(JSON.stringify(details), 2000) : null,
            sanitizeString(pageUrl || '', 500),
            userId,
            ipHash,
            sanitizeString(userAgent, 500)
          ).run();

          return jsonResponse({ success: true });
        } catch (err) {
          console.error('Log save error:', err);
          return jsonResponse({ success: false });
        }
      }

      // Admin: Logları getir
      if (path === "/api/admin/logs" && method === "GET") {
        const adminSecret = request.headers.get("X-ADMIN-SECRET");
        if (!adminSecret || adminSecret !== env.ADMIN_SECRET) {
          return errorResponse("Yetkisiz", 401, "UNAUTHORIZED");
        }

        const url = new URL(request.url);
        const logType = url.searchParams.get('type');
        const logLevel = url.searchParams.get('level');
        const { page, limit, offset } = validatePagination(
          url.searchParams.get('page'),
          url.searchParams.get('limit') || 50
        );

        let query = `SELECT * FROM site_logs WHERE 1=1`;
        const params = [];

        if (logType) {
          query += ` AND log_type = ?`;
          params.push(logType);
        }
        if (logLevel) {
          query += ` AND log_level = ?`;
          params.push(logLevel);
        }

        query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const logs = await env.DB.prepare(query).bind(...params).all();

        // Toplam sayı
        let countQuery = `SELECT COUNT(*) as total FROM site_logs WHERE 1=1`;
        const countParams = [];
        if (logType) {
          countQuery += ` AND log_type = ?`;
          countParams.push(logType);
        }
        if (logLevel) {
          countQuery += ` AND log_level = ?`;
          countParams.push(logLevel);
        }
        const countResult = await env.DB.prepare(countQuery).bind(...countParams).first();

        return jsonResponse({
          logs: logs.results,
          pagination: {
            page,
            limit,
            total: countResult?.total || 0,
            totalPages: Math.ceil((countResult?.total || 0) / limit)
          }
        });
      }

      // Admin: Log istatistikleri
      if (path === "/api/admin/logs/stats" && method === "GET") {
        const adminSecret = request.headers.get("X-ADMIN-SECRET");
        if (!adminSecret || adminSecret !== env.ADMIN_SECRET) {
          return errorResponse("Yetkisiz", 401, "UNAUTHORIZED");
        }

        const stats = await env.DB.prepare(`
          SELECT
            log_type,
            log_level,
            COUNT(*) as count,
            DATE(created_at) as date
          FROM site_logs
          WHERE created_at > datetime('now', '-7 days')
          GROUP BY log_type, log_level, DATE(created_at)
          ORDER BY date DESC, count DESC
        `).all();

        const totalToday = await env.DB.prepare(`
          SELECT COUNT(*) as total FROM site_logs WHERE DATE(created_at) = DATE('now')
        `).first();

        const errorCount = await env.DB.prepare(`
          SELECT COUNT(*) as total FROM site_logs WHERE log_level = 'error' AND created_at > datetime('now', '-24 hours')
        `).first();

        return jsonResponse({
          stats: stats.results,
          totalToday: totalToday?.total || 0,
          errorsLast24h: errorCount?.total || 0
        });
      }

      // Admin: Logları temizle (eski kayıtlar)
      if (path === "/api/admin/logs/cleanup" && method === "DELETE") {
        const adminSecret = request.headers.get("X-ADMIN-SECRET");
        if (!adminSecret || adminSecret !== env.ADMIN_SECRET) {
          return errorResponse("Yetkisiz", 401, "UNAUTHORIZED");
        }

        const url = new URL(request.url);
        const days = parseInt(url.searchParams.get('days') || '30');

        const result = await env.DB.prepare(`
          DELETE FROM site_logs WHERE created_at < datetime('now', '-' || ? || ' days')
        `).bind(days).run();

        return jsonResponse({
          success: true,
          deleted: result.meta?.changes || 0
        });
      }

      // Oy kullan
      if (path === "/api/poll/vote" && method === "POST") {
        const { pollId, optionId } = await request.json();

        if (!pollId || !optionId) {
          return errorResponse("Poll ID ve Option ID gerekli", 400, "MISSING_DATA", request);
        }

        // Anketin aktif olup olmadığını kontrol et
        const poll = await env.DB.prepare(`
          SELECT id FROM polls WHERE id = ? AND is_active = 1
        `).bind(pollId).first();

        if (!poll) {
          return errorResponse("Anket bulunamadı veya aktif değil", 404, "POLL_NOT_FOUND", request);
        }

        // Option'ın geçerli olup olmadığını kontrol et
        const option = await env.DB.prepare(`
          SELECT id FROM poll_options WHERE id = ? AND poll_id = ?
        `).bind(optionId, pollId).first();

        if (!option) {
          return errorResponse("Geçersiz seçenek", 400, "INVALID_OPTION", request);
        }

        // IP hash ile daha önce oy verilmiş mi kontrol et
        const ipHash = await sha256(clientIP + pollId);
        const existingVote = await env.DB.prepare(`
          SELECT id FROM poll_votes WHERE poll_id = ? AND ip_hash = ?
        `).bind(pollId, ipHash).first();

        if (existingVote) {
          return errorResponse("Bu ankete zaten oy verdiniz", 400, "ALREADY_VOTED", request);
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
        }, 200, 0, request);
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
          const page = parseInt(url.searchParams.get("page") || "1");
          const limit = parseInt(url.searchParams.get("limit") || "50");
          const search = sanitizeString(url.searchParams.get("search"), 100);
          const category = sanitizeString(url.searchParams.get("category"), 50);
          const offset = (page - 1) * limit;

          let query = `
            SELECT id, title_tr, summary_tr, slug, category, post_type, is_featured, published, status, ai_generated, created_at
            FROM posts
          `;
          let countQuery = `SELECT COUNT(*) as total FROM posts`;
          const conditions = [];
          const params = [];

          if (search) {
            conditions.push(`(title_tr LIKE ? OR summary_tr LIKE ?)`);
            params.push(`%${search}%`, `%${search}%`);
          }
          if (category) {
            conditions.push(`category = ?`);
            params.push(category);
          }

          if (conditions.length > 0) {
            const whereClause = ` WHERE ${conditions.join(' AND ')}`;
            query += whereClause;
            countQuery += whereClause;
          }

          query += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
          params.push(limit, offset);

          const [postsResult, countResult] = await Promise.all([
            env.DB.prepare(query).bind(...params).all(),
            env.DB.prepare(countQuery).bind(...params.slice(0, -2)).all()
          ]);

          const total = countResult.results?.[0]?.total || 0;
          const totalPages = Math.ceil(total / limit);

          return jsonResponse({
            posts: postsResult.results || [],
            pagination: { page, limit, total, totalPages }
          });
        }

        // Admin: Tek Post Detay
        if (path.startsWith("/admin/post/") && method === "GET") {
          const pathId = path.replace("/admin/post/", "");
          const id = validateId(pathId);
          if (!id) return errorResponse("Invalid ID", 400, "INVALID_ID");

          const post = await env.DB.prepare(`
            SELECT id, title_tr, summary_tr, content_tr, title_en, summary_en, content_en,
                   title_de, summary_de, content_de,
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
          // Almanca alanlar
          if (body.title_de !== undefined) {
            updates.push("title_de = ?");
            bindings.push(body.title_de ? sanitizeString(body.title_de, 300) : null);
          }
          if (body.summary_de !== undefined) {
            updates.push("summary_de = ?");
            bindings.push(body.summary_de ? sanitizeString(body.summary_de, 500) : null);
          }
          if (body.content_de !== undefined) {
            updates.push("content_de = ?");
            bindings.push(body.content_de ? sanitizeString(body.content_de, 50000) : null);
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

          // Auto-translate when publishing (if translations missing)
          if (body.published === true || body.published === 1) {
            const post = await env.DB.prepare(`
              SELECT id, title_tr, summary_tr, content_tr, title_en, title_de FROM posts WHERE id = ?
            `).bind(id).first();

            if (post && post.title_tr) {
              const needsEnglish = !post.title_en;
              const needsGerman = !post.title_de;

              // Trigger async translation (non-blocking)
              if (needsEnglish || needsGerman) {
                const translatePost = async (targetLang) => {
                  try {
                    const langNames = { en: "English", de: "German" };
                    const prompt = `Translate the following Turkish text to ${langNames[targetLang]}. Return ONLY valid JSON, nothing else.

{
  "title": "Translated title (max 100 chars)",
  "summary": "Translated summary (max 200 chars)",
  "content": "Translated content (keep paragraphs, maintain HTML if any)"
}

Turkish text to translate:
Title: ${post.title_tr}
Summary: ${post.summary_tr || ''}
Content: ${(post.content_tr || '').substring(0, 3000)}`;

                    const aiText = await generateWithAI(env, prompt);
                    if (aiText) {
                      const cleanJson = aiText.replace(/```json\n?|\n?```/g, "").trim();
                      const parsed = JSON.parse(cleanJson);
                      await env.DB.prepare(`
                        UPDATE posts SET title_${targetLang} = ?, summary_${targetLang} = ?, content_${targetLang} = ?
                        WHERE id = ?
                      `).bind(parsed.title, parsed.summary, parsed.content, post.id).run();
                      console.log(`Auto-translated post ${post.id} to ${targetLang}`);
                    }
                  } catch (err) {
                    console.error(`Auto-translate error (${targetLang}):`, err.message);
                  }
                };

                // Run translations in background (don't await)
                if (needsEnglish) translatePost("en");
                if (needsGerman) translatePost("de");
              }
            }
          }

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

        // Admin: Tüm içerikleri çevir (batch)
        if (path === "/admin/translate-all" && method === "POST") {
          const body = await request.json();
          const targetLang = body.lang || "en";
          const limit = Math.min(parseInt(body.limit) || 10, 50);

          if (!["en", "de"].includes(targetLang)) {
            return errorResponse("Geçersiz dil. en veya de olmalı", 400, "INVALID_LANG");
          }

          const targetTitleField = `title_${targetLang}`;
          const targetSummaryField = `summary_${targetLang}`;
          const targetContentField = `content_${targetLang}`;

          // Çevrilmemiş içerikleri bul
          const untranslated = await env.DB.prepare(`
            SELECT id, title_tr, summary_tr, content_tr
            FROM posts
            WHERE published = 1 AND (${targetTitleField} IS NULL OR ${targetTitleField} = '')
            LIMIT ?
          `).bind(limit).all();

          if (!untranslated.results || untranslated.results.length === 0) {
            return jsonResponse({ success: true, translated: 0, message: "Çevrilecek içerik yok" });
          }

          const langNames = { en: "English", de: "German" };
          let translatedCount = 0;
          const errors = [];

          for (const post of untranslated.results) {
            try {
              const prompt = `Translate to ${langNames[targetLang]}. Return ONLY a JSON object with these 3 fields:
{"title":"translated title","summary":"translated summary max 200 chars","content":"translated content max 500 chars, plain text only"}

Title: ${post.title_tr}
Summary: ${(post.summary_tr || '').substring(0, 300)}
Content: ${(post.content_tr || '').substring(0, 1500)}`;

              const aiText = await generateWithAI(env, prompt);
              if (!aiText) {
                errors.push({ id: post.id, error: "AI failed" });
                continue;
              }

              let parsed;
              try {
                let cleanJson = aiText.replace(/```json\n?|\n?```/g, "").trim();
                const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
                if (jsonMatch) cleanJson = jsonMatch[0];
                if (!cleanJson.endsWith('}')) {
                  cleanJson = cleanJson.replace(/,?\s*"[^"]*$/, '') + '}';
                }
                parsed = JSON.parse(cleanJson);
              } catch {
                console.error("Parse error for post", post.id, "AI raw:", aiText.substring(0, 300));
                errors.push({ id: post.id, error: "Parse failed" });
                continue;
              }

              await env.DB.prepare(`
                UPDATE posts SET ${targetTitleField} = ?, ${targetSummaryField} = ?, ${targetContentField} = ?
                WHERE id = ?
              `).bind(parsed.title, parsed.summary, parsed.content, post.id).run();

              translatedCount++;
            } catch (err) {
              errors.push({ id: post.id, error: err.message });
            }
          }

          return jsonResponse({
            success: true,
            translated: translatedCount,
            total: untranslated.results.length,
            errors: errors.length > 0 ? errors : undefined
          });
        }

        // Admin: Tek içerik çevir
        if (path === "/admin/translate" && method === "POST") {
          const body = await request.json();
          const postId = parseInt(body.id);
          const targetLang = body.lang || "en";

          if (!postId) return errorResponse("id gerekli", 400, "MISSING_ID");
          if (!["en", "de"].includes(targetLang)) {
            return errorResponse("Geçersiz dil. en veya de olmalı", 400, "INVALID_LANG");
          }

          const post = await env.DB.prepare(`
            SELECT id, title_tr, summary_tr, content_tr FROM posts WHERE id = ?
          `).bind(postId).first();

          if (!post) return errorResponse("Post bulunamadı", 404, "NOT_FOUND");

          const langNames = { en: "English", de: "German" };
          const prompt = `Translate to ${langNames[targetLang]}. Return ONLY a JSON object with these 3 fields:
{"title":"translated title","summary":"translated summary max 200 chars","content":"translated content max 500 chars, plain text only"}

Title: ${post.title_tr}
Summary: ${(post.summary_tr || '').substring(0, 300)}
Content: ${(post.content_tr || '').substring(0, 1500)}`;

          const aiText = await generateWithAI(env, prompt);
          if (!aiText) return errorResponse("AI çeviri başarısız", 500, "AI_ERROR");

          let parsed;
          try {
            let cleanJson = aiText.replace(/```json\n?|\n?```/g, "").trim();
            const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
            if (jsonMatch) cleanJson = jsonMatch[0];
            // Kesik JSON fix: kapanmayan string ve brace'leri kapat
            if (!cleanJson.endsWith('}')) {
              cleanJson = cleanJson.replace(/,?\s*"[^"]*$/, '') + '}';
            }
            parsed = JSON.parse(cleanJson);
          } catch (parseErr) {
            console.error("Parse error. AI raw:", aiText.substring(0, 500));
            return errorResponse("AI yanıtı parse edilemedi", 500, "PARSE_ERROR");
          }

          const targetTitleField = `title_${targetLang}`;
          const targetSummaryField = `summary_${targetLang}`;
          const targetContentField = `content_${targetLang}`;

          await env.DB.prepare(`
            UPDATE posts SET ${targetTitleField} = ?, ${targetSummaryField} = ?, ${targetContentField} = ?
            WHERE id = ?
          `).bind(parsed.title, parsed.summary, parsed.content, postId).run();

          return jsonResponse({
            success: true,
            id: postId,
            lang: targetLang,
            title: parsed.title
          });
        }

        // Admin: Loglar
        if (path === "/admin/logs" && method === "GET") {
          const actionFilter = sanitizeString(url.searchParams.get("action"), 50);
          const errorsOnly = url.searchParams.get("errors") === "true";
          const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 500);

          let query = `SELECT * FROM admin_logs`;
          let conditions = [];
          let params = [];

          if (errorsOnly) {
            conditions.push(`action LIKE ?`);
            params.push('error_%');
          } else if (actionFilter) {
            conditions.push(`action = ?`);
            params.push(actionFilter);
          }

          if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(' AND ');
          }

          query += ` ORDER BY created_at DESC LIMIT ?`;
          params.push(limit);

          const logs = await env.DB.prepare(query).bind(...params).all();
          return jsonResponse({ logs: logs.results || [] });
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
          const { slot_key, display_order, size, content_type, config, color_theme, is_visible, target_page } = body;

          if (!slot_key || !content_type) {
            return errorResponse("slot_key ve content_type gerekli", 400, "MISSING_FIELDS");
          }

          const configStr = typeof config === 'object' ? JSON.stringify(config) : (config || '{}');

          const result = await env.DB.prepare(`
            INSERT INTO content_boxes (slot_key, display_order, size, content_type, config, color_theme, is_visible, target_page)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            sanitizeString(slot_key),
            display_order || 0,
            size || 'normal',
            sanitizeString(content_type),
            configStr,
            color_theme || 'orange',
            is_visible !== undefined ? (is_visible ? 1 : 0) : 1,
            target_page || 'anasayfa'
          ).run();

          await logAdminAction(env, request, "content_box_create", null);
          return jsonResponse({ success: true, id: result.meta.last_row_id, message: "İçerik kutusu oluşturuldu" }, 201);
        }

        // Admin: Content box güncelle
        if (path.match(/^\/admin\/content-boxes\/\d+$/) && method === "PUT") {
          const id = parseInt(path.split("/").pop());
          const body = await request.json();
          const { slot_key, display_order, size, content_type, config, color_theme, is_visible, target_page } = body;

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
          if (target_page !== undefined) { updates.push("target_page = ?"); params.push(target_page); }

          if (updates.length === 0) {
            return errorResponse("Güncellenecek alan yok", 400, "NO_UPDATES");
          }

          updates.push("updated_at = CURRENT_TIMESTAMP");
          params.push(id);

          await env.DB.prepare(`UPDATE content_boxes SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();
          await logAdminAction(env, request, "content_box_update", id);
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
          await logAdminAction(env, request, "content_box_delete", id);
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

          await logAdminAction(env, request, "content_boxes_reorder", null);
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

          await logAdminAction(env, request, "content_boxes_seed", null);
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
                   bio, website, location, created_at, last_login
            FROM users WHERE id = ?
          `).bind(userId).first();

          if (!user) {
            return errorResponse("Kullanıcı bulunamadı", 404, "NOT_FOUND");
          }

          // Kullanıcının aktiviteleri
          const threads = await env.DB.prepare(`
            SELECT COUNT(*) as count FROM forum_threads WHERE user_id = ?
          `).bind(userId).first();

          const comments = await env.DB.prepare(`
            SELECT COUNT(*) as count FROM comments WHERE user_id = ?
          `).bind(userId).first();

          return jsonResponse({
            user,
            stats: {
              threads: threads?.count || 0,
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

          if (!newPassword || newPassword.length < 8) {
            return errorResponse("Şifre en az 8 karakter olmalı", 400, "INVALID_PASSWORD");
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

        // Admin: Forum Thread Oluştur (kullanıcı adına)
        if (path === "/admin/forum/threads" && method === "POST") {
          const body = await request.json();
          const title = sanitizeString(body.title, 200);
          const content = sanitizeString(body.content, 10000);
          const categoryId = parseInt(body.category_id, 10);
          const userId = parseInt(body.user_id, 10);

          if (!title || title.length < 5) return errorResponse("Başlık en az 5 karakter olmalıdır", 400, "INVALID_TITLE");
          if (!content || content.length < 20) return errorResponse("İçerik en az 20 karakter olmalıdır", 400, "INVALID_CONTENT");

          // Kullanıcı kontrolü
          const user = await env.DB.prepare(`SELECT id, username FROM users WHERE id = ? AND is_active = 1`).bind(userId).first();
          if (!user) return errorResponse("Geçersiz kullanıcı", 400, "INVALID_USER");

          // Kategori kontrolü
          const category = await env.DB.prepare(`SELECT * FROM forum_categories WHERE id = ? AND is_active = 1`).bind(categoryId).first();
          if (!category) return errorResponse("Geçersiz kategori", 400, "INVALID_CATEGORY");

          // Slug oluştur
          const baseSlug = title.toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
            .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          const slug = `${baseSlug}-${Date.now().toString(36)}`;

          const result = await env.DB.prepare(`
            INSERT INTO forum_threads (category_id, user_id, title, slug, content)
            VALUES (?, ?, ?, ?, ?)
          `).bind(categoryId, userId, title, slug, content).run();

          // Kategori thread_count güncelle
          await env.DB.prepare(`
            UPDATE forum_categories SET thread_count = thread_count + 1 WHERE id = ?
          `).bind(categoryId).run();

          // User stats güncelle
          await env.DB.prepare(`
            INSERT INTO user_stats (user_id, thread_count) VALUES (?, 1)
            ON CONFLICT(user_id) DO UPDATE SET thread_count = thread_count + 1, updated_at = CURRENT_TIMESTAMP
          `).bind(userId).run();

          return jsonResponse({ success: true, thread_id: result.meta?.last_row_id, slug, username: user.username }, 201);
        }

        // Admin: Forum Thread Sil
        if (path.match(/^\/admin\/forum\/threads\/(\d+)$/) && method === "DELETE") {
          const threadId = parseInt(path.split("/").pop(), 10);

          const thread = await env.DB.prepare(`SELECT * FROM forum_threads WHERE id = ?`).bind(threadId).first();
          if (!thread) return errorResponse("Konu bulunamadı", 404, "NOT_FOUND");

          // Thread'i sil
          await env.DB.prepare(`DELETE FROM forum_threads WHERE id = ?`).bind(threadId).run();

          // Kategori thread_count güncelle
          await env.DB.prepare(`
            UPDATE forum_categories SET thread_count = thread_count - 1 WHERE id = ? AND thread_count > 0
          `).bind(thread.category_id).run();

          return jsonResponse({ success: true, message: "Konu silindi" });
        }

        // Admin: Forum Thread Vitrine Al/Çıkar
        if (path.match(/^\/admin\/forum\/threads\/(\d+)\/feature$/) && method === "POST") {
          const threadId = parseInt(path.split("/")[4], 10);
          const body = await request.json();
          const featured = body.featured ? 1 : 0;

          const thread = await env.DB.prepare(`SELECT * FROM forum_threads WHERE id = ?`).bind(threadId).first();
          if (!thread) return errorResponse("Konu bulunamadı", 404, "NOT_FOUND");

          await env.DB.prepare(`
            UPDATE forum_threads SET is_featured = ?, featured_at = CASE WHEN ? = 1 THEN datetime('now') ELSE NULL END WHERE id = ?
          `).bind(featured, featured, threadId).run();

          return jsonResponse({
            success: true,
            message: featured ? "Konu vitrine alındı" : "Konu vitrinden çıkarıldı",
            is_featured: featured
          });
        }

        // Admin: Vitrine alınan konuları listele
        if (path === "/admin/forum/featured" && method === "GET") {
          const threads = await env.DB.prepare(`
            SELECT t.id, t.title, t.slug, t.is_featured, t.featured_at, t.like_count, t.view_count, t.created_at,
                   u.username, c.name as category_name
            FROM forum_threads t
            JOIN users u ON t.user_id = u.id
            JOIN forum_categories c ON t.category_id = c.id
            WHERE t.is_deleted = 0
            ORDER BY t.is_featured DESC, t.featured_at DESC, t.like_count DESC
            LIMIT 50
          `).all();

          return jsonResponse({ threads: threads.results || [] });
        }

        // Admin SQL endpoint - sadece admin erişimli
        if (path === "/admin/sql" && method === "POST") {
          const body = await request.json();
          const query = body.query;
          if (!query) return errorResponse("SQL query gerekli", 400, "MISSING_QUERY");

          try {
            const isSelect = query.trim().toUpperCase().startsWith("SELECT");
            if (isSelect) {
              const result = await env.DB.prepare(query).all();
              return jsonResponse({ results: result.results || [], meta: result.meta });
            } else {
              const result = await env.DB.prepare(query).run();
              return jsonResponse({ success: true, meta: result.meta });
            }
          } catch (sqlErr) {
            return errorResponse("SQL error: " + sqlErr.message, 500, "SQL_ERROR");
          }
        }
      }

      // ================================
      // 💬 YORUM SİSTEMİ API
      // ================================

      // Post yorumlarını getir (N+1 query problemi çözüldü - tek sorguda tüm cevaplar)
      if (path.match(/^\/api\/posts\/(\d+)\/comments$/) && method === "GET") {
        const postId = parseInt(path.split("/")[3], 10);
        const { page, limit, offset } = validatePagination(
          url.searchParams.get("page"),
          url.searchParams.get("limit") || "20"
        );

        // Toplam yorum sayısı
        const countResult = await env.DB.prepare(`
          SELECT COUNT(*) as total FROM comments
          WHERE post_id = ? AND parent_id IS NULL AND is_deleted = 0
        `).bind(postId).first();
        const total = countResult?.total || 0;

        // Ana yorumları getir
        const comments = await env.DB.prepare(`
          SELECT c.*, u.username, u.display_name, u.avatar_url,
            (SELECT COUNT(*) FROM comments r WHERE r.parent_id = c.id AND r.is_deleted = 0) as reply_count
          FROM comments c
          JOIN users u ON c.user_id = u.id
          WHERE c.post_id = ? AND c.parent_id IS NULL AND c.is_deleted = 0
          ORDER BY c.created_at DESC
          LIMIT ? OFFSET ?
        `).bind(postId, limit, offset).all();

        const commentIds = (comments.results || []).map(c => c.id);

        // Tüm cevapları tek sorguda getir (N+1 problemi çözümü)
        let repliesMap = {};
        if (commentIds.length > 0) {
          const placeholders = commentIds.map(() => '?').join(',');
          const allReplies = await env.DB.prepare(`
            SELECT c.*, u.username, u.display_name, u.avatar_url,
              ROW_NUMBER() OVER (PARTITION BY c.parent_id ORDER BY c.created_at ASC) as rn
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.parent_id IN (${placeholders}) AND c.is_deleted = 0
          `).bind(...commentIds).all();

          // Cevapları parent_id'ye göre grupla (her parent için max 3)
          for (const reply of (allReplies.results || [])) {
            if (reply.rn <= 3) {
              if (!repliesMap[reply.parent_id]) {
                repliesMap[reply.parent_id] = [];
              }
              repliesMap[reply.parent_id].push(reply);
            }
          }
        }

        // Yorumları cevaplarla birleştir
        const commentsWithReplies = (comments.results || []).map(comment => ({
          ...comment,
          replies: repliesMap[comment.id] || []
        }));

        return jsonResponse({
          comments: commentsWithReplies,
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: offset + limit < total, hasPrev: page > 1 }
        }, 200, 60);
      }

      // Yorum ekle
      if (path.match(/^\/api\/posts\/(\d+)\/comments$/) && method === "POST") {
        const postId = parseInt(path.split("/")[3], 10);
        
        // Auth kontrolü
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Yorum yapmak için giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id, u.username FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        const body = await request.json();
        const content = sanitizeString(body.content, 2000);
        const parentId = body.parent_id ? parseInt(body.parent_id, 10) : null;

        if (!content || content.length < 3) {
          return errorResponse("Yorum en az 3 karakter olmalıdır", 400, "INVALID_CONTENT");
        }

        // Spam koruması - son 1 dakikada max 5 yorum
        const recentComments = await env.DB.prepare(`
          SELECT COUNT(*) as count FROM comments 
          WHERE user_id = ? AND created_at > datetime('now', '-1 minute')
        `).bind(session.user_id).first();
        if (recentComments?.count >= 5) {
          return errorResponse("Çok hızlı yorum yapıyorsunuz, lütfen bekleyin", 429, "RATE_LIMIT");
        }

        const ipHash = await sha256(clientIP);

        // Yorum ekle
        const result = await env.DB.prepare(`
          INSERT INTO comments (post_id, user_id, parent_id, content, ip_hash)
          VALUES (?, ?, ?, ?, ?)
        `).bind(postId, session.user_id, parentId, content, ipHash).run();

        // Parent varsa reply_count güncelle
        if (parentId) {
          await env.DB.prepare(`
            UPDATE comments SET reply_count = reply_count + 1 WHERE id = ?
          `).bind(parentId).run();
        }

        // Kullanıcı stats güncelle
        await env.DB.prepare(`
          INSERT INTO user_stats (user_id, comment_count) VALUES (?, 1)
          ON CONFLICT(user_id) DO UPDATE SET comment_count = comment_count + 1, updated_at = CURRENT_TIMESTAMP
        `).bind(session.user_id).run();

        return jsonResponse({ success: true, comment_id: result.meta?.last_row_id }, 201);
      }

      // Yorum sil
      if (path.match(/^\/api\/comments\/(\d+)$/) && method === "DELETE") {
        const commentId = parseInt(path.split("/")[3], 10);
        
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id, u.role FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        // Yorum sahibi veya admin kontrolü
        const comment = await env.DB.prepare(`SELECT * FROM comments WHERE id = ?`).bind(commentId).first();
        if (!comment) return errorResponse("Yorum bulunamadı", 404, "NOT_FOUND");
        if (comment.user_id !== session.user_id && session.role !== 'admin') {
          return errorResponse("Bu yorumu silme yetkiniz yok", 403, "FORBIDDEN");
        }

        await env.DB.prepare(`UPDATE comments SET is_deleted = 1 WHERE id = ?`).bind(commentId).run();
        return jsonResponse({ success: true });
      }

      // ================================
      // 📋 FORUM API
      // ================================

      // Forum kategorilerini getir
      if (path === "/api/forum/categories" && method === "GET") {
        const lang = url.searchParams.get("lang") || "tr";
        const categories = await env.DB.prepare(`
          SELECT * FROM forum_categories WHERE is_active = 1 ORDER BY display_order ASC
        `).all();

        // Dil desteği: name ve description alanlarını dile göre döndür
        const translatedCategories = (categories.results || []).map(cat => {
          let name = cat.name;
          let description = cat.description;

          if (lang === "en" && cat.name_en) {
            name = cat.name_en;
            description = cat.description_en || cat.description;
          } else if (lang === "de" && cat.name_de) {
            name = cat.name_de;
            description = cat.description_de || cat.description;
          }

          return { ...cat, name, description };
        });

        return jsonResponse({ categories: translatedCategories }, 200, 300);
      }

      // Kategori konularını getir
      if (path.match(/^\/api\/forum\/categories\/([a-z0-9-]+)\/threads$/) && method === "GET") {
        const categorySlug = path.split("/")[4];
        const lang = url.searchParams.get("lang") || "tr";
        const { page, limit, offset } = validatePagination(
          url.searchParams.get("page"),
          url.searchParams.get("limit") || "20"
        );
        const sort = url.searchParams.get("sort") || "latest";

        const category = await env.DB.prepare(`
          SELECT * FROM forum_categories WHERE slug = ? AND is_active = 1
        `).bind(categorySlug).first();
        if (!category) return errorResponse("Kategori bulunamadı", 404, "NOT_FOUND");

        // Dil desteği: category name'i dile göre ayarla
        if (lang === "en" && category.name_en) {
          category.name = category.name_en;
          category.description = category.description_en || category.description;
        } else if (lang === "de" && category.name_de) {
          category.name = category.name_de;
          category.description = category.description_de || category.description;
        }

        const countResult = await env.DB.prepare(`
          SELECT COUNT(*) as total FROM forum_threads WHERE category_id = ? AND is_deleted = 0
        `).bind(category.id).first();
        const total = countResult?.total || 0;

        let orderBy = "is_pinned DESC, last_reply_at DESC NULLS LAST, created_at DESC";
        if (sort === "popular") orderBy = "is_pinned DESC, reply_count DESC, view_count DESC";
        if (sort === "unsolved") orderBy = "is_pinned DESC, is_solved ASC, created_at DESC";

        const threads = await env.DB.prepare(`
          SELECT t.*, u.username, u.display_name, u.avatar_url,
            lu.username as last_reply_username
          FROM forum_threads t
          JOIN users u ON t.user_id = u.id
          LEFT JOIN users lu ON t.last_reply_user_id = lu.id
          WHERE t.category_id = ? AND t.is_deleted = 0
          ORDER BY ${orderBy}
          LIMIT ? OFFSET ?
        `).bind(category.id, limit, offset).all();

        return jsonResponse({
          category,
          threads: threads.results || [],
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: offset + limit < total, hasPrev: page > 1 }
        }, 200, 60);
      }

      // Tek konu detayı
      if (path.match(/^\/api\/forum\/threads\/([a-z0-9-]+)$/) && method === "GET") {
        const threadSlug = path.split("/")[4];
        const lang = url.searchParams.get("lang") || "tr";

        const thread = await env.DB.prepare(`
          SELECT t.*, u.username, u.display_name, u.avatar_url,
            c.name as category_name, c.slug as category_slug,
            c.name_en as category_name_en, c.name_de as category_name_de
          FROM forum_threads t
          JOIN users u ON t.user_id = u.id
          JOIN forum_categories c ON t.category_id = c.id
          WHERE t.slug = ? AND t.is_deleted = 0
        `).bind(threadSlug).first();
        if (!thread) return errorResponse("Konu bulunamadı", 404, "NOT_FOUND");

        // Dil desteği: category_name'i dile göre ayarla
        if (lang === "en" && thread.category_name_en) {
          thread.category_name = thread.category_name_en;
        } else if (lang === "de" && thread.category_name_de) {
          thread.category_name = thread.category_name_de;
        }
        delete thread.category_name_en;
        delete thread.category_name_de;

        // View count artır
        await env.DB.prepare(`
          UPDATE forum_threads SET view_count = view_count + 1 WHERE id = ?
        `).bind(thread.id).run();

        // Cevapları getir
        const { page, limit, offset } = validatePagination(
          url.searchParams.get("page"),
          url.searchParams.get("limit") || "20"
        );

        const countResult = await env.DB.prepare(`
          SELECT COUNT(*) as total FROM forum_replies WHERE thread_id = ? AND is_deleted = 0
        `).bind(thread.id).first();
        const total = countResult?.total || 0;

        const replies = await env.DB.prepare(`
          SELECT r.*, u.username, u.display_name, u.avatar_url
          FROM forum_replies r
          JOIN users u ON r.user_id = u.id
          WHERE r.thread_id = ? AND r.is_deleted = 0
          ORDER BY r.is_best_answer DESC, r.created_at ASC
          LIMIT ? OFFSET ?
        `).bind(thread.id, limit, offset).all();

        return jsonResponse({
          thread: { ...thread, view_count: thread.view_count + 1 },
          replies: replies.results || [],
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: offset + limit < total, hasPrev: page > 1 }
        }, 200, 30);
      }

      // Yeni konu oluştur
      if (path === "/api/forum/threads" && method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Konu açmak için giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id, u.username FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        const body = await request.json();
        const title = sanitizeString(body.title, 200);
        const content = sanitizeString(body.content, 10000);
        const categoryId = parseInt(body.category_id, 10);

        if (!title || title.length < 5) return errorResponse("Başlık en az 5 karakter olmalıdır", 400, "INVALID_TITLE");
        if (!content || content.length < 20) return errorResponse("İçerik en az 20 karakter olmalıdır", 400, "INVALID_CONTENT");

        // Kategori kontrolü
        const category = await env.DB.prepare(`SELECT * FROM forum_categories WHERE id = ? AND is_active = 1`).bind(categoryId).first();
        if (!category) return errorResponse("Geçersiz kategori", 400, "INVALID_CATEGORY");

        // Spam koruması
        const recentThreads = await env.DB.prepare(`
          SELECT COUNT(*) as count FROM forum_threads 
          WHERE user_id = ? AND created_at > datetime('now', '-10 minute')
        `).bind(session.user_id).first();
        if (recentThreads?.count >= 3) {
          return errorResponse("Çok hızlı konu açıyorsunuz, lütfen bekleyin", 429, "RATE_LIMIT");
        }

        // Slug oluştur
        const baseSlug = title.toLowerCase()
          .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
          .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const slug = `${baseSlug}-${Date.now().toString(36)}`;

        const result = await env.DB.prepare(`
          INSERT INTO forum_threads (category_id, user_id, title, slug, content)
          VALUES (?, ?, ?, ?, ?)
        `).bind(categoryId, session.user_id, title, slug, content).run();

        // Kategori thread_count güncelle
        await env.DB.prepare(`
          UPDATE forum_categories SET thread_count = thread_count + 1 WHERE id = ?
        `).bind(categoryId).run();

        // User stats güncelle
        await env.DB.prepare(`
          INSERT INTO user_stats (user_id, thread_count) VALUES (?, 1)
          ON CONFLICT(user_id) DO UPDATE SET thread_count = thread_count + 1, updated_at = CURRENT_TIMESTAMP
        `).bind(session.user_id).run();

        return jsonResponse({ success: true, thread_id: result.meta?.last_row_id, slug }, 201);
      }

      // Konuya cevap yaz
      if (path.match(/^\/api\/forum\/threads\/(\d+)\/replies$/) && method === "POST") {
        const threadId = parseInt(path.split("/")[4], 10);

        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Cevap yazmak için giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id, u.username FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        // Konu kontrolü
        const thread = await env.DB.prepare(`SELECT * FROM forum_threads WHERE id = ? AND is_deleted = 0`).bind(threadId).first();
        if (!thread) return errorResponse("Konu bulunamadı", 404, "NOT_FOUND");
        if (thread.is_locked) return errorResponse("Bu konu kilitli", 403, "THREAD_LOCKED");

        const body = await request.json();
        const content = sanitizeString(body.content, 10000);
        if (!content || content.length < 10) return errorResponse("Cevap en az 10 karakter olmalıdır", 400, "INVALID_CONTENT");

        // Spam koruması
        const recentReplies = await env.DB.prepare(`
          SELECT COUNT(*) as count FROM forum_replies 
          WHERE user_id = ? AND created_at > datetime('now', '-1 minute')
        `).bind(session.user_id).first();
        if (recentReplies?.count >= 5) {
          return errorResponse("Çok hızlı cevap yazıyorsunuz", 429, "RATE_LIMIT");
        }

        const ipHash = await sha256(clientIP);

        const result = await env.DB.prepare(`
          INSERT INTO forum_replies (thread_id, user_id, content, ip_hash)
          VALUES (?, ?, ?, ?)
        `).bind(threadId, session.user_id, content, ipHash).run();

        // Thread güncelle
        await env.DB.prepare(`
          UPDATE forum_threads SET 
            reply_count = reply_count + 1,
            last_reply_at = CURRENT_TIMESTAMP,
            last_reply_user_id = ?
          WHERE id = ?
        `).bind(session.user_id, threadId).run();

        // Kategori post_count güncelle
        await env.DB.prepare(`
          UPDATE forum_categories SET post_count = post_count + 1 WHERE id = ?
        `).bind(thread.category_id).run();

        // User stats güncelle
        await env.DB.prepare(`
          INSERT INTO user_stats (user_id, reply_count) VALUES (?, 1)
          ON CONFLICT(user_id) DO UPDATE SET reply_count = reply_count + 1, updated_at = CURRENT_TIMESTAMP
        `).bind(session.user_id).run();

        return jsonResponse({ success: true, reply_id: result.meta?.last_row_id }, 201);
      }

      // En iyi cevap işaretle
      if (path.match(/^\/api\/forum\/replies\/(\d+)\/best$/) && method === "POST") {
        const replyId = parseInt(path.split("/")[4], 10);

        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id, u.role FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        // Cevap ve konu kontrolü
        const reply = await env.DB.prepare(`SELECT * FROM forum_replies WHERE id = ?`).bind(replyId).first();
        if (!reply) return errorResponse("Cevap bulunamadı", 404, "NOT_FOUND");

        const thread = await env.DB.prepare(`SELECT * FROM forum_threads WHERE id = ?`).bind(reply.thread_id).first();
        if (!thread) return errorResponse("Konu bulunamadı", 404, "NOT_FOUND");

        // Sadece konu sahibi veya admin
        if (thread.user_id !== session.user_id && session.role !== 'admin') {
          return errorResponse("Bu işlem için yetkiniz yok", 403, "FORBIDDEN");
        }

        // Önceki best answer'ı kaldır
        await env.DB.prepare(`
          UPDATE forum_replies SET is_best_answer = 0 WHERE thread_id = ?
        `).bind(thread.id).run();

        // Yeni best answer
        await env.DB.prepare(`
          UPDATE forum_replies SET is_best_answer = 1 WHERE id = ?
        `).bind(replyId).run();

        // Thread'i solved olarak işaretle
        await env.DB.prepare(`
          UPDATE forum_threads SET is_solved = 1, best_reply_id = ? WHERE id = ?
        `).bind(replyId, thread.id).run();

        // Cevap sahibine puan ver
        await env.DB.prepare(`
          INSERT INTO user_stats (user_id, best_answer_count, reputation_points) VALUES (?, 1, 25)
          ON CONFLICT(user_id) DO UPDATE SET 
            best_answer_count = best_answer_count + 1, 
            reputation_points = reputation_points + 25,
            updated_at = CURRENT_TIMESTAMP
        `).bind(reply.user_id).run();

        return jsonResponse({ success: true });
      }

      // ================================
      // 🇹🇷 TÜRK FİLAMENT VERİTABANI API
      // ================================

      // Filamentleri listele
      if (path === "/api/filaments" && method === "GET") {
        const { page, limit, offset } = validatePagination(
          url.searchParams.get("page"),
          url.searchParams.get("limit") || "12"
        );
        const brand = url.searchParams.get("brand");
        const material = url.searchParams.get("material");
        const sort = url.searchParams.get("sort") || "rating";

        let whereClause = "1=1";
        const params = [];

        if (brand) {
          whereClause += " AND brand = ?";
          params.push(brand);
        }
        if (material) {
          whereClause += " AND material_type = ?";
          params.push(material);
        }

        const countResult = await env.DB.prepare(`
          SELECT COUNT(*) as total FROM turkish_filaments WHERE ${whereClause}
        `).bind(...params).first();
        const total = countResult?.total || 0;

        let orderBy = "avg_rating DESC, total_reviews DESC";
        if (sort === "price_low") orderBy = "price_tl ASC";
        if (sort === "price_high") orderBy = "price_tl DESC";
        if (sort === "newest") orderBy = "created_at DESC";
        if (sort === "reviews") orderBy = "total_reviews DESC";

        const filaments = await env.DB.prepare(`
          SELECT * FROM turkish_filaments
          WHERE ${whereClause}
          ORDER BY ${orderBy}
          LIMIT ? OFFSET ?
        `).bind(...params, limit, offset).all();

        // Marka ve malzeme listesi
        const brands = await env.DB.prepare(`
          SELECT DISTINCT brand FROM turkish_filaments ORDER BY brand
        `).all();
        const materials = await env.DB.prepare(`
          SELECT DISTINCT material_type FROM turkish_filaments ORDER BY material_type
        `).all();

        return jsonResponse({
          filaments: filaments.results || [],
          brands: brands.results?.map(b => b.brand) || [],
          materials: materials.results?.map(m => m.material_type) || [],
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }, 200, 120);
      }

      // Tek filament detayı
      if (path.match(/^\/api\/filaments\/(\d+)$/) && method === "GET") {
        const filamentId = parseInt(path.split("/")[3]);

        const filament = await env.DB.prepare(`
          SELECT * FROM turkish_filaments WHERE id = ?
        `).bind(filamentId).first();
        if (!filament) return errorResponse("Filament bulunamadi", 404, "NOT_FOUND");

        // Test sonuçları
        const tests = await env.DB.prepare(`
          SELECT t.*, u.username, u.display_name, u.avatar_url
          FROM filament_tests t
          JOIN users u ON t.user_id = u.id
          WHERE t.filament_id = ?
          ORDER BY t.helpful_count DESC, t.created_at DESC
          LIMIT 20
        `).bind(filamentId).all();

        // Yorumlar
        const reviews = await env.DB.prepare(`
          SELECT r.*, u.username, u.display_name, u.avatar_url
          FROM filament_reviews r
          JOIN users u ON r.user_id = u.id
          WHERE r.filament_id = ?
          ORDER BY r.helpful_count DESC, r.created_at DESC
          LIMIT 20
        `).bind(filamentId).all();

        // Ortalama test değerleri
        const avgTests = await env.DB.prepare(`
          SELECT
            ROUND(AVG(nozzle_temp), 0) as avg_nozzle_temp,
            ROUND(AVG(bed_temp), 0) as avg_bed_temp,
            ROUND(AVG(print_speed), 0) as avg_print_speed,
            ROUND(AVG(layer_adhesion_rating), 1) as avg_layer_adhesion,
            ROUND(AVG(surface_quality_rating), 1) as avg_surface_quality,
            ROUND(AVG(stringing_rating), 1) as avg_stringing,
            ROUND(AVG(warping_rating), 1) as avg_warping,
            ROUND(AVG(overall_rating), 1) as avg_overall,
            COUNT(*) as test_count
          FROM filament_tests WHERE filament_id = ?
        `).bind(filamentId).first();

        return jsonResponse({
          filament,
          tests: tests.results || [],
          reviews: reviews.results || [],
          averages: avgTests || {}
        }, 200, 60);
      }

      // Test sonucu ekle (auth gerekli)
      if (path === "/api/filaments/tests" && method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Giris gerekli", 401, "UNAUTHORIZED");
        }
        const token = authHeader.slice(7);
        const user = await verifyToken(token, env);
        if (!user) return errorResponse("Gecersiz oturum", 401, "INVALID_TOKEN");

        const body = await request.json();
        const { filament_id, printer_model, nozzle_temp, bed_temp, print_speed, retraction_mm, retraction_speed, cooling_percent, layer_adhesion_rating, surface_quality_rating, stringing_rating, warping_rating, overall_rating, notes, images } = body;

        if (!filament_id || !overall_rating) {
          return errorResponse("Filament ID ve genel puan zorunlu", 400, "VALIDATION_ERROR");
        }

        // Filament var mı kontrol
        const filament = await env.DB.prepare(`SELECT id FROM turkish_filaments WHERE id = ?`).bind(filament_id).first();
        if (!filament) return errorResponse("Filament bulunamadi", 404, "NOT_FOUND");

        // Daha önce test eklemiş mi?
        const existingTest = await env.DB.prepare(`
          SELECT id FROM filament_tests WHERE filament_id = ? AND user_id = ?
        `).bind(filament_id, user.id).first();
        if (existingTest) return errorResponse("Bu filament icin zaten test eklediniz", 400, "ALREADY_EXISTS");

        await env.DB.prepare(`
          INSERT INTO filament_tests (filament_id, user_id, printer_model, nozzle_temp, bed_temp, print_speed, retraction_mm, retraction_speed, cooling_percent, layer_adhesion_rating, surface_quality_rating, stringing_rating, warping_rating, overall_rating, notes, images)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(filament_id, user.id, printer_model || null, nozzle_temp || null, bed_temp || null, print_speed || null, retraction_mm || null, retraction_speed || null, cooling_percent || null, layer_adhesion_rating || null, surface_quality_rating || null, stringing_rating || null, warping_rating || null, overall_rating, notes || null, images ? JSON.stringify(images) : null).run();

        // Filament rating güncelle
        const newAvg = await env.DB.prepare(`
          SELECT ROUND(AVG(overall_rating), 2) as avg, COUNT(*) as cnt FROM filament_tests WHERE filament_id = ?
        `).bind(filament_id).first();

        await env.DB.prepare(`
          UPDATE turkish_filaments SET avg_rating = ?, total_reviews = ? WHERE id = ?
        `).bind(newAvg?.avg || 0, newAvg?.cnt || 0, filament_id).run();

        // Reputation puan ver
        await env.DB.prepare(`
          UPDATE users SET reputation_points = reputation_points + 15 WHERE id = ?
        `).bind(user.id).run();

        return jsonResponse({ success: true, message: "Test sonucu eklendi" }, 201);
      }

      // Yorum ekle (auth gerekli)
      if (path === "/api/filaments/reviews" && method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Giris gerekli", 401, "UNAUTHORIZED");
        }
        const token = authHeader.slice(7);
        const user = await verifyToken(token, env);
        if (!user) return errorResponse("Gecersiz oturum", 401, "INVALID_TOKEN");

        const body = await request.json();
        const { filament_id, rating, title, content, pros, cons, would_recommend, purchase_source } = body;

        if (!filament_id || !rating || !content) {
          return errorResponse("Filament ID, puan ve yorum zorunlu", 400, "VALIDATION_ERROR");
        }

        // Filament var mı kontrol
        const filament = await env.DB.prepare(`SELECT id FROM turkish_filaments WHERE id = ?`).bind(filament_id).first();
        if (!filament) return errorResponse("Filament bulunamadi", 404, "NOT_FOUND");

        await env.DB.prepare(`
          INSERT INTO filament_reviews (filament_id, user_id, rating, title, content, pros, cons, would_recommend, purchase_source)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(filament_id, user.id, rating, title || null, content, pros || null, cons || null, would_recommend ? 1 : 0, purchase_source || null).run();

        // Reputation puan ver
        await env.DB.prepare(`
          UPDATE users SET reputation_points = reputation_points + 10 WHERE id = ?
        `).bind(user.id).run();

        return jsonResponse({ success: true, message: "Yorum eklendi" }, 201);
      }

      // Admin: Filament ekle
      if (path === "/api/admin/filaments" && method === "POST") {
        const adminSecret = request.headers.get("X-ADMIN-SECRET");
        if (adminSecret !== env.ADMIN_SECRET) {
          return errorResponse("Yetkisiz erisim", 403, "FORBIDDEN");
        }

        const body = await request.json();
        const { brand, model, material_type, color, diameter, weight_grams, price_tl, vendor_url, image_url, description } = body;

        if (!brand || !model || !material_type) {
          return errorResponse("Marka, model ve malzeme tipi zorunlu", 400, "VALIDATION_ERROR");
        }

        const result = await env.DB.prepare(`
          INSERT INTO turkish_filaments (brand, model, material_type, color, diameter, weight_grams, price_tl, vendor_url, image_url, description, is_verified)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `).bind(brand, model, material_type, color || null, diameter || 1.75, weight_grams || 1000, price_tl || null, vendor_url || null, image_url || null, description || null).run();

        return jsonResponse({ success: true, id: result.meta?.last_row_id }, 201);
      }

      // Admin: Filament güncelle
      if (path.match(/^\/api\/admin\/filaments\/(\d+)$/) && method === "PUT") {
        const adminSecret = request.headers.get("X-ADMIN-SECRET");
        if (adminSecret !== env.ADMIN_SECRET) {
          return errorResponse("Yetkisiz erisim", 403, "FORBIDDEN");
        }

        const filamentId = parseInt(path.split("/")[4]);
        const body = await request.json();

        const updates = [];
        const params = [];
        const allowedFields = ['brand', 'model', 'material_type', 'color', 'diameter', 'weight_grams', 'price_tl', 'vendor_url', 'image_url', 'description', 'is_verified'];

        for (const field of allowedFields) {
          if (body[field] !== undefined) {
            updates.push(`${field} = ?`);
            params.push(body[field]);
          }
        }

        if (updates.length === 0) {
          return errorResponse("Guncellenecek alan yok", 400, "VALIDATION_ERROR");
        }

        updates.push("updated_at = CURRENT_TIMESTAMP");
        params.push(filamentId);

        await env.DB.prepare(`
          UPDATE turkish_filaments SET ${updates.join(", ")} WHERE id = ?
        `).bind(...params).run();

        return jsonResponse({ success: true });
      }

      // ================================
      // 🎨 KULLANICI PROJELERİ (SHOWCASE) API
      // ================================

      // Projeleri listele
      if (path === "/api/projects" && method === "GET") {
        const { page, limit, offset } = validatePagination(
          url.searchParams.get("page"),
          url.searchParams.get("limit") || "12"
        );
        const sort = url.searchParams.get("sort") || "latest";

        const countResult = await env.DB.prepare(`
          SELECT COUNT(*) as total FROM user_projects WHERE is_approved = 1 AND is_deleted = 0
        `).first();
        const total = countResult?.total || 0;

        let orderBy = "is_featured DESC, created_at DESC";
        if (sort === "popular") orderBy = "is_featured DESC, like_count DESC, view_count DESC";

        const projects = await env.DB.prepare(`
          SELECT p.*, u.username, u.display_name, u.avatar_url
          FROM user_projects p
          JOIN users u ON p.user_id = u.id
          WHERE p.is_approved = 1 AND p.is_deleted = 0
          ORDER BY ${orderBy}
          LIMIT ? OFFSET ?
        `).bind(limit, offset).all();

        return jsonResponse({
          projects: projects.results || [],
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: offset + limit < total, hasPrev: page > 1 }
        }, 200, 60);
      }

      // Tek proje detayı
      if (path.match(/^\/api\/projects\/([a-z0-9-]+)$/) && method === "GET") {
        const projectSlug = path.split("/")[3];

        const project = await env.DB.prepare(`
          SELECT p.*, u.username, u.display_name, u.avatar_url
          FROM user_projects p
          JOIN users u ON p.user_id = u.id
          WHERE p.slug = ? AND p.is_approved = 1 AND p.is_deleted = 0
        `).bind(projectSlug).first();
        if (!project) return errorResponse("Proje bulunamadı", 404, "NOT_FOUND");

        // View count artır
        await env.DB.prepare(`
          UPDATE user_projects SET view_count = view_count + 1 WHERE id = ?
        `).bind(project.id).run();

        return jsonResponse({ project: { ...project, view_count: project.view_count + 1 } }, 200, 60);
      }

      // Proje oluştur
      if (path === "/api/projects" && method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Proje paylaşmak için giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id, u.username FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        const body = await request.json();
        const title = sanitizeString(body.title, 200);
        const description = sanitizeString(body.description, 5000);
        const images = Array.isArray(body.images) ? JSON.stringify(body.images.slice(0, 10)) : '[]';
        const printerModel = sanitizeString(body.printer_model, 100);
        const filamentType = sanitizeString(body.filament_type, 50);
        const filamentBrand = sanitizeString(body.filament_brand, 100);
        const printSettings = sanitizeString(body.print_settings, 1000);
        const printTimeHours = parseFloat(body.print_time_hours) || null;
        const modelUrl = sanitizeString(body.model_url, 500);
        const modelSource = sanitizeString(body.model_source, 100);

        if (!title || title.length < 5) return errorResponse("Başlık en az 5 karakter olmalıdır", 400, "INVALID_TITLE");

        // Slug oluştur
        const baseSlug = title.toLowerCase()
          .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
          .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const slug = `${baseSlug}-${Date.now().toString(36)}`;

        const result = await env.DB.prepare(`
          INSERT INTO user_projects (user_id, title, slug, description, images, printer_model, filament_type, filament_brand, print_settings, print_time_hours, model_url, model_source)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(session.user_id, title, slug, description, images, printerModel, filamentType, filamentBrand, printSettings, printTimeHours, modelUrl, modelSource).run();

        // User stats güncelle
        await env.DB.prepare(`
          INSERT INTO user_stats (user_id, project_count) VALUES (?, 1)
          ON CONFLICT(user_id) DO UPDATE SET project_count = project_count + 1, updated_at = CURRENT_TIMESTAMP
        `).bind(session.user_id).run();

        return jsonResponse({ success: true, project_id: result.meta?.last_row_id, slug }, 201);
      }

      // ================================
      // 🔥 BAŞARISIZLIK GALERİSİ API
      // ================================

      // Başarısız baskıları listele
      if (path === "/api/fails" && method === "GET") {
        const { page, limit, offset } = validatePagination(
          url.searchParams.get("page"),
          url.searchParams.get("limit") || "12"
        );
        const sort = url.searchParams.get("sort") || "latest";
        const failType = url.searchParams.get("type") || "";

        let whereClause = "WHERE f.is_approved = 1 AND f.is_deleted = 0";
        const bindings = [];

        if (failType) {
          whereClause += " AND f.fail_type = ?";
          bindings.push(failType);
        }

        const countResult = await env.DB.prepare(`
          SELECT COUNT(*) as total FROM print_fails f ${whereClause}
        `).bind(...bindings).first();
        const total = countResult?.total || 0;

        let orderBy = "f.created_at DESC";
        if (sort === "popular") orderBy = "f.helpful_count DESC, f.like_count DESC";
        if (sort === "solved") orderBy = "f.is_solved DESC, f.created_at DESC";

        const fails = await env.DB.prepare(`
          SELECT f.*, u.username, u.display_name, u.avatar_url
          FROM print_fails f
          JOIN users u ON f.user_id = u.id
          ${whereClause}
          ORDER BY ${orderBy}
          LIMIT ? OFFSET ?
        `).bind(...bindings, limit, offset).all();

        return jsonResponse({
          fails: fails.results || [],
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: offset + limit < total, hasPrev: page > 1 }
        }, 200, 60);
      }

      // Tek başarısızlık detayı
      if (path.match(/^\/api\/fails\/([a-z0-9-]+)$/) && method === "GET") {
        const failSlug = path.split("/")[3];

        const fail = await env.DB.prepare(`
          SELECT f.*, u.username, u.display_name, u.avatar_url
          FROM print_fails f
          JOIN users u ON f.user_id = u.id
          WHERE f.slug = ? AND f.is_approved = 1 AND f.is_deleted = 0
        `).bind(failSlug).first();
        if (!fail) return errorResponse("Bulunamadı", 404, "NOT_FOUND");

        // View count artır
        await env.DB.prepare(`
          UPDATE print_fails SET view_count = view_count + 1 WHERE id = ?
        `).bind(fail.id).run();

        // Yorumları al
        const comments = await env.DB.prepare(`
          SELECT c.*, u.username, u.display_name, u.avatar_url
          FROM print_fail_comments c
          JOIN users u ON c.user_id = u.id
          WHERE c.fail_id = ? AND c.is_deleted = 0
          ORDER BY c.is_solution DESC, c.like_count DESC, c.created_at ASC
        `).bind(fail.id).all();

        return jsonResponse({
          fail: { ...fail, view_count: fail.view_count + 1 },
          comments: comments.results || []
        }, 200, 60);
      }

      // Başarısızlık paylaş
      if (path === "/api/fails" && method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id, u.username FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        const body = await request.json();
        const title = sanitizeString(body.title, 200);
        const description = sanitizeString(body.description, 5000);
        const failType = body.fail_type || "other";
        const images = Array.isArray(body.images) ? JSON.stringify(body.images.slice(0, 10)) : '[]';
        const printerModel = sanitizeString(body.printer_model, 100);
        const filamentType = sanitizeString(body.filament_type, 50);
        const filamentBrand = sanitizeString(body.filament_brand, 100);
        const solution = sanitizeString(body.solution, 3000);

        if (!title || title.length < 5) return errorResponse("Başlık en az 5 karakter olmalıdır", 400, "INVALID_TITLE");

        const validFailTypes = ['spaghetti', 'layer_shift', 'warping', 'stringing', 'adhesion', 'clog', 'other'];
        const finalFailType = validFailTypes.includes(failType) ? failType : 'other';

        // Slug oluştur
        const baseSlug = title.toLowerCase()
          .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
          .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const slug = `${baseSlug}-${Date.now().toString(36)}`;

        const result = await env.DB.prepare(`
          INSERT INTO print_fails (user_id, title, slug, description, fail_type, images, printer_model, filament_type, filament_brand, solution, is_solved)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(session.user_id, title, slug, description, finalFailType, images, printerModel, filamentType, filamentBrand, solution, solution ? 1 : 0).run();

        // Puan ekle (cesur paylaşım)
        await env.DB.prepare(`
          INSERT INTO reputation_log (user_id, action_type, points, reference_type, reference_id)
          VALUES (?, 'fail_share', 8, 'fail', ?)
        `).bind(session.user_id, result.meta?.last_row_id).run();

        // User stats güncelle
        await env.DB.prepare(`
          UPDATE user_stats SET reputation_points = reputation_points + 8, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?
        `).bind(session.user_id).run();

        return jsonResponse({ success: true, fail_id: result.meta?.last_row_id, slug }, 201);
      }

      // "Bu bana da oldu" toggle
      if (path === "/api/fails/metoo" && method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        const body = await request.json();
        const failId = parseInt(body.fail_id);
        if (!failId) return errorResponse("fail_id gerekli", 400, "MISSING_FAIL_ID");

        const existing = await env.DB.prepare(`
          SELECT id FROM print_fail_metoo WHERE fail_id = ? AND user_id = ?
        `).bind(failId, session.user_id).first();

        if (existing) {
          await env.DB.prepare(`DELETE FROM print_fail_metoo WHERE id = ?`).bind(existing.id).run();
          await env.DB.prepare(`UPDATE print_fails SET helpful_count = helpful_count - 1 WHERE id = ?`).bind(failId).run();
          return jsonResponse({ success: true, metoo: false });
        } else {
          await env.DB.prepare(`INSERT INTO print_fail_metoo (fail_id, user_id) VALUES (?, ?)`).bind(failId, session.user_id).run();
          await env.DB.prepare(`UPDATE print_fails SET helpful_count = helpful_count + 1 WHERE id = ?`).bind(failId).run();
          return jsonResponse({ success: true, metoo: true });
        }
      }

      // Başarısızlık yorumu ekle
      if (path === "/api/fails/comments" && method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        const body = await request.json();
        const failId = parseInt(body.fail_id);
        const content = sanitizeString(body.content, 2000);
        const isSolution = body.is_solution ? 1 : 0;

        if (!failId) return errorResponse("fail_id gerekli", 400, "MISSING_FAIL_ID");
        if (!content || content.length < 3) return errorResponse("Yorum en az 3 karakter olmalı", 400, "INVALID_CONTENT");

        await env.DB.prepare(`
          INSERT INTO print_fail_comments (fail_id, user_id, content, is_solution)
          VALUES (?, ?, ?, ?)
        `).bind(failId, session.user_id, content, isSolution).run();

        await env.DB.prepare(`
          UPDATE print_fails SET comment_count = comment_count + 1 WHERE id = ?
        `).bind(failId).run();

        // Çözüm önerisi ise puan ver
        if (isSolution) {
          await env.DB.prepare(`
            INSERT INTO reputation_log (user_id, action_type, points, reference_type, reference_id)
            VALUES (?, 'solution', 5, 'fail', ?)
          `).bind(session.user_id, failId).run();
          await env.DB.prepare(`
            UPDATE user_stats SET reputation_points = reputation_points + 5 WHERE user_id = ?
          `).bind(session.user_id).run();
        }

        return jsonResponse({ success: true });
      }

      // Başarısızlık tipleri listesi
      if (path === "/api/fails/types" && method === "GET") {
        const types = [
          { value: 'spaghetti', label: 'Spagetti / Karışık Filament', icon: '🍝' },
          { value: 'layer_shift', label: 'Katman Kayması', icon: '📐' },
          { value: 'warping', label: 'Warping / Kalkma', icon: '🌊' },
          { value: 'stringing', label: 'Stringing / İplik Çekme', icon: '🕸️' },
          { value: 'adhesion', label: 'Yapışma Sorunu', icon: '🔗' },
          { value: 'clog', label: 'Nozzle Tıkanması', icon: '🚫' },
          { value: 'other', label: 'Diğer', icon: '❓' }
        ];
        return jsonResponse({ types }, 200, 3600);
      }

      // ================================
      // 🗺️ MAKER HARİTASI API
      // ================================

      // Türkiye illeri listesi
      if (path === "/api/map/cities" && method === "GET") {
        const cities = await env.DB.prepare(`
          SELECT c.*,
            (SELECT COUNT(*) FROM maker_profiles mp WHERE mp.city = c.name AND mp.is_visible = 1) as maker_count
          FROM turkey_cities c
          ORDER BY maker_count DESC, c.name ASC
        `).all();
        return jsonResponse({ cities: cities.results || [] }, 200, 300);
      }

      // Maker'ları listele (harita için)
      if (path === "/api/map/makers" && method === "GET") {
        const city = url.searchParams.get("city") || "";
        const offersPrinting = url.searchParams.get("printing") === "1";

        let whereClause = "WHERE mp.is_visible = 1";
        const bindings = [];

        if (city) {
          whereClause += " AND mp.city = ?";
          bindings.push(city);
        }

        if (offersPrinting) {
          whereClause += " AND mp.offers_printing = 1";
        }

        const makers = await env.DB.prepare(`
          SELECT mp.id, mp.city, mp.district, mp.latitude, mp.longitude, mp.printers, mp.specialties,
                 mp.offers_printing, mp.offers_help, mp.bio, mp.contact_preference,
                 mp.contact_discord, mp.contact_telegram, mp.contact_instagram, mp.contact_email,
                 mp.is_verified, mp.is_sample,
                 u.username, u.display_name, u.avatar_url,
                 us.reputation_points
          FROM maker_profiles mp
          JOIN users u ON mp.user_id = u.id
          LEFT JOIN user_stats us ON mp.user_id = us.user_id
          ${whereClause}
          ORDER BY mp.is_sample ASC, us.reputation_points DESC, mp.helped_count DESC
          LIMIT 100
        `).bind(...bindings).all();

        return jsonResponse({ makers: makers.results || [] }, 200, 60);
      }

      // Kendi maker profilimi al
      if (path === "/api/map/profile" && method === "GET") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return jsonResponse({ profile: null });
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return jsonResponse({ profile: null });

        const profile = await env.DB.prepare(`
          SELECT * FROM maker_profiles WHERE user_id = ?
        `).bind(session.user_id).first();

        return jsonResponse({ profile });
      }

      // Maker profili oluştur/güncelle
      if (path === "/api/map/profile" && method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        const body = await request.json();
        const city = sanitizeString(body.city, 100);
        const district = sanitizeString(body.district, 100);
        const printers = Array.isArray(body.printers) ? JSON.stringify(body.printers.slice(0, 5)) : '[]';
        const specialties = Array.isArray(body.specialties) ? JSON.stringify(body.specialties.slice(0, 5)) : '[]';
        const offersPrinting = body.offers_printing ? 1 : 0;
        const offersHelp = body.offers_help !== false ? 1 : 0;
        const bio = sanitizeString(body.bio, 500);
        const isVisible = body.is_visible !== false ? 1 : 0;
        const termsAccepted = body.terms_accepted ? 1 : 0;

        if (!city) return errorResponse("Şehir gerekli", 400, "CITY_REQUIRED");
        if (!termsAccepted) return errorResponse("Kullanım koşullarını kabul etmelisiniz", 400, "TERMS_REQUIRED");

        // Şehir koordinatlarını al
        const cityData = await env.DB.prepare(`
          SELECT latitude, longitude FROM turkey_cities WHERE name = ?
        `).bind(city).first();

        const latitude = cityData?.latitude || null;
        const longitude = cityData?.longitude || null;

        const existing = await env.DB.prepare(`
          SELECT id FROM maker_profiles WHERE user_id = ?
        `).bind(session.user_id).first();

        if (existing) {
          await env.DB.prepare(`
            UPDATE maker_profiles SET
              city = ?, district = ?, latitude = ?, longitude = ?,
              printers = ?, specialties = ?,
              offers_printing = ?, offers_help = ?,
              bio = ?, is_visible = ?,
              terms_accepted = ?, terms_accepted_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
          `).bind(city, district, latitude, longitude, printers, specialties, offersPrinting, offersHelp, bio, isVisible, termsAccepted, session.user_id).run();
        } else {
          await env.DB.prepare(`
            INSERT INTO maker_profiles (user_id, city, district, latitude, longitude, printers, specialties, offers_printing, offers_help, bio, is_visible, terms_accepted, terms_accepted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          `).bind(session.user_id, city, district, latitude, longitude, printers, specialties, offersPrinting, offersHelp, bio, isVisible, termsAccepted).run();

          // İlk kez haritaya eklenen için puan
          await env.DB.prepare(`
            INSERT INTO reputation_log (user_id, action_type, points, reference_type, reference_id)
            VALUES (?, 'map_join', 10, 'profile', ?)
          `).bind(session.user_id, session.user_id).run();
          await env.DB.prepare(`
            UPDATE user_stats SET reputation_points = reputation_points + 10 WHERE user_id = ?
          `).bind(session.user_id).run();
        }

        return jsonResponse({ success: true });
      }

      // Maker profilini sil (haritadan çık)
      if (path === "/api/map/profile" && method === "DELETE") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        await env.DB.prepare(`
          DELETE FROM maker_profiles WHERE user_id = ?
        `).bind(session.user_id).run();

        return jsonResponse({ success: true });
      }

      // ================================
      // 🔔 BİLDİRİM SİSTEMİ API
      // ================================

      // Bildirimleri getir (authenticated)
      if (path === "/api/notifications" && method === "GET") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        const { page, limit, offset } = validatePagination(
          url.searchParams.get("page"),
          url.searchParams.get("limit") || "20"
        );

        const countResult = await env.DB.prepare(`
          SELECT COUNT(*) as total FROM notifications WHERE user_id = ?
        `).bind(session.user_id).first();
        const total = countResult?.total || 0;

        const unreadResult = await env.DB.prepare(`
          SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = 0
        `).bind(session.user_id).first();
        const unread = unreadResult?.unread || 0;

        const notifications = await env.DB.prepare(`
          SELECT * FROM notifications WHERE user_id = ?
          ORDER BY created_at DESC LIMIT ? OFFSET ?
        `).bind(session.user_id, limit, offset).all();

        return jsonResponse({
          notifications: notifications.results || [],
          unread,
          pagination: {
            page, limit, total,
            totalPages: Math.ceil(total / limit),
            hasNext: offset + limit < total,
            hasPrev: page > 1
          }
        });
      }

      // Okunmamış bildirim sayısı (hızlı endpoint)
      if (path === "/api/notifications/count" && method === "GET") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return jsonResponse({ unread: 0 });
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.user_id FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return jsonResponse({ unread: 0 });

        const result = await env.DB.prepare(`
          SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = 0
        `).bind(session.user_id).first();

        return jsonResponse({ unread: result?.unread || 0 }, 200, 30, request);
      }

      // Bildirimi okundu işaretle
      if (path === "/api/notifications/read" && method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.user_id FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        const body = await request.json();
        if (body.all) {
          // Tümünü okundu işaretle
          await env.DB.prepare(`
            UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0
          `).bind(session.user_id).run();
        } else if (body.id) {
          // Tek bildirimi okundu işaretle
          await env.DB.prepare(`
            UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?
          `).bind(body.id, session.user_id).run();
        }

        return jsonResponse({ success: true });
      }

      // ================================
      // 🏆 USTA SEVİYE SİSTEMİ API
      // ================================

      // Kullanıcı seviyesini hesapla
      if (path === "/api/user/level" && method === "GET") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id, u.username FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        const stats = await env.DB.prepare(`
          SELECT * FROM user_stats WHERE user_id = ?
        `).bind(session.user_id).first();

        const points = stats?.reputation_points || 0;

        // Seviye hesapla
        let level = { name: 'Çırak', icon: '🌱', min: 0, max: 100 };
        if (points > 2000) level = { name: 'Büyükusta', icon: '👑', min: 2001, max: null };
        else if (points > 500) level = { name: 'Usta', icon: '⚙️', min: 501, max: 2000 };
        else if (points > 100) level = { name: 'Kalfa', icon: '🔧', min: 101, max: 500 };

        // Bir sonraki seviyeye ilerleme
        const nextLevel = level.max ? ((points - level.min) / (level.max - level.min) * 100).toFixed(0) : 100;

        return jsonResponse({
          points,
          level: level.name,
          icon: level.icon,
          progress: parseInt(nextLevel),
          stats
        });
      }

      // Puan geçmişi
      if (path === "/api/user/reputation-log" && method === "GET") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        const log = await env.DB.prepare(`
          SELECT * FROM reputation_log
          WHERE user_id = ?
          ORDER BY created_at DESC
          LIMIT 50
        `).bind(session.user_id).all();

        return jsonResponse({ log: log.results || [] });
      }

      // ================================
      // ❤️ BEĞENİ SİSTEMİ API
      // ================================

      // Beğen / Beğeniyi kaldır (toggle)
      if (path === "/api/likes" && method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return errorResponse("Beğenmek için giriş yapmalısınız", 401, "UNAUTHORIZED");
        }
        const token = authHeader.substring(7);
        const session = await env.DB.prepare(`
          SELECT s.*, u.id as user_id FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();
        if (!session) return errorResponse("Geçersiz oturum", 401, "INVALID_SESSION");

        const body = await request.json();
        const likeableType = sanitizeString(body.type, 50); // comment, thread, reply, project
        const likeableId = parseInt(body.id, 10);

        if (!['comment', 'thread', 'reply', 'project'].includes(likeableType)) {
          return errorResponse("Geçersiz tür", 400, "INVALID_TYPE");
        }

        // Mevcut beğeni kontrolü
        const existingLike = await env.DB.prepare(`
          SELECT id FROM likes WHERE user_id = ? AND likeable_type = ? AND likeable_id = ?
        `).bind(session.user_id, likeableType, likeableId).first();

        let liked = false;
        if (existingLike) {
          // Beğeniyi kaldır
          await env.DB.prepare(`DELETE FROM likes WHERE id = ?`).bind(existingLike.id).run();
          
          // İlgili tablodaki like_count'u azalt
          const table = likeableType === 'comment' ? 'comments' : 
                       likeableType === 'thread' ? 'forum_threads' :
                       likeableType === 'reply' ? 'forum_replies' : 'user_projects';
          await env.DB.prepare(`UPDATE ${table} SET like_count = like_count - 1 WHERE id = ?`).bind(likeableId).run();
        } else {
          // Beğeni ekle
          await env.DB.prepare(`
            INSERT INTO likes (user_id, likeable_type, likeable_id) VALUES (?, ?, ?)
          `).bind(session.user_id, likeableType, likeableId).run();
          
          // İlgili tablodaki like_count'u artır
          const table = likeableType === 'comment' ? 'comments' : 
                       likeableType === 'thread' ? 'forum_threads' :
                       likeableType === 'reply' ? 'forum_replies' : 'user_projects';
          await env.DB.prepare(`UPDATE ${table} SET like_count = like_count + 1 WHERE id = ?`).bind(likeableId).run();
          liked = true;
        }

        return jsonResponse({ success: true, liked });
      }

      // ================================
      // 👤 KULLANICI PROFİL API
      // ================================

      // Kullanıcı profili
      if (path.match(/^\/api\/users\/([a-zA-Z0-9_-]+)$/) && method === "GET") {
        const username = path.split("/")[3];

        const user = await env.DB.prepare(`
          SELECT id, username, display_name, avatar_url, created_at
          FROM users WHERE username = ? AND is_active = 1
        `).bind(username).first();
        if (!user) return errorResponse("Kullanıcı bulunamadı", 404, "NOT_FOUND");

        // Stats
        const stats = await env.DB.prepare(`
          SELECT * FROM user_stats WHERE user_id = ?
        `).bind(user.id).first() || {};

        // Rozetler
        const badges = await env.DB.prepare(`
          SELECT b.*, ub.earned_at
          FROM user_badges ub
          JOIN badges b ON ub.badge_id = b.id
          WHERE ub.user_id = ?
          ORDER BY ub.earned_at DESC
        `).bind(user.id).all();

        // Son projeler
        const projects = await env.DB.prepare(`
          SELECT id, title, slug, images, like_count, created_at
          FROM user_projects
          WHERE user_id = ? AND is_approved = 1 AND is_deleted = 0
          ORDER BY created_at DESC LIMIT 6
        `).bind(user.id).all();

        // Son konular
        const threads = await env.DB.prepare(`
          SELECT t.id, t.title, t.slug, t.reply_count, t.is_solved, t.created_at, c.name as category_name
          FROM forum_threads t
          JOIN forum_categories c ON t.category_id = c.id
          WHERE t.user_id = ? AND t.is_deleted = 0
          ORDER BY t.created_at DESC LIMIT 5
        `).bind(user.id).all();

        return jsonResponse({
          user,
          stats,
          badges: badges.results || [],
          projects: projects.results || [],
          threads: threads.results || []
        }, 200, 120);
      }

      // ================================
      // 🏆 TOPLULUK VİTRİN API
      // ================================

      // Öne çıkan projeler (Otomatik: en çok beğenilen + Admin seçmeli)
      if (path === "/api/community/featured" && method === "GET") {
        const limit = Math.min(6, parseInt(url.searchParams.get("limit") || "4", 10));

        // Admin tarafından vitrine alınan projeler (is_featured = 1)
        const featuredThreads = await env.DB.prepare(`
          SELECT t.id, t.title, t.slug, t.content, t.view_count, t.reply_count, t.like_count, t.created_at,
                 u.username, u.display_name, u.avatar_url,
                 c.name as category_name, c.slug as category_slug, c.icon as category_icon
          FROM forum_threads t
          JOIN users u ON t.user_id = u.id
          JOIN forum_categories c ON t.category_id = c.id
          WHERE t.is_deleted = 0 AND t.is_featured = 1
          ORDER BY t.featured_at DESC, t.created_at DESC
          LIMIT ?
        `).bind(limit).all();

        // Eğer admin seçmeli yeterli değilse, otomatik olarak en popüler projeleri ekle
        const featuredCount = featuredThreads.results?.length || 0;
        let autoFeatured = { results: [] };

        if (featuredCount < limit) {
          const excludeIds = (featuredThreads.results || []).map(t => t.id);
          const excludeClause = excludeIds.length > 0 ? `AND t.id NOT IN (${excludeIds.join(',')})` : '';

          autoFeatured = await env.DB.prepare(`
            SELECT t.id, t.title, t.slug, t.content, t.view_count, t.reply_count, t.like_count, t.created_at,
                   u.username, u.display_name, u.avatar_url,
                   c.name as category_name, c.slug as category_slug, c.icon as category_icon
            FROM forum_threads t
            JOIN users u ON t.user_id = u.id
            JOIN forum_categories c ON t.category_id = c.id
            WHERE t.is_deleted = 0 AND t.category_id = 2 ${excludeClause}
            ORDER BY (t.like_count * 3 + t.reply_count * 2 + t.view_count) DESC, t.created_at DESC
            LIMIT ?
          `).bind(limit - featuredCount).all();
        }

        const allFeatured = [
          ...(featuredThreads.results || []).map(t => ({ ...t, featured_type: 'admin' })),
          ...(autoFeatured.results || []).map(t => ({ ...t, featured_type: 'auto' }))
        ];

        return jsonResponse({
          projects: allFeatured,
          total: allFeatured.length
        }, 200, 60);
      }

      // ================================
      // 🛒 MAĞAZA / ÜRÜN API
      // ================================

      // Shopier'dan ürün bilgilerini çek
      if (path === "/api/scrape/shopier" && method === "POST") {
        const body = await request.json();
        const shopierUrl = body.url;

        if (!shopierUrl || !shopierUrl.includes("shopier.com")) {
          return errorResponse("Geçerli bir Shopier linki girin", 400, "INVALID_URL");
        }

        try {
          // Farklı User-Agent ve header kombinasyonları dene
          const headers = {
            "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "tr-TR,tr;q=0.9",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          };

          // Shopier URL'sini normalize et
          let normalizedUrl = shopierUrl;
          if (!normalizedUrl.startsWith("http")) {
            normalizedUrl = "https://" + normalizedUrl;
          }

          const response = await fetch(normalizedUrl, {
            headers,
            redirect: "follow"
          });

          if (!response.ok) {
            // 403 veya benzeri durumda alternatif bilgi dön
            return jsonResponse({
              success: false,
              message: "Shopier sayfasına otomatik erişim kısıtlı. Lütfen bilgileri manuel girin.",
              hint: "Shopier bot koruması nedeniyle otomatik çekme yapılamıyor."
            });
          }

          const html = await response.text();

          // Ürün bilgilerini parse et
          let title = "";
          let description = "";
          let price = "";
          let images = [];

          // Title - og:title veya <title> tag'inden
          const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
          if (ogTitleMatch) {
            title = ogTitleMatch[1].replace(/ - Shopier$/, "").replace(/ \| Shopier$/, "").trim();
          } else {
            const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
            if (titleMatch) {
              title = titleMatch[1].replace(/ - Shopier$/, "").replace(/ \| Shopier$/, "").trim();
            }
          }

          // Description - og:description veya meta description
          const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
          if (ogDescMatch) {
            description = ogDescMatch[1].trim();
          } else {
            const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
            if (descMatch) {
              description = descMatch[1].trim();
            }
          }

          // Price - çeşitli formatlar
          const pricePatterns = [
            /"price":\s*"?(\d+(?:[.,]\d+)?)"?/i,
            /product:price:amount["']\s+content=["'](\d+(?:[.,]\d+)?)["']/i,
            /"priceCurrency".*?"price":\s*"?(\d+(?:[.,]\d+)?)"?/i,
            /itemprop=["']price["']\s+content=["'](\d+(?:[.,]\d+)?)["']/i,
            /class=["'][^"']*price[^"']*["'][^>]*>[\s₺TL]*(\d+(?:[.,]\d+)?)/i
          ];

          for (const pattern of pricePatterns) {
            const match = html.match(pattern);
            if (match) {
              price = match[1].replace(",", ".");
              break;
            }
          }

          // Images - og:image
          const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
          if (ogImageMatch) {
            images.push(ogImageMatch[1]);
          }

          // Ek görseller - JSON-LD'den
          const imagesMatch = html.match(/"image":\s*\[([^\]]+)\]/);
          if (imagesMatch) {
            const imageUrls = imagesMatch[1].match(/"(https?:[^"]+)"/g);
            if (imageUrls) {
              imageUrls.forEach(url => {
                const cleanUrl = url.replace(/"/g, "");
                if (!images.includes(cleanUrl)) {
                  images.push(cleanUrl);
                }
              });
            }
          }

          // Tek görsel varsa string olarak da çek
          const singleImageMatch = html.match(/"image":\s*"(https?:[^"]+)"/);
          if (singleImageMatch && !images.includes(singleImageMatch[1])) {
            images.push(singleImageMatch[1]);
          }

          // Hiç bilgi bulunamadıysa
          if (!title && !price && images.length === 0) {
            return jsonResponse({
              success: false,
              message: "Ürün bilgileri bulunamadı. Lütfen manuel girin.",
              hint: "Sayfa yapısı farklı olabilir veya ürün sayfası değil."
            });
          }

          return jsonResponse({
            success: true,
            product: {
              title: title || "",
              description: description || "",
              price: price || "",
              images: images.slice(0, 5)
            }
          });

        } catch (error) {
          console.error("Shopier scrape error:", error);
          return jsonResponse({
            success: false,
            message: "Ürün bilgileri alınamadı. Lütfen manuel girin.",
            error: error.message
          });
        }
      }

      // Tüm ürünleri listele (onaylı ve aktif olanlar)
      if (path === "/api/products" && method === "GET") {
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
        const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "12", 10)));
        const offset = (page - 1) * limit;
        const category = url.searchParams.get("category") || "";
        const userId = url.searchParams.get("user_id") || "";

        let whereClause = "WHERE p.is_active = 1 AND p.is_approved = 1";
        const params = [];

        if (category) {
          whereClause += " AND p.category = ?";
          params.push(category);
        }
        if (userId) {
          whereClause += " AND p.user_id = ?";
          params.push(parseInt(userId, 10));
        }

        const countResult = await env.DB.prepare(`SELECT COUNT(*) as total FROM products p ${whereClause}`).bind(...params).first();
        const total = countResult?.total || 0;

        params.push(limit, offset);
        const products = await env.DB.prepare(`
          SELECT p.*, u.username, u.display_name, u.avatar_url
          FROM products p
          LEFT JOIN users u ON p.user_id = u.id
          ${whereClause}
          ORDER BY p.created_at DESC
          LIMIT ? OFFSET ?
        `).bind(...params).all();

        return jsonResponse({
          products: products.results || [],
          pagination: {
            page, limit, total,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
          }
        }, 200, 60);
      }

      // Tek ürün detay
      if (path.match(/^\/api\/products\/(\d+)$/) && method === "GET") {
        const productId = parseInt(path.split("/").pop(), 10);

        const product = await env.DB.prepare(`
          SELECT p.*, u.username, u.display_name, u.avatar_url
          FROM products p
          LEFT JOIN users u ON p.user_id = u.id
          WHERE p.id = ? AND p.is_active = 1
        `).bind(productId).first();

        if (!product) return errorResponse("Ürün bulunamadı", 404, "NOT_FOUND");

        // Görüntülenme sayısını artır
        await env.DB.prepare(`UPDATE products SET view_count = view_count + 1 WHERE id = ?`).bind(productId).run();

        return jsonResponse({ product });
      }

      // Ürün ekle (giriş yapmış kullanıcılar)
      if (path === "/api/products" && method === "POST") {
        const session = await getSessionUser(env, request);
        if (!session) return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");

        const body = await request.json();
        const { title, description, price, image_url, shopier_url, category, features, stock } = body;

        if (!title || !price || !shopier_url) {
          return errorResponse("Başlık, fiyat ve Shopier linki zorunludur", 400, "MISSING_FIELDS");
        }

        // Shopier URL kontrolü
        if (!shopier_url.includes("shopier.com")) {
          return errorResponse("Geçerli bir Shopier linki girin", 400, "INVALID_SHOPIER_URL");
        }

        const result = await env.DB.prepare(`
          INSERT INTO products (user_id, title, description, price, image_url, shopier_url, category, features, stock)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          session.user_id,
          sanitizeString(title, 200),
          sanitizeString(description || "", 2000),
          parseFloat(price),
          sanitizeString(image_url || "", 500),
          sanitizeString(shopier_url, 500),
          sanitizeString(category || "Diğer", 50),
          sanitizeString(features || "", 500),
          parseInt(stock || 1, 10)
        ).run();

        return jsonResponse({
          success: true,
          message: "Ürün eklendi, onay bekliyor",
          product_id: result.meta?.last_row_id
        }, 201);
      }

      // Kullanıcının kendi ürünlerini listele
      if (path === "/api/products/my" && method === "GET") {
        const session = await getSessionUser(env, request);
        if (!session) return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");

        const products = await env.DB.prepare(`
          SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC
        `).bind(session.user_id).all();

        return jsonResponse({ products: products.results || [] });
      }

      // Ürün güncelle (sahibi)
      if (path.match(/^\/api\/products\/(\d+)$/) && method === "PUT") {
        const session = await getSessionUser(env, request);
        if (!session) return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");

        const productId = parseInt(path.split("/").pop(), 10);
        const product = await env.DB.prepare(`SELECT * FROM products WHERE id = ?`).bind(productId).first();

        if (!product) return errorResponse("Ürün bulunamadı", 404, "NOT_FOUND");
        if (product.user_id !== session.user_id) return errorResponse("Bu ürünü düzenleme yetkiniz yok", 403, "FORBIDDEN");

        const body = await request.json();
        const updates = [];
        const params = [];

        if (body.title) { updates.push("title = ?"); params.push(sanitizeString(body.title, 200)); }
        if (body.description !== undefined) { updates.push("description = ?"); params.push(sanitizeString(body.description, 2000)); }
        if (body.price) { updates.push("price = ?"); params.push(parseFloat(body.price)); }
        if (body.image_url !== undefined) { updates.push("image_url = ?"); params.push(sanitizeString(body.image_url, 500)); }
        if (body.shopier_url) { updates.push("shopier_url = ?"); params.push(sanitizeString(body.shopier_url, 500)); }
        if (body.category) { updates.push("category = ?"); params.push(sanitizeString(body.category, 50)); }
        if (body.features !== undefined) { updates.push("features = ?"); params.push(sanitizeString(body.features, 500)); }
        if (body.stock !== undefined) { updates.push("stock = ?"); params.push(parseInt(body.stock, 10)); }
        if (body.is_active !== undefined) { updates.push("is_active = ?"); params.push(body.is_active ? 1 : 0); }

        if (updates.length === 0) return errorResponse("Güncellenecek alan yok", 400, "NO_UPDATES");

        updates.push("updated_at = CURRENT_TIMESTAMP");
        // Düzenleme yapılınca tekrar onay beklesin
        updates.push("is_approved = 0");

        params.push(productId);
        await env.DB.prepare(`UPDATE products SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();

        return jsonResponse({ success: true, message: "Ürün güncellendi, onay bekliyor" });
      }

      // Ürün sil (sahibi)
      if (path.match(/^\/api\/products\/(\d+)$/) && method === "DELETE") {
        const session = await getSessionUser(env, request);
        if (!session) return errorResponse("Giriş yapmalısınız", 401, "UNAUTHORIZED");

        const productId = parseInt(path.split("/").pop(), 10);
        const product = await env.DB.prepare(`SELECT * FROM products WHERE id = ?`).bind(productId).first();

        if (!product) return errorResponse("Ürün bulunamadı", 404, "NOT_FOUND");
        if (product.user_id !== session.user_id) return errorResponse("Bu ürünü silme yetkiniz yok", 403, "FORBIDDEN");

        await env.DB.prepare(`DELETE FROM products WHERE id = ?`).bind(productId).run();

        return jsonResponse({ success: true, message: "Ürün silindi" });
      }

      // Admin: Tüm ürünleri listele (onaysız dahil)
      if (path === "/admin/products" && method === "GET") {
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
        const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
        const offset = (page - 1) * limit;
        const status = url.searchParams.get("status") || "";

        let whereClause = "WHERE 1=1";
        const params = [];

        if (status === "pending") {
          whereClause += " AND p.is_approved = 0";
        } else if (status === "approved") {
          whereClause += " AND p.is_approved = 1";
        }

        const countResult = await env.DB.prepare(`SELECT COUNT(*) as total FROM products p ${whereClause}`).bind(...params).first();
        const total = countResult?.total || 0;

        params.push(limit, offset);
        const products = await env.DB.prepare(`
          SELECT p.*, u.username, u.display_name
          FROM products p
          LEFT JOIN users u ON p.user_id = u.id
          ${whereClause}
          ORDER BY p.created_at DESC
          LIMIT ? OFFSET ?
        `).bind(...params).all();

        return jsonResponse({
          products: products.results || [],
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
      }

      // Admin: Ürün onayla/reddet
      if (path.match(/^\/admin\/products\/(\d+)\/(approve|reject)$/) && method === "POST") {
        const parts = path.split("/");
        const productId = parseInt(parts[3], 10);
        const action = parts[4];

        const product = await env.DB.prepare(`SELECT * FROM products WHERE id = ?`).bind(productId).first();
        if (!product) return errorResponse("Ürün bulunamadı", 404, "NOT_FOUND");

        if (action === "approve") {
          await env.DB.prepare(`UPDATE products SET is_approved = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(productId).run();
          return jsonResponse({ success: true, message: "Ürün onaylandı" });
        } else {
          await env.DB.prepare(`UPDATE products SET is_approved = 0, is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(productId).run();
          return jsonResponse({ success: true, message: "Ürün reddedildi" });
        }
      }

      // Admin: Ürün sil
      if (path.match(/^\/admin\/products\/(\d+)$/) && method === "DELETE") {
        const productId = parseInt(path.split("/").pop(), 10);
        await env.DB.prepare(`DELETE FROM products WHERE id = ?`).bind(productId).run();
        return jsonResponse({ success: true, message: "Ürün silindi" });
      }

      // Kategorileri listele
      if (path === "/api/products/categories" && method === "GET") {
        const categories = await env.DB.prepare(`
          SELECT category, COUNT(*) as count
          FROM products
          WHERE is_active = 1 AND is_approved = 1
          GROUP BY category
          ORDER BY count DESC
        `).all();
        return jsonResponse({ categories: categories.results || [] });
      }

      // ================================
      // 🏅 ROZET API
      // ================================

      // Tüm rozetler
      if (path === "/api/badges" && method === "GET") {
        const badges = await env.DB.prepare(`SELECT * FROM badges ORDER BY points ASC`).all();
        return jsonResponse({ badges: badges.results || [] }, 200, 300);
      }

      // ================================
      // 🌐 ÇEVİRİ API (Gemini)
      // ================================

      // Metin çevirisi
      if (path === "/api/translate" && method === "POST") {
        const body = await request.json();
        const { text, targetLang, sourceLang } = body;

        if (!text || !targetLang) {
          return errorResponse("text ve targetLang gerekli", 400, "MISSING_FIELDS");
        }

        // Metin uzunluk kontrolü (max 5000 karakter)
        if (text.length > 5000) {
          return errorResponse("Metin çok uzun (max 5000 karakter)", 400, "TEXT_TOO_LONG");
        }

        // Rate limiting - IP bazlı (dakikada max 10 çeviri)
        const translateRateKey = `translate_rate_${clientIP}`;
        // Basit rate limit kontrolü (gerçek uygulamada KV kullanılabilir)

        // Önce cache kontrol et
        const cacheKey = `translate_${await sha256(text + targetLang)}`;
        const cached = await env.DB.prepare(`
          SELECT translated_text FROM translation_cache
          WHERE cache_key = ? AND target_lang = ? AND created_at > datetime('now', '-7 day')
        `).bind(cacheKey, targetLang).first();

        if (cached) {
          return jsonResponse({
            success: true,
            translatedText: cached.translated_text,
            cached: true
          });
        }

        // Cloudflare Workers AI ile çeviri yap (harici API key gerekmez)
        const langNames = {
          tr: "Turkish",
          en: "English",
          de: "German"
        };

        const targetLangName = langNames[targetLang] || "English";
        const sourceLangName = sourceLang ? langNames[sourceLang] : "auto-detect";

        const prompt = `Translate the following text to ${targetLangName}. Keep the original formatting, preserve any markdown or HTML tags, and maintain technical terms accurately. Only return the translated text without any explanations.

Text to translate:
${text}`;

        try {
          // Cloudflare Workers AI kullan
          const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
            messages: [
              {
                role: "system",
                content: "You are a professional translator. Translate text accurately while preserving formatting. Only output the translation, nothing else."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 4000,
            temperature: 0.1
          });

          const translatedText = aiResponse?.response;

          if (!translatedText) {
            return errorResponse("Çeviri başarısız", 500, "TRANSLATION_FAILED");
          }

          // Cache'e kaydet
          try {
            await env.DB.prepare(`
              INSERT OR REPLACE INTO translation_cache (cache_key, source_text, translated_text, source_lang, target_lang)
              VALUES (?, ?, ?, ?, ?)
            `).bind(cacheKey, text.substring(0, 500), translatedText, sourceLang || 'auto', targetLang).run();
          } catch (cacheError) {
            console.error("Cache save error:", cacheError);
            // Cache hatası çeviriyi engellemesin
          }

          return jsonResponse({
            success: true,
            translatedText: translatedText.trim(),
            cached: false,
            provider: "cloudflare-ai"
          });

        } catch (error) {
          console.error("Translation error:", error);
          return errorResponse("Çeviri sırasında hata oluştu: " + error.message, 500, "TRANSLATION_ERROR");
        }
      }

      return errorResponse("Not Found", 404, "NOT_FOUND");

    } catch (error) {
      console.error("Worker error:", error);
      // Hata logla
      await logError(env, request, "worker", error.message, {
        stack: error.stack?.substring(0, 500)
      });
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

          // AI translation: İngilizce → Türkçe
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
            let cleanJson = aiText.replace(/```json\n?|\n?```/g, "").trim();
            const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
            if (jsonMatch) cleanJson = jsonMatch[0];
            if (!cleanJson.endsWith('}')) {
              cleanJson = cleanJson.replace(/,?\s*"[^"]*$/, '') + '}';
            }
            parsed = JSON.parse(cleanJson);
          } catch {
            totalErrors++;
            continue;
          }

          const slug = createSlug(parsed.title_tr);

          // Orijinal İngilizce içeriği title_en/summary_en olarak sakla
          const title_en = (item.title || '').substring(0, 500);
          const summary_en = (item.description || '').substring(0, 500);

          try {
            await env.DB.prepare(`
              INSERT INTO posts (title_tr, summary_tr, content_tr, title_en, summary_en, slug, category, post_type, source_url, image_url, ai_generated, status, published)
              VALUES (?, ?, ?, ?, ?, ?, ?, 'haber', ?, ?, 1, 'published', 1)
            `).bind(
              parsed.title_tr,
              parsed.summary_tr,
              parsed.content_tr,
              title_en,
              summary_en,
              slug,
              category,
              item.link,
              item.image
            ).run();

            totalAdded++;
            console.log("Added:", parsed.title_tr.substring(0, 50));

            // Otomatik DE çevirisi
            try {
              const dePrompt = `Translate to German. Return ONLY a JSON object with these 3 fields:
{"title":"translated title","summary":"translated summary max 200 chars","content":"translated content max 500 chars, plain text only"}

Title: ${title_en}
Summary: ${summary_en}`;

              const deText = await generateWithAI(env, dePrompt);
              if (deText) {
                let deJson = deText.replace(/```json\n?|\n?```/g, "").trim();
                const deMatch = deJson.match(/\{[\s\S]*\}/);
                if (deMatch) deJson = deMatch[0];
                if (!deJson.endsWith('}')) {
                  deJson = deJson.replace(/,?\s*"[^"]*$/, '') + '}';
                }
                const deParsed = JSON.parse(deJson);
                if (deParsed.title) {
                  // Yeni eklenen postun ID'sini al
                  const newPost = await env.DB.prepare(
                    `SELECT id FROM posts WHERE source_url = ?`
                  ).bind(item.link).first();
                  if (newPost) {
                    await env.DB.prepare(`
                      UPDATE posts SET title_de = ?, summary_de = ?, content_de = ? WHERE id = ?
                    `).bind(deParsed.title, deParsed.summary || '', deParsed.content || '', newPost.id).run();
                    console.log("DE translated:", deParsed.title.substring(0, 40));
                  }
                }
              }
            } catch (deErr) {
              console.error("DE auto-translate error:", deErr.message);
            }
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
    // Filament Marketim - en düşük fiyata göre sıralı
    { url: "https://www.filamentmarketim.com/pla-filament?siralama=en-dusuk-fiyat", name: "FilamentMarketim", type: "PLA" },
    { url: "https://www.filamentmarketim.com/petg-filament?siralama=en-dusuk-fiyat", name: "FilamentMarketim", type: "PETG" },
    { url: "https://www.filamentmarketim.com/abs-filament?siralama=en-dusuk-fiyat", name: "FilamentMarketim", type: "ABS" },
    { url: "https://www.filamentmarketim.com/asa-filament?siralama=en-dusuk-fiyat", name: "FilamentMarketim", type: "ASA" },
    { url: "https://www.filamentmarketim.com/tpu-filament?siralama=en-dusuk-fiyat", name: "FilamentMarketim", type: "TPU" },
    { url: "https://www.filamentmarketim.com/naylon-filament?siralama=en-dusuk-fiyat", name: "FilamentMarketim", type: "Nylon" },
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
        ? parseFilamentMarketimHtml(html, source.url, source.type)
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

    // turkish_filaments tablosundaki fiyatları da güncelle
    await syncTurkishFilamentPrices(env, allProducts);

  } catch (error) {
    console.error("Filament DB update error:", error.message);
  }
}

// turkish_filaments tablosunu filament_prices'dan güncelle
async function syncTurkishFilamentPrices(env, scrapedProducts) {
  console.log("Syncing turkish_filaments prices...");

  // Tüm Türk filamentlerini al
  const turkishFilaments = await env.DB.prepare(`
    SELECT id, brand, model, material_type, color FROM turkish_filaments
  `).all();

  if (!turkishFilaments.results || turkishFilaments.results.length === 0) {
    console.log("No turkish filaments found to sync");
    return;
  }

  let updated = 0;

  for (const filament of turkishFilaments.results) {
    // Scrape edilen ürünler arasında eşleşme ara
    const match = findBestPriceMatch(filament, scrapedProducts);

    if (match) {
      try {
        await env.DB.prepare(`
          UPDATE turkish_filaments
          SET price_tl = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(match.price_tl, filament.id).run();
        updated++;
        console.log(`Updated price for ${filament.brand} ${filament.model}: ${match.price_tl} TL`);
      } catch (e) {
        console.error(`Failed to update ${filament.brand}:`, e.message);
      }
    }
  }

  console.log(`Turkish filaments synced: ${updated}/${turkishFilaments.results.length} updated`);
}

// Filament için en uygun fiyat eşleşmesini bul
function findBestPriceMatch(filament, products) {
  const brandLower = filament.brand.toLowerCase();
  const materialLower = filament.material_type.toLowerCase();
  const colorLower = (filament.color || "").toLowerCase();

  // Marka eşleşmeleri için alternatif isimler
  const brandAliases = {
    "elas 3d": ["elas", "elas3d", "elas 3d"],
    "filamix": ["filamix"],
    "microzey": ["microzey"],
    "beta filament": ["beta", "beta filament"],
    "nanelab": ["nanelab"],
    "valment": ["valment"],
    "revo filament": ["revo", "revo filament"],
    "porima": ["porima"],
    "filameon": ["filameon"]
  };

  // Bu marka için olası alias'ları al
  let brandNames = [brandLower];
  for (const [key, aliases] of Object.entries(brandAliases)) {
    if (brandLower.includes(key) || aliases.some(a => brandLower.includes(a))) {
      brandNames = [...brandNames, ...aliases];
      break;
    }
  }

  // Ürünler arasında en iyi eşleşmeyi bul
  let bestMatch = null;
  let bestScore = 0;

  for (const product of products) {
    const productBrand = product.brand.toLowerCase();
    const productName = product.product_name.toLowerCase();
    const productType = product.filament_type.toLowerCase();
    const productColor = (product.color || "").toLowerCase();

    // Marka kontrolü
    const brandMatch = brandNames.some(bn =>
      productBrand.includes(bn) || productName.includes(bn)
    );
    if (!brandMatch) continue;

    // Malzeme türü kontrolü (PLA, PETG, ABS vb.)
    const materialMatch = productType.includes(materialLower.replace("+", "")) ||
                          materialLower.includes(productType.replace("+", ""));
    if (!materialMatch) continue;

    // Puan hesapla
    let score = 10; // Marka ve malzeme eşleşti

    // Renk eşleşmesi bonus
    if (colorLower && productColor) {
      if (productColor.includes(colorLower) || colorLower.includes(productColor)) {
        score += 5;
      }
    }

    // Model adı eşleşmesi bonus
    if (filament.model && productName.includes(filament.model.toLowerCase())) {
      score += 3;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = product;
    }
  }

  return bestMatch;
}

// FilamentMarketim için özel parser - geliştirilmiş versiyon
function parseFilamentMarketimHtml(html, sourceUrl, forceType = null) {
  const products = [];

  // URL'den veya parametreden filament türünü belirle
  let defaultType = forceType || "PLA";
  if (!forceType) {
    if (sourceUrl.includes("petg")) defaultType = "PETG";
    else if (sourceUrl.includes("abs-filament")) defaultType = "ABS";
    else if (sourceUrl.includes("asa")) defaultType = "ASA";
    else if (sourceUrl.includes("tpu")) defaultType = "TPU";
  }

  // Ürün linklerinden veri çıkar
  // FilamentMarketim'de ürünler <a> tagları içinde, title attribute'unda ürün adı var
  const productLinkRegex = /<a[^>]+href="([^"]+)"[^>]+title="([^"]+)"[^>]*>/gi;
  const priceRegex = /(\d{1,3}(?:\.\d{3})*|\d+),(\d{2})\s*(?:TL|₺)/g;

  // Tüm fiyatları bul
  const allPrices = [];
  let priceMatch;
  while ((priceMatch = priceRegex.exec(html)) !== null) {
    const intPart = priceMatch[1].replace(/\./g, '');
    const decPart = priceMatch[2];
    const price = parseFloat(`${intPart}.${decPart}`);
    if (price >= 100 && price <= 5000) {
      allPrices.push({ price, index: priceMatch.index });
    }
  }

  // Ürün linklerini bul
  let linkMatch;
  while ((linkMatch = productLinkRegex.exec(html)) !== null) {
    const url = linkMatch[1];
    const title = linkMatch[2].trim();

    // Filament ürünü mü kontrol et
    if (!url.includes('filament') && !title.toLowerCase().includes('filament') &&
        !title.toLowerCase().includes('pla') && !title.toLowerCase().includes('petg') &&
        !title.toLowerCase().includes('abs') && !title.toLowerCase().includes('asa')) {
      continue;
    }

    // Ürün adı çok kısa veya geçersizse atla
    if (title.length < 10 || title.includes('undefined')) continue;

    // En yakın fiyatı bul (link'ten sonraki ilk fiyat)
    const nearestPrice = allPrices.find(p => p.index > linkMatch.index && p.index < linkMatch.index + 2000);
    if (!nearestPrice) continue;

    // Marka bul
    const brand = detectBrand(title);

    // Renk bul
    const color = detectColor(title);

    // Duplicate kontrolü
    const isDuplicate = products.some(p =>
      p.product_name === title ||
      (p.brand === brand && Math.abs(p.price_tl - nearestPrice.price) < 1)
    );
    if (isDuplicate) continue;

    products.push({
      filament_type: defaultType,
      brand: brand,
      product_name: title,
      weight_grams: 1000,
      color: color,
      price_tl: nearestPrice.price,
      original_price_tl: 0,
      discount_percent: 0,
      rating: 0,
      store_name: "FilamentMarketim",
      store_url: url.startsWith('http') ? url : `https://www.filamentmarketim.com${url.startsWith('/') ? url : '/' + url}`,
      is_best_deal: 0
    });

    // Sadece ilk 10 ürünü al (en ucuzlar zaten sıralı)
    if (products.length >= 10) break;
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
  const brands = [
    // Türk markaları
    "Porima", "Elas", "Filamix", "Nanelab", "Robo90", "Beta", "Solvix", "Revo",
    // Uluslararası markalar
    "Creality", "Elegoo", "Sunlu", "eSUN", "Esun", "Flashforge", "Polymaker",
    "Anycubic", "Bambu", "Prusa", "Overture", "Hatchbox", "Eryone"
  ];
  const lowerName = name.toLowerCase();
  for (const brand of brands) {
    if (lowerName.includes(brand.toLowerCase())) return brand;
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
