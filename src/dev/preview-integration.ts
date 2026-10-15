import type { AstroIntegration } from 'astro';

/** Register review pages only for `astro dev`; never generate them in dist/. */
export default function designSystemPreview(): AstroIntegration {
  return {
    name: 'eden-design-system-preview',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command === 'dev') {
          injectRoute({ pattern: '/design-system/', entrypoint: new URL('./DesignSystem.astro', import.meta.url), prerender: false });
        }
      },
    },
  };
}
