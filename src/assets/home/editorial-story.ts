import { homeRenders } from './renders';
import { passiveInteriors } from '../passive-building';

// Reuse the existing asset registry for the editorial introduction photographs.
export const editorialPhotographs = [
  { id: 'garden', src: homeRenders.garden.image, width: homeRenders.garden.image.width, height: homeRenders.garden.image.height, alt: homeRenders.garden.alt, position: '50% 50%' },
  { id: 'living', ...passiveInteriors.living },
  { id: 'bedroom', ...passiveInteriors.navyBedroom, position: '52% 55%' },
] as const;
