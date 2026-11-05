import { homeRenders } from './renders';

export const passiveStoryImages = {
  opening: { ...homeRenders.closing, position: '36% 0%', portraitPosition: '16% 38%' },
  architecture: { ...homeRenders.hero, position: '43% 48%', portraitPosition: '32% 50%' },
  reveal: { ...homeRenders.passive, position: '50% 56%', portraitPosition: '55% 60%' },
} as const;
