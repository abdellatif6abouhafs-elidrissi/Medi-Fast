// Common translations for the entire application
export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      order: 'Order Medicine',
      pharmacies: 'Partner Pharmacies',
      faqs: 'FAQs',
      admin: 'Dashboard',
      orderNow: 'Order Now',
    },
    // Home Page
    home: {
      heroTitle: 'Your Health, Our Priority',
      heroSubtitle: 'Get your medicines delivered to your doorstep in Casablanca',
      // Add more home page translations
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Operation successful',
    },
  },
  fr: {
    // Navigation
    nav: {
      home: 'Accueil',
      order: 'Commander',
      pharmacies: 'Pharmacies',
      faqs: 'FAQ',
      admin: 'Tableau de bord',
      orderNow: 'Commander maintenant',
    },
    // Home Page
    home: {
      heroTitle: 'Votre Santé, Notre Priorité',
      heroSubtitle: 'Recevez vos médicaments à votre porte à Casablanca',
      // Add more home page translations
    },
    // Common
    common: {
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      success: 'Opération réussie',
    },
  },
  ar: {
    // Navigation
    nav: {
      home: 'الرئيسية',
      order: 'طلب دواء',
      pharmacies: 'الصيدليات الشريكة',
      faqs: 'الأسئلة الشائعة',
      admin: 'لوحة التحكم',
      orderNow: 'اطلب دواءك الآن',
    },
    // Home Page
    home: {
      heroTitle: 'صحتك أولويتنا',
      heroSubtitle: 'احصل على أدويتك على عتبة منزلك في الدار البيضاء',
      // Add more home page translations
    },
    // Common
    common: {
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      success: 'تمت العملية بنجاح',
    },
  },
} as const;

export type Locale = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
