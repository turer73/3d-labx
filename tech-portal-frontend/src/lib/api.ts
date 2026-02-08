export type Language = 'tr' | 'en' | 'de';

export function getApiBase(request: Request) {
  // Production (Pages)
  if (request.headers.get("host")?.includes("pages.dev") ||
      request.headers.get("host")?.includes("3d-labx.com")) {
    return "https://tech-portal-api.turgut-d01.workers.dev";
  }

  // Local
  return "http://localhost:8787";
}

// Dil algılama - hostname'den
export function getLanguage(request: Request): Language {
  const host = request.headers.get("host") || "";
  if (host.startsWith("en.")) return "en";
  if (host.startsWith("de.")) return "de";
  return "tr";
}

// API URL'ine dil parametresi ekle
export function getApiUrlWithLang(baseUrl: string, lang: Language): string {
  if (lang === "tr") return baseUrl;
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}lang=${lang}`;
}

// Dile göre base URL (subdomain)
export function getBaseUrl(lang: Language): string {
  if (lang === "en") return "https://en.3d-labx.com";
  if (lang === "de") return "https://de.3d-labx.com";
  return "https://3d-labx.com";
}

// Date locale mapping
export const dateLocales: Record<Language, string> = {
  tr: "tr-TR",
  en: "en-US",
  de: "de-DE"
};

// Dile göre kategori URL yolları
export const categoryPaths: Record<Language, Record<string, string>> = {
  tr: {
    "3d-baski": "3d-baski",
    "rehberler": "rehberler",
    "incelemeler": "incelemeler",
    "sorun-cozumleri": "sorun-cozumleri",
    "teknoloji": "teknoloji",
    "yapay-zeka": "yapay-zeka"
  },
  en: {
    "3d-baski": "news",
    "rehberler": "guides",
    "incelemeler": "reviews",
    "sorun-cozumleri": "troubleshooting",
    "teknoloji": "technology",
    "yapay-zeka": "ai"
  },
  de: {
    "3d-baski": "nachrichten",
    "rehberler": "anleitungen",
    "incelemeler": "bewertungen",
    "sorun-cozumleri": "fehlerbehebung",
    "teknoloji": "technologie",
    "yapay-zeka": "ki"
  }
};

// Post URL'si oluştur (dil ve kategori bazlı)
export function getPostUrl(category: string, slug: string, lang: Language): string {
  const path = categoryPaths[lang][category] || category;
  return `/${path}/${slug}`;
}

// Hreflang URL'leri oluştur (post için)
export function getHreflangUrls(category: string, slugTr: string, slugEn?: string, slugDe?: string): {
  tr: string;
  en: string;
  de: string;
} {
  const pathTr = categoryPaths.tr[category] || category;
  const pathEn = categoryPaths.en[category] || category;
  const pathDe = categoryPaths.de[category] || category;

  return {
    tr: `https://3d-labx.com/${pathTr}/${slugTr}`,
    en: `https://en.3d-labx.com/${pathEn}/${slugEn || slugTr}`,
    de: `https://de.3d-labx.com/${pathDe}/${slugDe || slugTr}`
  };
}

// Kategori sayfası URL'si oluştur (dil bazlı)
export function getCategoryUrl(category: string, lang: Language): string {
  const path = categoryPaths[lang][category] || category;
  return `/${path}`;
}
