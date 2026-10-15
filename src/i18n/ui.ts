export type Locale = 'ro' | 'en';

interface InterfaceCopy {
  pageTitle: string;
  description: string;
  heading: string;
  message: string;
  skipLink: string;
  languageNavigation: string;
}

export const homePaths = { ro: '/', en: '/en/' } as const satisfies Record<Locale, string>;

export const ui = {
  ro: {
    pageTitle: 'Eden Residence | Site în pregătire',
    description: 'Prezentarea Eden Residence este în pregătire.',
    heading: 'Site în pregătire',
    message: 'Prezentarea Eden Residence este în pregătire.',
    skipLink: 'Sari la conținut',
    languageNavigation: 'Alege limba',
  },
  en: {
    pageTitle: 'Eden Residence | Website coming soon',
    description: 'The Eden Residence presentation is being prepared.',
    heading: 'Website coming soon',
    message: 'The Eden Residence presentation is being prepared.',
    skipLink: 'Skip to content',
    languageNavigation: 'Choose language',
  },
} as const satisfies Record<Locale, InterfaceCopy>;
