import type { Locale } from './ui';

export const themeCopy = {
  ro: { label: 'Temă', dark: 'Temă întunecată', review: 'Teme de brand', description: 'Folosește comutatorul pentru a verifica aceleași componente în ambele teme. Preferința sistemului este folosită până la prima alegere manuală.', background: 'Fundal', surface: 'Suprafață', mutedSurface: 'Suprafață discretă', elevatedSurface: 'Suprafață elevată', text: 'Text principal', mutedText: 'Text secundar', primary: 'Acțiune primară', current: 'Tema curentă', lightName: 'Deschisă', darkName: 'Întunecată' },
  en: { label: 'Theme', dark: 'Dark theme', review: 'Brand themes', description: 'Use the toggle to review the same components in both themes. The system preference is followed until you make a manual choice.', background: 'Background', surface: 'Surface', mutedSurface: 'Muted surface', elevatedSurface: 'Elevated surface', text: 'Primary text', mutedText: 'Muted text', primary: 'Primary action', current: 'Current theme', lightName: 'Light', darkName: 'Dark' },
} as const satisfies Record<Locale, Record<string, string>>;
