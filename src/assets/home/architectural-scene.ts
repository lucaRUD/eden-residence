import background from './architectural/temporary-golden-hour.png';
import foreground from './architectural/foreground-mask.png';

// Replace this pair together. Both assets must describe the same full canvas.
// Framing uses normalized source coordinates, independent of GSAP and pixel density.
if (background.width !== foreground.width || background.height !== foreground.height) {
  throw new Error('Architectural hero background and foreground mask must have identical canvas dimensions.');
}

export const architecturalScene = {
  background,
  foreground,
  framing: {
    openingSky: 170 / 3272,
    canopy: 2236 / 3272,
    desktop: { ground: 2882.36 / 3272, heading: 1916.56 / 3272 },
    mobile: { ground: 3099 / 3272, heading: 1992.2 / 3272 },
  },
  alt: {
    ro: 'Eden Residence la colțul străzii, sub un cer cu nori, cu fațade de cărămidă, arbori și gard viu.',
    en: 'Eden Residence on a street corner beneath a cloud-filled sky, with brick facades, trees and a perimeter hedge.',
  },
} as const;
