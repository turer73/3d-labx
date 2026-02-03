export type Language = 'en';

export function getApiBase(request: Request) {
  // Production (Pages)
  if (request.headers.get("host")?.includes("pages.dev") ||
      request.headers.get("host")?.includes("3d-labx.com")) {
    return "https://tech-portal-api.turgut-d01.workers.dev";
  }

  // Local
  return "http://localhost:8787";
}

// İngilizce site - her zaman 'en' döndür
export function getLanguage(_request: Request): Language {
  return "en";
}

// API URL'ine dil parametresi ekle - her zaman lang=en
export function getApiUrlWithLang(baseUrl: string, _lang?: Language): string {
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}lang=en`;
}

// Base URL - her zaman İngilizce site
export function getBaseUrl(_lang?: Language): string {
  return "https://en.3d-labx.com";
}

// Date locale - İngilizce
export const dateLocale = "en-US";
