'use client';

import { useTranslation } from 'react-i18next';

export function useI18n(namespace: string | string[] = 'common') {
  const { t, i18n } = useTranslation(namespace);

  return {
    t,
    currentLang: i18n.language,
    changeLanguage: (lang: string) => i18n.changeLanguage(lang),
    isRTL: i18n.dir() === 'rtl',
  };
}