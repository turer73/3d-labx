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
  // Article page
  article: {
    notFound: string;
    notFoundDesc: string;
    backToList: string;
    backToGuides: string;
    backToNews: string;
    backToReviews: string;
    minRead: string;
    tableOfContents: string;
    share: string;
    relatedPosts: string;
    comments: string;
    loginToComment: string;
    login: string;
    writeComment: string;
    send: string;
    sending: string;
    commentSent: string;
    commentFailed: string;
    connectionError: string;
    commentsLoading: string;
    commentsLoadFailed: string;
    noComments: string;
    beFirstComment: string;
    copyLink: string;
    shareOnX: string;
    shareOnLinkedIn: string;
    category3dPrinting: string;
    categoryGuide: string;
    categoryReview: string;
    categoryTroubleshooting: string;
    categoryArticle: string;
  };
  // Interactive Guides (Cura, Orca, Bambu, PrusaSlicer)
  interactiveGuide: {
    // Common
    home: string;
    guides: string;
    backToGuides: string;
    versionBadge: string;
    // Tabs
    tab1FlowQuality: string;
    tab2StructuralMechanics: string;
    tab3MaterialTroubleshooting: string;
    // Tab 1: Flow & Quality
    fluidDynamics: string;
    fluidDynamicsDesc: string;
    nozzleDiameter: string;
    printSpeed: string;
    layerHeight: string;
    detail: string;
    speed: string;
    lineWidth: string;
    volumetricFlow: string;
    flowSafe: string;
    flowHigh: string;
    flowCritical: string;
    zOffsetSimulation: string;
    balanced: string;
    highResolution: string;
    fastCoarse: string;
    far: string;
    near: string;
    offset: string;
    // Tab 1 Tips
    firstLayerTip: string;
    firstLayerTipDesc: string;
    goldenRuleTip: string;
    goldenRuleTipDesc: string;
    flowLimitTip: string;
    flowLimitTipDesc: string;
    // Tab 2: Structural Mechanics
    structuralMechanics: string;
    structuralMechanicsDesc: string;
    wallCount: string;
    wallNote: string;
    infillDensity: string;
    empty: string;
    solid: string;
    patternGeometry: string;
    patternGrid: string;
    patternTriangles: string;
    patternGyroid: string;
    estimatedLoadCapacity: string;
    materialCost: string;
    costLow: string;
    costMedium: string;
    costHigh: string;
    crossSectionAnalysis: string;
    // Tab 2 Tips
    functionalPartsTip: string;
    functionalPartsTipDesc: string;
    decorativePartsTip: string;
    decorativePartsTipDesc: string;
    gyroidAdvantageTip: string;
    gyroidAdvantageTipDesc: string;
    // Tab 3: Material & Troubleshooting
    thermalAdhesionAnalysis: string;
    thermalAdhesionDesc: string;
    fanSpeed: string;
    fanSpeedPLA: string;
    troubleshootingCenter: string;
    troubleshootingCenterDesc: string;
    selectProblem: string;
    stringing: string;
    blobs: string;
    underExtrusion: string;
    warping: string;
    elephantFoot: string;
    layerSeparation: string;
    solutionPlaceholder: string;
    // Tab 3 Tips
    plaSettingsTip: string;
    plaSettingsTipDesc: string;
    petgSettingsTip: string;
    petgSettingsTipDesc: string;
    absSettingsTip: string;
    absSettingsTipDesc: string;
    // Slicer names
    curaSlicer: string;
    orcaSlicer: string;
    bambuSlicer: string;
    prusaSlicer: string;
    masterClass: string;
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
    },
    // Article page
    article: {
      notFound: "İçerik Bulunamadı",
      notFoundDesc: "Aradığınız içerik bulunamadı veya kaldırılmış olabilir.",
      backToList: "Tüm Sorun Çözümleri",
      backToGuides: "Tüm Rehberler",
      backToNews: "Tüm Haberler",
      backToReviews: "Tüm İncelemeler",
      minRead: "dk okuma",
      tableOfContents: "İçindekiler",
      share: "Paylaş",
      relatedPosts: "İlgili Yazılar",
      comments: "Yorumlar",
      loginToComment: "Yorum yapmak için giriş yapmalısınız",
      login: "Giriş Yap",
      writeComment: "Düşüncelerinizi paylaşın...",
      send: "Gönder",
      sending: "Gönderiliyor...",
      commentSent: "Yorumunuz gönderildi!",
      commentFailed: "Yorum gönderilemedi",
      connectionError: "Bağlantı hatası",
      commentsLoading: "Yorumlar yükleniyor...",
      commentsLoadFailed: "Yorumlar yüklenemedi",
      noComments: "Henüz yorum yok",
      beFirstComment: "İlk yorumu siz yazın!",
      copyLink: "Linki Kopyala",
      shareOnX: "X'te Paylaş",
      shareOnLinkedIn: "LinkedIn'de Paylaş",
      category3dPrinting: "3D Baskı",
      categoryGuide: "Rehber",
      categoryReview: "İnceleme",
      categoryTroubleshooting: "Sorun Çözümü",
      categoryArticle: "Makale"
    },
    // Interactive Guides
    interactiveGuide: {
      // Common
      home: "Ana Sayfa",
      guides: "Rehberler",
      backToGuides: "← Rehberlere Dön",
      versionBadge: "v5.x İnteraktif Rehber",
      // Tabs
      tab1FlowQuality: "1. Akış & Kalite",
      tab2StructuralMechanics: "2. Yapısal Mekanik",
      tab3MaterialTroubleshooting: "3. Malzeme & Hata",
      // Tab 1: Flow & Quality
      fluidDynamics: "Akışkan Dinamikleri",
      fluidDynamicsDesc: "Nozul, hız ve katman yüksekliği nasıl etkileşir",
      nozzleDiameter: "Nozul Çapı",
      printSpeed: "Baskı Hızı",
      layerHeight: "Katman Yüksekliği",
      detail: "Detay",
      speed: "Hız",
      lineWidth: "Çizgi Genişliği",
      volumetricFlow: "Hacimsel Akış",
      flowSafe: "Güvenli",
      flowHigh: "Yüksek",
      flowCritical: "Kritik!",
      zOffsetSimulation: "Z-Offset Simülasyonu",
      balanced: "Dengeli",
      highResolution: "Yüksek Çözünürlük",
      fastCoarse: "Hızlı & Kaba",
      far: "Uzak",
      near: "Yakın",
      offset: "Offset",
      // Tab 1 Tips
      firstLayerTip: "İlk Katman İpucu",
      firstLayerTipDesc: "İlk katman yüksekliğini normal katmanın %120-150'si olarak ayarlayın",
      goldenRuleTip: "Altın Kural",
      goldenRuleTipDesc: "Katman yüksekliği nozul çapının %25-75'i arasında olmalı",
      flowLimitTip: "Akış Limiti",
      flowLimitTipDesc: "Çoğu hotend 15mm³/s üzerinde zorlanır",
      // Tab 2: Structural Mechanics
      structuralMechanics: "Yapısal Mekanik",
      structuralMechanicsDesc: "Duvar sayısı ve dolgu parça dayanıklılığını nasıl etkiler",
      wallCount: "Duvar Sayısı",
      wallNote: "Not: 3+ duvar fonksiyonel parçalar için önerilir",
      infillDensity: "Dolgu Yoğunluğu",
      empty: "Boş",
      solid: "Dolu",
      patternGeometry: "Desen Geometrisi",
      patternGrid: "Grid - Hızlı, iyi XY dayanıklılık",
      patternTriangles: "Üçgenler - Çok yönlü dayanıklılık",
      patternGyroid: "Gyroid - En iyi ağırlık/dayanım oranı",
      estimatedLoadCapacity: "Tahmini Yük Kapasitesi",
      materialCost: "Malzeme Maliyeti",
      costLow: "Düşük",
      costMedium: "Orta",
      costHigh: "Yüksek",
      crossSectionAnalysis: "Kesit Analizi",
      // Tab 2 Tips
      functionalPartsTip: "Fonksiyonel Parçalar",
      functionalPartsTipDesc: "Mekanik parçalar için 3-4 duvar ve %40+ dolgu",
      decorativePartsTip: "Dekoratif Parçalar",
      decorativePartsTipDesc: "Vazo ve dekor için 2 duvar ve %10-20 dolgu yeterli",
      gyroidAdvantageTip: "Gyroid Avantajı",
      gyroidAdvantageTipDesc: "Gyroid eşit dayanıklılık için %15 daha az malzeme kullanır",
      // Tab 3: Material & Troubleshooting
      thermalAdhesionAnalysis: "Termal & Yapışma Analizi",
      thermalAdhesionDesc: "Fan hızının baskı kalitesine etkisi",
      fanSpeed: "Fan Hızı",
      fanSpeedPLA: "PLA için ideal: %100",
      troubleshootingCenter: "Sorun Giderme Merkezi",
      troubleshootingCenterDesc: "Probleminizi seçin, çözümü öğrenin",
      selectProblem: "Bir sorun seçin...",
      stringing: "İpliklenme (Stringing)",
      blobs: "Lekeler / Bloblar",
      underExtrusion: "Yetersiz Ekstrüzyon",
      warping: "Köşe Kalkması (Warping)",
      elephantFoot: "Fil Ayağı",
      layerSeparation: "Katman Ayrılması",
      solutionPlaceholder: "Çözümü görmek için yukarıdan bir sorun seçin",
      // Tab 3 Tips
      plaSettingsTip: "PLA Ayarları",
      plaSettingsTipDesc: "200-210°C nozul, 60°C tabla, %100 fan",
      petgSettingsTip: "PETG Ayarları",
      petgSettingsTipDesc: "230-250°C nozul, 80°C tabla, %50 fan",
      absSettingsTip: "ABS Ayarları",
      absSettingsTipDesc: "240-260°C nozul, 100°C tabla, kapalı ortam",
      // Slicer names
      curaSlicer: "Cura Slicer",
      orcaSlicer: "Orca Slicer",
      bambuSlicer: "Bambu Studio",
      prusaSlicer: "PrusaSlicer",
      masterClass: "Master Class"
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
    },
    // Article page
    article: {
      notFound: "Content Not Found",
      notFoundDesc: "The content you are looking for could not be found or may have been removed.",
      backToList: "All Troubleshooting",
      backToGuides: "All Guides",
      backToNews: "All News",
      backToReviews: "All Reviews",
      minRead: "min read",
      tableOfContents: "Table of Contents",
      share: "Share",
      relatedPosts: "Related Posts",
      comments: "Comments",
      loginToComment: "You must log in to comment",
      login: "Log In",
      writeComment: "Share your thoughts...",
      send: "Send",
      sending: "Sending...",
      commentSent: "Your comment has been sent!",
      commentFailed: "Failed to send comment",
      connectionError: "Connection error",
      commentsLoading: "Loading comments...",
      commentsLoadFailed: "Failed to load comments",
      noComments: "No comments yet",
      beFirstComment: "Be the first to comment!",
      copyLink: "Copy Link",
      shareOnX: "Share on X",
      shareOnLinkedIn: "Share on LinkedIn",
      category3dPrinting: "3D Printing",
      categoryGuide: "Guide",
      categoryReview: "Review",
      categoryTroubleshooting: "Troubleshooting",
      categoryArticle: "Article"
    },
    // Interactive Guides
    interactiveGuide: {
      // Common
      home: "Home",
      guides: "Guides",
      backToGuides: "← Back to Guides",
      versionBadge: "v5.x Interactive Guide",
      // Tabs
      tab1FlowQuality: "1. Flow & Quality",
      tab2StructuralMechanics: "2. Structural Mechanics",
      tab3MaterialTroubleshooting: "3. Material & Troubleshooting",
      // Tab 1: Flow & Quality
      fluidDynamics: "Fluid Dynamics",
      fluidDynamicsDesc: "How nozzle, speed and layer height interact",
      nozzleDiameter: "Nozzle Diameter",
      printSpeed: "Print Speed",
      layerHeight: "Layer Height",
      detail: "Detail",
      speed: "Speed",
      lineWidth: "Line Width",
      volumetricFlow: "Volumetric Flow",
      flowSafe: "Safe",
      flowHigh: "High",
      flowCritical: "Critical!",
      zOffsetSimulation: "Z-Offset Simulation",
      balanced: "Balanced",
      highResolution: "High Resolution",
      fastCoarse: "Fast & Coarse",
      far: "Far",
      near: "Near",
      offset: "Offset",
      // Tab 1 Tips
      firstLayerTip: "First Layer Tip",
      firstLayerTipDesc: "Set first layer height to 120-150% of normal layer height",
      goldenRuleTip: "Golden Rule",
      goldenRuleTipDesc: "Layer height should be 25-75% of nozzle diameter",
      flowLimitTip: "Flow Limit",
      flowLimitTipDesc: "Most hotends struggle above 15mm³/s",
      // Tab 2: Structural Mechanics
      structuralMechanics: "Structural Mechanics",
      structuralMechanicsDesc: "How wall count and infill affect part strength",
      wallCount: "Wall Count",
      wallNote: "Note: 3+ walls recommended for functional parts",
      infillDensity: "Infill Density",
      empty: "Empty",
      solid: "Solid",
      patternGeometry: "Pattern Geometry",
      patternGrid: "Grid - Fast, good XY strength",
      patternTriangles: "Triangles - Multi-directional strength",
      patternGyroid: "Gyroid - Best strength-to-weight ratio",
      estimatedLoadCapacity: "Estimated Load Capacity",
      materialCost: "Material Cost",
      costLow: "Low",
      costMedium: "Medium",
      costHigh: "High",
      crossSectionAnalysis: "Cross Section Analysis",
      // Tab 2 Tips
      functionalPartsTip: "Functional Parts",
      functionalPartsTipDesc: "For mechanical parts use 3-4 walls and 40%+ infill",
      decorativePartsTip: "Decorative Parts",
      decorativePartsTipDesc: "For vases and decor, 2 walls and 10-20% infill is enough",
      gyroidAdvantageTip: "Gyroid Advantage",
      gyroidAdvantageTipDesc: "Gyroid uses 15% less material for equal strength",
      // Tab 3: Material & Troubleshooting
      thermalAdhesionAnalysis: "Thermal & Adhesion Analysis",
      thermalAdhesionDesc: "How fan speed affects print quality",
      fanSpeed: "Fan Speed",
      fanSpeedPLA: "Ideal for PLA: 100%",
      troubleshootingCenter: "Troubleshooting Center",
      troubleshootingCenterDesc: "Select your problem, learn the solution",
      selectProblem: "Select a problem...",
      stringing: "Stringing",
      blobs: "Blobs / Zits",
      underExtrusion: "Under Extrusion",
      warping: "Warping",
      elephantFoot: "Elephant Foot",
      layerSeparation: "Layer Separation",
      solutionPlaceholder: "Select a problem above to see the solution",
      // Tab 3 Tips
      plaSettingsTip: "PLA Settings",
      plaSettingsTipDesc: "200-210°C nozzle, 60°C bed, 100% fan",
      petgSettingsTip: "PETG Settings",
      petgSettingsTipDesc: "230-250°C nozzle, 80°C bed, 50% fan",
      absSettingsTip: "ABS Settings",
      absSettingsTipDesc: "240-260°C nozzle, 100°C bed, enclosed",
      // Slicer names
      curaSlicer: "Cura Slicer",
      orcaSlicer: "Orca Slicer",
      bambuSlicer: "Bambu Studio",
      prusaSlicer: "PrusaSlicer",
      masterClass: "Master Class"
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
    },
    // Article page
    article: {
      notFound: "Inhalt nicht gefunden",
      notFoundDesc: "Der gesuchte Inhalt konnte nicht gefunden werden oder wurde möglicherweise entfernt.",
      backToList: "Alle Fehlerbehebungen",
      backToGuides: "Alle Anleitungen",
      backToNews: "Alle Nachrichten",
      backToReviews: "Alle Bewertungen",
      minRead: "Min. Lesezeit",
      tableOfContents: "Inhaltsverzeichnis",
      share: "Teilen",
      relatedPosts: "Verwandte Beiträge",
      comments: "Kommentare",
      loginToComment: "Sie müssen sich anmelden, um zu kommentieren",
      login: "Anmelden",
      writeComment: "Teilen Sie Ihre Gedanken...",
      send: "Senden",
      sending: "Wird gesendet...",
      commentSent: "Ihr Kommentar wurde gesendet!",
      commentFailed: "Kommentar konnte nicht gesendet werden",
      connectionError: "Verbindungsfehler",
      commentsLoading: "Kommentare werden geladen...",
      commentsLoadFailed: "Kommentare konnten nicht geladen werden",
      noComments: "Noch keine Kommentare",
      beFirstComment: "Schreiben Sie den ersten Kommentar!",
      copyLink: "Link kopieren",
      shareOnX: "Auf X teilen",
      shareOnLinkedIn: "Auf LinkedIn teilen",
      category3dPrinting: "3D-Druck",
      categoryGuide: "Anleitung",
      categoryReview: "Bewertung",
      categoryTroubleshooting: "Fehlerbehebung",
      categoryArticle: "Artikel"
    },
    // Interactive Guides
    interactiveGuide: {
      // Common
      home: "Startseite",
      guides: "Anleitungen",
      backToGuides: "← Zurück zu Anleitungen",
      versionBadge: "v5.x Interaktive Anleitung",
      // Tabs
      tab1FlowQuality: "1. Fluss & Qualität",
      tab2StructuralMechanics: "2. Strukturmechanik",
      tab3MaterialTroubleshooting: "3. Material & Fehlerbehebung",
      // Tab 1: Flow & Quality
      fluidDynamics: "Strömungsdynamik",
      fluidDynamicsDesc: "Wie Düse, Geschwindigkeit und Schichthöhe zusammenwirken",
      nozzleDiameter: "Düsendurchmesser",
      printSpeed: "Druckgeschwindigkeit",
      layerHeight: "Schichthöhe",
      detail: "Detail",
      speed: "Geschwindigkeit",
      lineWidth: "Linienbreite",
      volumetricFlow: "Volumetrischer Fluss",
      flowSafe: "Sicher",
      flowHigh: "Hoch",
      flowCritical: "Kritisch!",
      zOffsetSimulation: "Z-Offset Simulation",
      balanced: "Ausgewogen",
      highResolution: "Hohe Auflösung",
      fastCoarse: "Schnell & Grob",
      far: "Fern",
      near: "Nah",
      offset: "Offset",
      // Tab 1 Tips
      firstLayerTip: "Erste-Schicht-Tipp",
      firstLayerTipDesc: "Erste Schichthöhe auf 120-150% der normalen Schichthöhe einstellen",
      goldenRuleTip: "Goldene Regel",
      goldenRuleTipDesc: "Schichthöhe sollte 25-75% des Düsendurchmessers betragen",
      flowLimitTip: "Flusslimit",
      flowLimitTipDesc: "Die meisten Hotends haben Probleme über 15mm³/s",
      // Tab 2: Structural Mechanics
      structuralMechanics: "Strukturmechanik",
      structuralMechanicsDesc: "Wie Wandanzahl und Füllung die Teilefestigkeit beeinflussen",
      wallCount: "Wandanzahl",
      wallNote: "Hinweis: 3+ Wände für funktionale Teile empfohlen",
      infillDensity: "Füllungsdichte",
      empty: "Leer",
      solid: "Voll",
      patternGeometry: "Mustergeometrie",
      patternGrid: "Gitter - Schnell, gute XY-Festigkeit",
      patternTriangles: "Dreiecke - Multidirektionale Festigkeit",
      patternGyroid: "Gyroid - Bestes Festigkeit-Gewicht-Verhältnis",
      estimatedLoadCapacity: "Geschätzte Tragfähigkeit",
      materialCost: "Materialkosten",
      costLow: "Niedrig",
      costMedium: "Mittel",
      costHigh: "Hoch",
      crossSectionAnalysis: "Querschnittsanalyse",
      // Tab 2 Tips
      functionalPartsTip: "Funktionsteile",
      functionalPartsTipDesc: "Für mechanische Teile 3-4 Wände und 40%+ Füllung",
      decorativePartsTip: "Dekorative Teile",
      decorativePartsTipDesc: "Für Vasen und Deko reichen 2 Wände und 10-20% Füllung",
      gyroidAdvantageTip: "Gyroid Vorteil",
      gyroidAdvantageTipDesc: "Gyroid verwendet 15% weniger Material bei gleicher Festigkeit",
      // Tab 3: Material & Troubleshooting
      thermalAdhesionAnalysis: "Thermische & Haftungsanalyse",
      thermalAdhesionDesc: "Wie die Lüftergeschwindigkeit die Druckqualität beeinflusst",
      fanSpeed: "Lüftergeschwindigkeit",
      fanSpeedPLA: "Ideal für PLA: 100%",
      troubleshootingCenter: "Fehlerbehebungszentrum",
      troubleshootingCenterDesc: "Wählen Sie Ihr Problem, lernen Sie die Lösung",
      selectProblem: "Problem auswählen...",
      stringing: "Fädenziehen (Stringing)",
      blobs: "Kleckse / Pickel",
      underExtrusion: "Unterextrusion",
      warping: "Verzug (Warping)",
      elephantFoot: "Elefantenfuß",
      layerSeparation: "Schichtablösung",
      solutionPlaceholder: "Wählen Sie oben ein Problem, um die Lösung zu sehen",
      // Tab 3 Tips
      plaSettingsTip: "PLA Einstellungen",
      plaSettingsTipDesc: "200-210°C Düse, 60°C Bett, 100% Lüfter",
      petgSettingsTip: "PETG Einstellungen",
      petgSettingsTipDesc: "230-250°C Düse, 80°C Bett, 50% Lüfter",
      absSettingsTip: "ABS Einstellungen",
      absSettingsTipDesc: "240-260°C Düse, 100°C Bett, geschlossener Raum",
      // Slicer names
      curaSlicer: "Cura Slicer",
      orcaSlicer: "Orca Slicer",
      bambuSlicer: "Bambu Studio",
      prusaSlicer: "PrusaSlicer",
      masterClass: "Master Class"
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
