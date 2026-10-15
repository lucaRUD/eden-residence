// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import designSystemPreview from './src/dev/preview-integration';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  integrations: [designSystemPreview()],
  i18n: {
    defaultLocale: 'ro',
    locales: ['ro', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
