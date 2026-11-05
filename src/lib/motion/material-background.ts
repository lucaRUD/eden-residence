import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let mounted: { layers: HTMLElement[]; dispose: () => void } | undefined;

export function unmountMaterialBackgrounds() {
  mounted?.dispose();
  mounted = undefined;
}

/** Independent, unpinned layers. Never target a gallery or photograph transform. */
export function mountMaterialBackgrounds() {
  const layers = [...document.querySelectorAll<HTMLElement>('[data-material-background]')];
  if (mounted && layers.length === mounted.layers.length && layers.every((layer, i) => layer === mounted!.layers[i])) return;
  unmountMaterialBackgrounds();
  if (!layers.length) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  const clearActive = () => layers.forEach(layer => layer.removeAttribute('data-material-active'));
  const dispose = () => { media.revert(); clearActive(); };
  try {
    media.add({ desktop: '(min-width: 64rem)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
      if (!context.conditions?.motion) return;
      layers.forEach(layer => {
        const surface = layer.querySelector<HTMLElement>('[data-material-surface]');
        const section = layer.closest('section');
        if (!surface || !section) return;
        const distance = () => Math.max(0, parseFloat(getComputedStyle(layer).getPropertyValue('--material-travel')) || 0) / 2;
        gsap.fromTo(surface, { y: () => -distance() }, {
          y: () => distance(), ease: 'none',
          scrollTrigger: {
            id: `eden-material-${layer.dataset.materialBackground}`,
            trigger: section, start: 'top bottom', end: 'bottom top',
            scrub: true, invalidateOnRefresh: true, refreshPriority: -1,
            onToggle: self => layer.toggleAttribute('data-material-active', self.isActive),
            onRefresh: self => layer.toggleAttribute('data-material-active', self.isActive),
          },
        });
      });
      return clearActive;
    });
    mounted = { layers, dispose };
  } catch (error) {
    dispose();
    console.warn('Eden material backgrounds: using static textures.', error);
  }
}
