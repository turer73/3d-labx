export type Language = 'tr' | 'en' | 'de';

// Tüm site için çeviriler
export const translations: Record<Language, {
  // Header
  nav: {
    printing3d: string;
    news: string;
    guides: string;
    troubleshooting: string;
    filamentTypes: string;
    localBrands: string;
    reviews: string;
    community: string;
    forum: string;
    iAlsoPrinted: string;
    failGallery: string;
    makerMap: string;
    store: string;
    contact: string;
    home: string;
  };
  // Auth
  auth: {
    login: string;
    register: string;
    logout: string;
    profile: string;
    settings: string;
  };
  // Common
  common: {
    search: string;
    searchPlaceholder: string;
    lightTheme: string;
    darkTheme: string;
    closeAnnouncement: string;
  };
  // Announcement
  announcement: {
    newContent: string;
    exploreGuides: string;
    turkishBrands: string;
  };
  // 3D Baski Page
  printing3dPage: {
    pageTitle: string;
    pageDesc: string;
    badge: string;
    newsCount: string;
    lastUpdate: string;
    current: string;
    featured: string;
    showingNews: string;
    updatesDaily: string;
    errorTitle: string;
    noContent: string;
    backHome: string;
  };
  // Footer & General
  footer: {
    aboutUs: string;
    privacy: string;
    terms: string;
    allRights: string;
  };
}> = {
  tr: {
    nav: {
      printing3d: "3D Baskı",
      news: "Haberler",
      guides: "Rehberler",
      troubleshooting: "Sorun Çözümleri",
      filamentTypes: "Filament Türleri",
      localBrands: "Yerli Markalar",
      reviews: "İncelemeler",
      community: "Topluluk",
      forum: "Forum",
      iAlsoPrinted: "Ben de Bastım",
      failGallery: "Başarısızlık Galerisi",
      makerMap: "Maker Haritası",
      store: "Mağaza",
      contact: "İletişim",
      home: "Ana Sayfa"
    },
    auth: {
      login: "Giriş",
      register: "Kayıt",
      logout: "Çıkış Yap",
      profile: "Profilim",
      settings: "Ayarlar"
    },
    common: {
      search: "Ara",
      searchPlaceholder: "Ara...",
      lightTheme: "Açık Tema",
      darkTheme: "Karanlık Tema",
      closeAnnouncement: "Duyuruyu kapat"
    },
    announcement: {
      newContent: "Yeni içerikler eklendi!",
      exploreGuides: "Rehberleri keşfedin",
      turkishBrands: "Türk filament markaları"
    },
    printing3dPage: {
      pageTitle: "3D Baskı Haberleri",
      pageDesc: "En güncel 3D baskı haberleri, teknoloji gelişmeleri ve sektör analizleri",
      badge: "3D Baskı",
      newsCount: "haber",
      lastUpdate: "Son güncelleme",
      current: "Güncel",
      featured: "Öne Çıkan",
      showingNews: "haber gösteriliyor",
      updatesDaily: "Her gün güncellenir",
      errorTitle: "İçerikler yüklenirken bir hata oluştu.",
      noContent: "Bu kategoride henüz içerik bulunmuyor.",
      backHome: "Ana Sayfaya Dön"
    },
    footer: {
      aboutUs: "Hakkımızda",
      privacy: "Gizlilik Politikası",
      terms: "Kullanım Koşulları",
      allRights: "Tüm hakları saklıdır"
    }
  },
  en: {
    nav: {
      printing3d: "3D Printing",
      news: "News",
      guides: "Guides",
      troubleshooting: "Troubleshooting",
      filamentTypes: "Filament Types",
      localBrands: "Local Brands",
      reviews: "Reviews",
      community: "Community",
      forum: "Forum",
      iAlsoPrinted: "I Also Printed",
      failGallery: "Fail Gallery",
      makerMap: "Maker Map",
      store: "Store",
      contact: "Contact",
      home: "Home"
    },
    auth: {
      login: "Login",
      register: "Register",
      logout: "Logout",
      profile: "My Profile",
      settings: "Settings"
    },
    common: {
      search: "Search",
      searchPlaceholder: "Search...",
      lightTheme: "Light Theme",
      darkTheme: "Dark Theme",
      closeAnnouncement: "Close announcement"
    },
    announcement: {
      newContent: "New content added!",
      exploreGuides: "Explore guides",
      turkishBrands: "Turkish filament brands"
    },
    printing3dPage: {
      pageTitle: "3D Printing News",
      pageDesc: "Latest 3D printing news, technology developments and industry analysis",
      badge: "3D Printing",
      newsCount: "news",
      lastUpdate: "Last updated",
      current: "Latest",
      featured: "Featured",
      showingNews: "news showing",
      updatesDaily: "Updates daily",
      errorTitle: "An error occurred while loading content.",
      noContent: "No content in this category yet.",
      backHome: "Back to Home"
    },
    footer: {
      aboutUs: "About Us",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      allRights: "All rights reserved"
    }
  },
  de: {
    nav: {
      printing3d: "3D-Druck",
      news: "Nachrichten",
      guides: "Anleitungen",
      troubleshooting: "Fehlerbehebung",
      filamentTypes: "Filament-Typen",
      localBrands: "Lokale Marken",
      reviews: "Bewertungen",
      community: "Community",
      forum: "Forum",
      iAlsoPrinted: "Meine Drucke",
      failGallery: "Fail-Galerie",
      makerMap: "Maker-Karte",
      store: "Shop",
      contact: "Kontakt",
      home: "Startseite"
    },
    auth: {
      login: "Anmelden",
      register: "Registrieren",
      logout: "Abmelden",
      profile: "Mein Profil",
      settings: "Einstellungen"
    },
    common: {
      search: "Suche",
      searchPlaceholder: "Suchen...",
      lightTheme: "Helles Design",
      darkTheme: "Dunkles Design",
      closeAnnouncement: "Ankündigung schließen"
    },
    announcement: {
      newContent: "Neue Inhalte hinzugefügt!",
      exploreGuides: "Anleitungen entdecken",
      turkishBrands: "Türkische Filament-Marken"
    },
    printing3dPage: {
      pageTitle: "3D-Druck Nachrichten",
      pageDesc: "Neueste 3D-Druck-Nachrichten, Technologieentwicklungen und Branchenanalysen",
      badge: "3D-Druck",
      newsCount: "Nachrichten",
      lastUpdate: "Letzte Aktualisierung",
      current: "Aktuell",
      featured: "Empfohlen",
      showingNews: "Nachrichten angezeigt",
      updatesDaily: "Tägliche Updates",
      errorTitle: "Beim Laden des Inhalts ist ein Fehler aufgetreten.",
      noContent: "Noch keine Inhalte in dieser Kategorie.",
      backHome: "Zurück zur Startseite"
    },
    footer: {
      aboutUs: "Über uns",
      privacy: "Datenschutz",
      terms: "Nutzungsbedingungen",
      allRights: "Alle Rechte vorbehalten"
    }
  }
};

// Helper function to get translations
export function getTranslations(lang: Language) {
  return translations[lang];
}

// Date locale mapping
export const dateLocales: Record<Language, string> = {
  tr: "tr-TR",
  en: "en-US",
  de: "de-DE"
};
