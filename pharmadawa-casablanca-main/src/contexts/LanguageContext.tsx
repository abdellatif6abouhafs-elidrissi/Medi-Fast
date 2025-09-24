import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'ar' | 'fr' | 'en';

type TranslationKey = keyof typeof translations[Language];

interface LanguageContextType {
  language: Language;
  toggleLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define all possible translation keys
type TranslationKeys = {
  home: string;
  order: string;
  pharmacies: string;
  faqs: string;
  admin: string;
  orderNow: string;
  myAccount: string;
  login: string;
  register: string;
  // Add more translation keys as needed
};

// Translations with all required keys
const translations: Record<Language, TranslationKeys> = {
  ar: {
    home: 'الرئيسية',
    order: 'طلب دواء',
    pharmacies: 'الصيدليات الشريكة',
    faqs: 'الأسئلة الشائعة',
    admin: 'لوحة التحكم',
    orderNow: 'اطلب دواءك الآن',
    myAccount: 'حسابي',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب'
  },
  fr: {
    home: 'Accueil',
    order: 'Commander',
    pharmacies: 'Pharmacies',
    faqs: 'FAQ',
    admin: 'Administration',
    orderNow: 'Commandez maintenant',
    myAccount: 'Mon Compte',
    login: 'Connexion',
    register: 'S\'inscrire'
  },
  en: {
    home: 'Home',
    order: 'Order',
    pharmacies: 'Pharmacies',
    faqs: 'FAQs',
    admin: 'Admin',
    orderNow: 'Order Now',
    myAccount: 'My Account',
    login: 'Login',
    register: 'Register'
  }
} as const;

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ar');

  // Load language preference from localStorage on initial load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    const defaultLanguage = 'ar' as const;
    const newLanguage = savedLanguage || defaultLanguage;
    
    setLanguage(newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
    
    if (!savedLanguage) {
      localStorage.setItem('language', newLanguage);
    }
  }, []);

  // Set specific language
  const toggleLanguage = (lang: Language) => {
    if (lang === language) return;
    
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
