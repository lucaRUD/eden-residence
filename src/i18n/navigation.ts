import type { Locale } from './ui';

export const navigationCopy = {
  ro: { primary: 'Navigație principală', footer: 'Navigație subsol', open: 'Deschide meniul', close: 'Închide meniul', menu: 'Meniu' },
  en: { primary: 'Main navigation', footer: 'Footer navigation', open: 'Open menu', close: 'Close menu', menu: 'Menu' },
} as const satisfies Record<Locale, Record<'primary' | 'footer' | 'open' | 'close' | 'menu', string>>;
