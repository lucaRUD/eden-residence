export type Locale = 'ro' | 'en';

interface InterfaceCopy {
  skipLink: string;
  languageNavigation: string;
}

export const homePaths = { ro: '/', en: '/en/' } as const satisfies Record<Locale, string>;

export const ui = {
  ro: {
    skipLink: 'Sari la conținut',
    languageNavigation: 'Alege limba',
  },
  en: {
    skipLink: 'Skip to content',
    languageNavigation: 'Choose language',
  },
} as const satisfies Record<Locale, InterfaceCopy>;
