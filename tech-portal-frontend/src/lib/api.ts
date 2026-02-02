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
