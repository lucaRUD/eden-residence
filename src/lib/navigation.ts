import type { Locale } from '../i18n/ui';

export interface NavigationItem {
  label: string;
  href: string;
  current?: boolean;
}

export interface LanguageLink {
  locale: Locale;
  label: string;
  href: string;
}
