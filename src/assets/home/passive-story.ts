import { homeRenders } from './renders';
import { architecturalScene } from './architectural-scene';

export const passiveStoryImages = {
  architecture: { ...homeRenders.hero, position: '43% 48%', portraitPosition: '32% 50%' },
  reveal: { ...homeRenders.passive, position: '50% 56%', portraitPosition: '55% 60%' },
  // Reuse the registered hero pair only as a small photographic canopy cutout.
  canopy: { image: architecturalScene.background, mask: architecturalScene.foreground },
} as const;
