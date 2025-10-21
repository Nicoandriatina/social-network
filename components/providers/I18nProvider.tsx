'use client';

import { useEffect } from 'react';
import i18n from '@/lib/i18n/client';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialiser i18n au montage
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  return <>{children}</>;
}