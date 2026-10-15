import hero from './eden-residence-exterior-street-corner.jpeg';
import project from './eden-residence-aerial-building-overview.jpeg';
import garden from './eden-residence-landscaped-courtyard.jpeg';
import walkway from './eden-residence-garden-family-walkway.jpeg';
import concept from './eden-residence-landscape-concept-sketch.jpeg';
import type { ImageMetadata } from 'astro';
import type { Locale } from '../../i18n/ui';

interface RenderAsset { image: ImageMetadata; alt: Record<Locale, string> }

// Byte-for-byte source copies from public/renders; Astro generates separate derivatives.
export const homeRenders = {
  hero: { image: hero, alt: { ro: 'Randare a clădirii Eden Residence la colț de stradă, cu fațadă de cărămidă, balcoane și arbori.', en: 'Render of Eden Residence on a street corner, with a brick façade, balconies and trees.' } },
  project: { image: project, alt: { ro: 'Vedere aeriană a ansamblului Eden Residence, a grădinilor și a străzilor din jur.', en: 'Aerial view of the Eden Residence development, gardens and surrounding streets.' } },
  garden: { image: garden, alt: { ro: 'Randare a curții amenajate cu alei, straturi de flori și pavilion de ședere lângă clădiri.', en: 'Render of a landscaped courtyard with paths, flower beds and a seating pavilion beside the buildings.' } },
  walkway: { image: walkway, alt: { ro: 'Randare cu o familie pe aleea dintre arbori, plante și clădirile rezidențiale.', en: 'Render of a family on a path between trees, planting and residential buildings.' } },
  concept: { image: concept, alt: { ro: 'Schiță de peisaj văzută de sus, cu alei, vegetație și zone de ședere.', en: 'Overhead landscape concept sketch showing paths, planting and seating areas.' } },
} as const satisfies Record<string, RenderAsset>;

export type HomeRenderName = keyof typeof homeRenders;
