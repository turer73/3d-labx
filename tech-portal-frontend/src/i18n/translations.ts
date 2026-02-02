// Çok dilli destek için çeviri dosyası

export type Language = 'tr' | 'en' | 'de';

export const translations = {
  tr: {
    // Header
    nav: {
      home: 'Ana Sayfa',
      news: '3D Baskı',
      guides: 'Rehberler',
      troubleshooting: 'Sorun Çözümleri',
      reviews: 'İncelemeler',
      community: 'Topluluk',
      filaments: 'Filamentler',
      aiTools: 'AI Araçlar',
      login: 'Giriş',
      register: 'Kayıt Ol',
      profile: 'Profil',
      logout: 'Çıkış Yap',
    },
    // Hero
    hero: {
      title: "Türkiye'nin 3D Baskı Rehberi",
      subtitle: '3D yazıcı ayarları, sorun çözümleri ve filament rehberleri',
      searchPlaceholder: 'Ne aramak istersiniz?',
    },
    // Categories
    categories: {
      '3d-baski': '3D Baskı Haberleri',
      'teknoloji': 'Teknoloji',
      'yapay-zeka': 'Yapay Zeka',
      'rehberler': 'Rehberler',
      'incelemeler': 'İncelemeler',
      'sorun-cozumleri': 'Sorun Çözümleri',
    },
    // Common
    common: {
      readMore: 'Devamını Oku',
      viewAll: 'Tümünü Gör',
      loading: 'Yükleniyor...',
      noResults: 'Sonuç bulunamadı',
      error: 'Bir hata oluştu',
      search: 'Ara',
      share: 'Paylaş',
      comments: 'Yorumlar',
      relatedPosts: 'İlgili Yazılar',
    },
    // Footer
    footer: {
      description: "Türkiye'nin en kapsamlı 3D baskı kaynağı. Yazıcı ayarları, sorun çözümleri, filament rehberleri ve daha fazlası.",
      popularTopics: 'Popüler Konular',
      quickLinks: 'Hızlı Bağlantılar',
      legal: 'Yasal',
      about: 'Hakkımızda',
      contact: 'İletişim',
      privacy: 'Gizlilik Politikası',
      kvkk: 'KVKK',
      disclaimer: 'Sorumluluk Reddi',
      copyright: '© 2024 3D-labX. Tüm hakları saklıdır.',
    },
    // Polls
    polls: {
      title: 'Anketler',
      subtitle: 'Topluluğun tercihleri',
      vote: 'Oy Ver',
      voted: 'Oy verdiniz',
      votes: 'Oy',
    },
    // Auth
    auth: {
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      email: 'E-posta',
      password: 'Şifre',
      username: 'Kullanıcı Adı',
      forgotPassword: 'Şifremi Unuttum',
      noAccount: 'Hesabınız yok mu?',
      hasAccount: 'Zaten hesabınız var mı?',
    },
  },
  en: {
    // Header
    nav: {
      home: 'Home',
      news: '3D Printing',
      guides: 'Guides',
      troubleshooting: 'Troubleshooting',
      reviews: 'Reviews',
      community: 'Community',
      filaments: 'Filaments',
      aiTools: 'AI Tools',
      login: 'Login',
      register: 'Sign Up',
      profile: 'Profile',
      logout: 'Logout',
    },
    // Hero
    hero: {
      title: 'Your 3D Printing Guide',
      subtitle: '3D printer settings, troubleshooting and filament guides',
      searchPlaceholder: 'What are you looking for?',
    },
    // Categories
    categories: {
      '3d-baski': '3D Printing News',
      'teknoloji': 'Technology',
      'yapay-zeka': 'Artificial Intelligence',
      'rehberler': 'Guides',
      'incelemeler': 'Reviews',
      'sorun-cozumleri': 'Troubleshooting',
    },
    // Common
    common: {
      readMore: 'Read More',
      viewAll: 'View All',
      loading: 'Loading...',
      noResults: 'No results found',
      error: 'An error occurred',
      search: 'Search',
      share: 'Share',
      comments: 'Comments',
      relatedPosts: 'Related Posts',
    },
    // Footer
    footer: {
      description: 'The most comprehensive 3D printing resource. Printer settings, troubleshooting, filament guides and more.',
      popularTopics: 'Popular Topics',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      about: 'About Us',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      kvkk: 'Data Protection',
      disclaimer: 'Disclaimer',
      copyright: '© 2024 3D-labX. All rights reserved.',
    },
    // Polls
    polls: {
      title: 'Polls',
      subtitle: 'Community preferences',
      vote: 'Vote',
      voted: 'You voted',
      votes: 'Votes',
    },
    // Auth
    auth: {
      login: 'Login',
      register: 'Sign Up',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      forgotPassword: 'Forgot Password',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
    },
  },
  de: {
    // Header
    nav: {
      home: 'Startseite',
      news: '3D-Druck',
      guides: 'Anleitungen',
      troubleshooting: 'Fehlerbehebung',
      reviews: 'Bewertungen',
      community: 'Community',
      filaments: 'Filamente',
      aiTools: 'KI-Tools',
      login: 'Anmelden',
      register: 'Registrieren',
      profile: 'Profil',
      logout: 'Abmelden',
    },
    // Hero
    hero: {
      title: 'Ihr 3D-Druck-Ratgeber',
      subtitle: '3D-Drucker-Einstellungen, Fehlerbehebung und Filament-Anleitungen',
      searchPlaceholder: 'Wonach suchen Sie?',
    },
    // Categories
    categories: {
      '3d-baski': '3D-Druck-Nachrichten',
      'teknoloji': 'Technologie',
      'yapay-zeka': 'Künstliche Intelligenz',
      'rehberler': 'Anleitungen',
      'incelemeler': 'Bewertungen',
      'sorun-cozumleri': 'Fehlerbehebung',
    },
    // Common
    common: {
      readMore: 'Weiterlesen',
      viewAll: 'Alle anzeigen',
      loading: 'Lädt...',
      noResults: 'Keine Ergebnisse gefunden',
      error: 'Ein Fehler ist aufgetreten',
      search: 'Suchen',
      share: 'Teilen',
      comments: 'Kommentare',
      relatedPosts: 'Ähnliche Beiträge',
    },
    // Footer
    footer: {
      description: 'Die umfassendste 3D-Druck-Ressource. Drucker-Einstellungen, Fehlerbehebung, Filament-Anleitungen und mehr.',
      popularTopics: 'Beliebte Themen',
      quickLinks: 'Schnelllinks',
      legal: 'Rechtliches',
      about: 'Über uns',
      contact: 'Kontakt',
      privacy: 'Datenschutz',
      kvkk: 'Datenschutz',
      disclaimer: 'Haftungsausschluss',
      copyright: '© 2024 3D-labX. Alle Rechte vorbehalten.',
    },
    // Polls
    polls: {
      title: 'Umfragen',
      subtitle: 'Community-Präferenzen',
      vote: 'Abstimmen',
      voted: 'Sie haben abgestimmt',
      votes: 'Stimmen',
    },
    // Auth
    auth: {
      login: 'Anmelden',
      register: 'Registrieren',
      email: 'E-Mail',
      password: 'Passwort',
      username: 'Benutzername',
      forgotPassword: 'Passwort vergessen',
      noAccount: 'Noch kein Konto?',
      hasAccount: 'Bereits ein Konto?',
    },
  },
};

// Helper function to get translation
export function t(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to Turkish
      value = translations.tr;
      for (const k2 of keys) {
        if (value && typeof value === 'object' && k2 in value) {
          value = value[k2];
        } else {
          return key;
        }
      }
      break;
    }
  }

  return typeof value === 'string' ? value : key;
}

// Get current language from URL or default
export function getCurrentLanguage(url: URL): Language {
  const hostname = url.hostname;
  if (hostname.startsWith('en.')) return 'en';
  if (hostname.startsWith('de.')) return 'de';
  return 'tr';
}

// Get API URL with language parameter
export function getApiUrl(baseUrl: string, lang: Language): string {
  if (lang === 'tr') return baseUrl;
  return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}lang=${lang}`;
}
