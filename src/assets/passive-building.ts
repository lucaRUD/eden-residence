import type { Locale } from '../i18n/ui';
import { homeRenders } from './home/renders';

export interface PassiveImage {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  position?: string;
  mobilePosition?: string;
}

// Interior originals are served directly; exterior placements reuse existing variants.
const interior = '/renders/interior/';
export const passiveInteriors = {
  living: { src: `${interior}eden-residence-living-dining-kitchen.jpg`, width: 1536, height: 1024, position: '58% 54%', mobilePosition: '56% 55%', alt: { ro: 'Living, masă rotundă și bucătărie într-un interior Eden Residence, în tonuri calde.', en: 'Eden Residence living room, round dining table and kitchen in warm natural tones.' } },
  burgundyBathroom: { src: `${interior}eden-residence-bathroom-burgundy-shower.jpg`, width: 1107, height: 960, alt: { ro: 'Baie Eden Residence cu duș și accente burgundy.', en: 'Eden Residence bathroom with a shower and burgundy accents.' } },
  woodBathroom: { src: `${interior}eden-residence-bathroom-wood-marble.jpg`, width: 880, height: 1213, alt: { ro: 'Baie Eden Residence cu finisaje din lemn și marmură.', en: 'Eden Residence bathroom with wood and marble finishes.' } },
  bedroomShelves: { src: `${interior}eden-residence-bedroom-built-in-shelves.jpg`, width: 1264, height: 842, alt: { ro: 'Dormitor Eden Residence cu rafturi integrate.', en: 'Eden Residence bedroom with built-in shelves.' } },
  bedroomTV: { src: `${interior}eden-residence-bedroom-tv-wall.jpg`, width: 1215, height: 864, alt: { ro: 'Dormitor Eden Residence cu perete pentru televizor.', en: 'Eden Residence bedroom with a television wall.' } },
  hallway: { src: `${interior}eden-residence-hallway-bookshelf.jpg`, width: 1024, height: 1007, alt: { ro: 'Hol Eden Residence cu bibliotecă.', en: 'Eden Residence hallway with a bookshelf.' } },
  navyBedroom: { src: `${interior}eden-residence-bedroom-navy-accent.jpg`, width: 1024, height: 705, alt: { ro: 'Dormitor Eden Residence cu un accent albastru închis.', en: 'Eden Residence bedroom with a navy accent.' } },
  neutralBedroom: { src: `${interior}eden-residence-bedroom-neutral.jpg`, width: 1024, height: 689, alt: { ro: 'Dormitor Eden Residence în tonuri neutre.', en: 'Eden Residence bedroom in neutral tones.' } },
} as const satisfies Record<string, PassiveImage>;

// Restore the original image placements and their existing responsive variants.
export const passiveImages = {
  hero: homeRenders.heroMobile,
  principles: homeRenders.passive,
  winter: passiveInteriors.living,
  summer: homeRenders.garden,
  closing: homeRenders.apartmentThree,
} as const;
