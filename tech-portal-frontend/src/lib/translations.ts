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
    brandDescription: string;
    printing3d: string;
    news: string;
    guides: string;
    troubleshooting: string;
    reviews: string;
    community: string;
    popularTopics: string;
    curaGuide: string;
    orcaGuide: string;
    filamentGuide: string;
    contact: string;
    rssFeed: string;
    newsletter: string;
    newsletterDesc: string;
    emailPlaceholder: string;
    subscribe: string;
    noSpam: string;
    copyright: string;
  };
  // Homepage
  homepage: {
    title: string;
    description: string;
    errorLoading: string;
    readMore: string;
    viewProject: string;
    troubleshootingSection: string;
    mostSearched: string;
    viewAll: string;
    interactiveBadge: string;
    slicerGuides: string;
    slicerGuidesDesc: string;
    allGuides: string;
    guidesSection: string;
    newsSection: string;
    communityShowcase: string;
    allProjects: string;
    shareProject: string;
    reviewsSection: string;
    pollsSection: string;
    communityPreferences: string;
    activePoll: string;
    slicerPoll: string;
    votes: string;
    voteRecorded: string;
    voteFailed: string;
    connectionError: string;
    noPoll: string;
    pollLoadError: string;
    editorsChoice: string;
    communityProject: string;
    start: string;
    // Quick Access
    haveProblem: string;
    findSolution: string;
    newbie: string;
    checkGuides: string;
    lookingFilament: string;
    comparePrices: string;
    joinCommunity: string;
    askShare: string;
    // Slicer specific
    flowCalcs: string;
    zOffset: string;
    calibration: string;
    settingsDict: string;
    paCalibration: string;
    flowTest: string;
    expertGuide: string;
    troubleshoot: string;
    flowRate: string;
    layerSettings: string;
    supportStructures: string;
    organicSupport: string;
    seamPaint: string;
    // Poll questions
    printerBrandQuestion: string;
    slicerQuestion: string;
    other: string;
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
      allRights: "Tüm hakları saklıdır",
      brandDescription: "Türkiye'nin en kapsamlı 3D baskı kaynağı. Yazıcı ayarları, sorun çözümleri, filament rehberleri ve daha fazlası.",
      printing3d: "3D Baskı",
      news: "Haberler",
      guides: "Rehberler",
      troubleshooting: "Sorun Çözümleri",
      reviews: "İncelemeler",
      community: "Topluluk",
      popularTopics: "Popüler Konular",
      curaGuide: "Cura Slicer Rehberi",
      orcaGuide: "Orca Slicer Rehberi",
      filamentGuide: "Filament Rehberi",
      contact: "İletişim",
      rssFeed: "RSS Feed",
      newsletter: "Bülten",
      newsletterDesc: "Yeni içeriklerden haberdar olun",
      emailPlaceholder: "E-posta adresiniz",
      subscribe: "Abone Ol",
      noSpam: "Spam göndermiyoruz, istediğinizde çıkabilirsiniz.",
      copyright: "Türkiye'nin 3D Baskı Rehberi"
    },
    homepage: {
      title: "3D-LABX - Türkiye'nin 3D Baskı Rehberi | Yazıcı Ayarları, Sorun Çözümleri",
      description: "3D yazıcı ayarları, filament rehberleri, sorun çözümleri ve ürün incelemeleri. Türkiye'nin en kapsamlı 3D baskı kaynağı.",
      errorLoading: "İçerikler yüklenirken bir hata oluştu",
      readMore: "Devamını Oku",
      viewProject: "Projeyi Gör",
      troubleshootingSection: "Sorun Çözümleri",
      mostSearched: "En Çok Aranan",
      viewAll: "Tümünü Gör",
      interactiveBadge: "🎮 İnteraktif",
      slicerGuides: "Slicer Rehberleri",
      slicerGuidesDesc: "Hesaplayıcılar, simülasyonlar ve adım adım sorun giderme araçları ile dilimleyicinizi öğrenin.",
      allGuides: "Tüm Rehberler",
      guidesSection: "Rehberler",
      newsSection: "3D Baskı Haberleri",
      communityShowcase: "Topluluk Vitrini",
      allProjects: "Tüm Projeler",
      shareProject: "Projeni Paylaş",
      reviewsSection: "İncelemeler",
      pollsSection: "Anketler",
      communityPreferences: "Topluluğun tercihleri",
      activePoll: "Aktif Anket",
      slicerPoll: "Slicer Anketi",
      votes: "Oy",
      voteRecorded: "Oyunuz kaydedildi!",
      voteFailed: "Oy verilemedi",
      connectionError: "Bağlantı hatası",
      noPoll: "Aktif anket yok",
      pollLoadError: "Anket yüklenemedi",
      editorsChoice: "Editör Seçimi",
      communityProject: "Topluluk Projesi",
      start: "Başla",
      haveProblem: "Sorun mu var?",
      findSolution: "Hemen çözüm bul",
      newbie: "Yeni başlayan mısın?",
      checkGuides: "Rehberlere göz at",
      lookingFilament: "Filament arıyorsun?",
      comparePrices: "Fiyatları karşılaştır",
      joinCommunity: "Topluluğa katıl!",
      askShare: "Soru sor, paylaş",
      flowCalcs: "Akış hesaplamaları ve sorun çözümleri",
      zOffset: "Z-Offset",
      calibration: "Kalibrasyon ve ayarlar sözlüğü",
      settingsDict: "Ayarlar Sözlüğü",
      paCalibration: "PA Kalibrasyonu",
      flowTest: "Akış Testi",
      expertGuide: "uzman rehberi",
      troubleshoot: "Sorun Giderme",
      flowRate: "Flow Rate",
      layerSettings: "Katman ayarları ve destek yapıları",
      supportStructures: "Destek Yapıları",
      organicSupport: "Organik Destek",
      seamPaint: "Seam Paint",
      printerBrandQuestion: "En çok kullandığınız 3D yazıcı markası?",
      slicerQuestion: "Hangi Slicer Kullanıyorsunuz?",
      other: "Diğer"
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
      allRights: "All rights reserved",
      brandDescription: "Your comprehensive 3D printing resource. Printer settings, troubleshooting, filament guides and more.",
      printing3d: "3D Printing",
      news: "News",
      guides: "Guides",
      troubleshooting: "Troubleshooting",
      reviews: "Reviews",
      community: "Community",
      popularTopics: "Popular Topics",
      curaGuide: "Cura Slicer Guide",
      orcaGuide: "Orca Slicer Guide",
      filamentGuide: "Filament Guide",
      contact: "Contact",
      rssFeed: "RSS Feed",
      newsletter: "Newsletter",
      newsletterDesc: "Stay updated with new content",
      emailPlaceholder: "Your email address",
      subscribe: "Subscribe",
      noSpam: "No spam, unsubscribe anytime.",
      copyright: "Your 3D Printing Guide"
    },
    homepage: {
      title: "3D-LABX - Your 3D Printing Guide | Printer Settings, Troubleshooting",
      description: "3D printer settings, filament guides, troubleshooting and product reviews. Your comprehensive 3D printing resource.",
      errorLoading: "An error occurred while loading content",
      readMore: "Read More",
      viewProject: "View Project",
      troubleshootingSection: "Troubleshooting",
      mostSearched: "Most Searched",
      viewAll: "View All",
      interactiveBadge: "🎮 Interactive",
      slicerGuides: "Slicer Guides",
      slicerGuidesDesc: "Learn your slicer with calculators, simulations and step-by-step troubleshooting tools.",
      allGuides: "All Guides",
      guidesSection: "Guides",
      newsSection: "3D Printing News",
      communityShowcase: "Community Showcase",
      allProjects: "All Projects",
      shareProject: "Share Your Project",
      reviewsSection: "Reviews",
      pollsSection: "Polls",
      communityPreferences: "Community preferences",
      activePoll: "Active Poll",
      slicerPoll: "Slicer Poll",
      votes: "Votes",
      voteRecorded: "Your vote has been recorded!",
      voteFailed: "Failed to vote",
      connectionError: "Connection error",
      noPoll: "No active poll",
      pollLoadError: "Failed to load poll",
      editorsChoice: "Editor's Choice",
      communityProject: "Community Project",
      start: "Start",
      haveProblem: "Having issues?",
      findSolution: "Find a solution",
      newbie: "New to 3D printing?",
      checkGuides: "Check our guides",
      lookingFilament: "Looking for filament?",
      comparePrices: "Compare prices",
      joinCommunity: "Join the community!",
      askShare: "Ask questions, share",
      flowCalcs: "Flow calculations and troubleshooting",
      zOffset: "Z-Offset",
      calibration: "Calibration and settings dictionary",
      settingsDict: "Settings Dictionary",
      paCalibration: "PA Calibration",
      flowTest: "Flow Test",
      expertGuide: "expert guide",
      troubleshoot: "Troubleshooting",
      flowRate: "Flow Rate",
      layerSettings: "Layer settings and support structures",
      supportStructures: "Support Structures",
      organicSupport: "Organic Support",
      seamPaint: "Seam Paint",
      printerBrandQuestion: "Which 3D printer brand do you use the most?",
      slicerQuestion: "Which Slicer do you use?",
      other: "Other"
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
      allRights: "Alle Rechte vorbehalten",
      brandDescription: "Ihre umfassende 3D-Druck-Ressource. Druckereinstellungen, Fehlerbehebung, Filament-Anleitungen und mehr.",
      printing3d: "3D-Druck",
      news: "Nachrichten",
      guides: "Anleitungen",
      troubleshooting: "Fehlerbehebung",
      reviews: "Bewertungen",
      community: "Community",
      popularTopics: "Beliebte Themen",
      curaGuide: "Cura Slicer Anleitung",
      orcaGuide: "Orca Slicer Anleitung",
      filamentGuide: "Filament-Anleitung",
      contact: "Kontakt",
      rssFeed: "RSS Feed",
      newsletter: "Newsletter",
      newsletterDesc: "Bleiben Sie über neue Inhalte informiert",
      emailPlaceholder: "Ihre E-Mail-Adresse",
      subscribe: "Abonnieren",
      noSpam: "Kein Spam, jederzeit abmelden.",
      copyright: "Ihr 3D-Druck Ratgeber"
    },
    homepage: {
      title: "3D-LABX - Ihr 3D-Druck Ratgeber | Drucker-Einstellungen, Fehlerbehebung",
      description: "3D-Drucker-Einstellungen, Filament-Anleitungen, Fehlerbehebung und Produktbewertungen. Ihre umfassende 3D-Druck-Ressource.",
      errorLoading: "Beim Laden des Inhalts ist ein Fehler aufgetreten",
      readMore: "Weiterlesen",
      viewProject: "Projekt ansehen",
      troubleshootingSection: "Fehlerbehebung",
      mostSearched: "Meistgesucht",
      viewAll: "Alle anzeigen",
      interactiveBadge: "🎮 Interaktiv",
      slicerGuides: "Slicer Anleitungen",
      slicerGuidesDesc: "Lernen Sie Ihren Slicer mit Rechnern, Simulationen und Schritt-für-Schritt-Anleitungen.",
      allGuides: "Alle Anleitungen",
      guidesSection: "Anleitungen",
      newsSection: "3D-Druck Nachrichten",
      communityShowcase: "Community Vitrine",
      allProjects: "Alle Projekte",
      shareProject: "Projekt teilen",
      reviewsSection: "Bewertungen",
      pollsSection: "Umfragen",
      communityPreferences: "Community-Präferenzen",
      activePoll: "Aktive Umfrage",
      slicerPoll: "Slicer Umfrage",
      votes: "Stimmen",
      voteRecorded: "Ihre Stimme wurde gezählt!",
      voteFailed: "Abstimmung fehlgeschlagen",
      connectionError: "Verbindungsfehler",
      noPoll: "Keine aktive Umfrage",
      pollLoadError: "Umfrage konnte nicht geladen werden",
      editorsChoice: "Redaktionsauswahl",
      communityProject: "Community Projekt",
      start: "Starten",
      haveProblem: "Haben Sie Probleme?",
      findSolution: "Lösung finden",
      newbie: "Neu beim 3D-Druck?",
      checkGuides: "Anleitungen ansehen",
      lookingFilament: "Filament gesucht?",
      comparePrices: "Preise vergleichen",
      joinCommunity: "Community beitreten!",
      askShare: "Fragen stellen, teilen",
      flowCalcs: "Flussberechnungen und Fehlerbehebung",
      zOffset: "Z-Offset",
      calibration: "Kalibrierung und Einstellungs-Wörterbuch",
      settingsDict: "Einstellungs-Wörterbuch",
      paCalibration: "PA Kalibrierung",
      flowTest: "Fluss-Test",
      expertGuide: "Experten-Anleitung",
      troubleshoot: "Fehlerbehebung",
      flowRate: "Durchflussrate",
      layerSettings: "Schicht-Einstellungen und Stützstrukturen",
      supportStructures: "Stützstrukturen",
      organicSupport: "Organische Stützen",
      seamPaint: "Naht-Anpassung",
      printerBrandQuestion: "Welche 3D-Drucker-Marke verwenden Sie am häufigsten?",
      slicerQuestion: "Welchen Slicer verwenden Sie?",
      other: "Andere"
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
