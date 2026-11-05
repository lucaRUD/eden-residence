export interface MaterialBackgroundSettings {
  enabled: boolean;
  src: string;
  opacity: number;
  /** Total vertical travel, in pixels; use zero for a static comparison. */
  travel: number;
  mobileTravel: number;
  position: string;
  mobilePosition: string;
}

// Original supplied JPEGs. Disable either experiment here without touching photo motion.
export const homeMaterials = {
  project: {
    enabled: true,
    src: '/images/eden-residence/materials/brick-terracotta.jpg',
    opacity: .40, travel: 48, mobileTravel: 24,
    position: '55% 50%', mobilePosition: '48% 50%',
  },
  interiors: {
    enabled: true,
    src: '/images/eden-residence/materials/oak-natural.jpg',
    opacity: .50, travel: 40, mobileTravel: 20,
    position: '50% 50%', mobilePosition: '50% 35%',
  },
} satisfies Record<string, MaterialBackgroundSettings>;
