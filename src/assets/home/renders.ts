import hero from './eden-residence-exterior-street-corner.jpeg';
import project from './eden-residence-aerial-garden-water-feature.jpeg';
import garden from './eden-residence-landscaped-courtyard.jpeg';
import walkway from './eden-residence-garden-sunset-walkway.jpeg';
import concept from './eden-residence-landscape-concept-sketch.jpeg';
import heroMobile from './eden-residence-garden-building-family.jpeg';
import closing from './eden-residence-exterior-brand-sign.jpeg';
import apartmentTwo from './eden-residence-pedestrian-access.jpeg';
import apartmentThree from './eden-residence-private-garden-terrace.jpeg';
import type { ImageMetadata } from 'astro';
import type { Locale } from '../../i18n/ui';

interface RenderAsset { image: ImageMetadata; alt: Record<Locale, string> }

// Byte-for-byte source copies from public/renders; Astro generates separate derivatives.
export const homeRenders = {
  hero: { image: hero, alt: { ro: 'Randare a arhitecturii Eden Residence, cu fațade de cărămidă, balcoane și vegetație.', en: 'Render of Eden Residence architecture, with brick façades, balconies and planting.' } },
  heroMobile: { image: heroMobile, alt: { ro: 'Randare a clădirii văzute din grădină, cu arbori și o familie în aer liber.', en: 'Render of the building viewed from the garden, with trees and a family outdoors.' } },
  project: { image: project, alt: { ro: 'Vedere aeriană a ansamblului Eden Residence, a grădinilor și a străzilor din jur.', en: 'Aerial view of the Eden Residence development, gardens and surrounding streets.' } },
  garden: { image: garden, alt: { ro: 'Randare a curții amenajate cu alei, straturi de flori și pavilion de ședere lângă clădiri.', en: 'Render of a landscaped courtyard with paths, flower beds and a seating pavilion beside the buildings.' } },
  walkway: { image: walkway, alt: { ro: 'Randare a aleii din grădină la apus, între vegetație și clădirile rezidențiale.', en: 'Render of the garden path at sunset, between planting and residential buildings.' } },
  concept: { image: concept, alt: { ro: 'Schiță de peisaj văzută de sus, cu alei, vegetație și zone de ședere.', en: 'Overhead landscape concept sketch showing paths, planting and seating areas.' } },
  closing: { image: closing, alt: { ro: 'Randare de la stradă cu clădirile, arborii și inscripția Eden Residence.', en: 'Street-side render of the buildings, trees and Eden Residence sign.' } },
  apartmentTwo: { image: apartmentTwo, alt: { ro: 'Vedere generală a accesului pietonal între clădirile Eden Residence, cu arbori și alei.', en: 'General development view of pedestrian access between Eden Residence buildings, with trees and paths.' } },
  apartmentThree: { image: apartmentThree, alt: { ro: 'Vedere generală a unei clădiri și a amenajării exterioare din ansamblu, privite de sus.', en: 'General development view looking down on a building and its surrounding landscaping.' } },
} as const satisfies Record<string, RenderAsset>;

export type HomeRenderName = keyof typeof homeRenders;
