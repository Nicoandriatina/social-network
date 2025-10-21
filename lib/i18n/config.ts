export const i18nConfig = {
  locales: ['fr', 'en', 'mg'],
  defaultLocale: 'fr',
  localeDetection: true,
} as const;

export type Locale = (typeof i18nConfig.locales)[number];