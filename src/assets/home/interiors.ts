import { passiveInteriors } from '../passive-building';

// Reuse the existing original-asset registry; the gallery never generates derivatives.
export const interiorGalleryImages = [
  { ...passiveInteriors.living, position: '58% 54%' },
  { ...passiveInteriors.navyBedroom, position: '52% 55%' },
  { ...passiveInteriors.neutralBedroom, position: '50% 56%' },
] as const;
