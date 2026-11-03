import type { Locale } from './ui';

type GalleryHeadline = readonly [string, string];

export interface InteriorGalleryRoomCopy {
  label: string;
  lines: GalleryHeadline;
  description: string;
  caption: string;
  alt: string;
}

export interface InteriorGalleryCopy {
  eyebrow: string;
  intro: { lines: GalleryHeadline; description: string };
  expanded: { lines: GalleryHeadline };
  split: { lines: GalleryHeadline; description: string };
  rooms: readonly [InteriorGalleryRoomCopy, InteriorGalleryRoomCopy, InteriorGalleryRoomCopy];
}

export const interiorGalleryCopy = {
  ro: {
    eyebrow: 'Eden Residence / Interioare',
    intro: {
      lines: ['SPAȚII PENTRU', 'VIAȚA TA.'],
      description: 'O perspectivă asupra locului în care începe și se întoarce fiecare zi.',
    },
    expanded: { lines: ['LOC PENTRU MOMENTELE', 'CARE CONTEAZĂ.'] },
    split: {
      lines: ['FIECARE DETALIU', 'CONTEAZĂ.'],
      description: 'Lumina, proporțiile și texturile se întâlnesc într-un spațiu pe care îl faci al tău.',
    },
    rooms: [
      {
        label: 'Împreună',
        lines: ['LOC PENTRU MOMENTELE', 'CARE CONTEAZĂ.'],
        description: 'O masă împreună. O conversație care continuă. Momentele simple dau sens locului de acasă.',
        caption: 'Living · dining · bucătărie',
        alt: 'Interior Eden Residence cu living, masă rotundă și bucătărie, în tonuri calde.',
      },
      {
        label: 'Răgaz',
        lines: ['LINIȘTEA ARE', 'LOCUL EI.'],
        description: 'La capătul zilei, un spațiu pentru tine. Un alt ritm, mai aproape de lucrurile care îți fac bine.',
        caption: 'Dormitor · accente bleumarin',
        alt: 'Dormitor Eden Residence cu un accent bleumarin.',
      },
      {
        label: 'Echilibru',
        lines: ['CONFORT ÎN FIECARE', 'DETALIU.'],
        description: 'Tonuri calme și loc pentru gesturile de zi cu zi. O idee de confort pe care o completezi în felul tău.',
        caption: 'Dormitor · tonuri neutre',
        alt: 'Dormitor Eden Residence amenajat în tonuri neutre.',
      },
    ],
  },
  en: {
    eyebrow: 'Eden Residence / Interiors',
    intro: {
      lines: ['SPACES FOR', 'YOUR LIFE.'],
      description: 'A glimpse of the place where each day begins, and where you return.',
    },
    expanded: { lines: ['ROOM FOR THE MOMENTS', 'THAT MATTER.'] },
    split: {
      lines: ['EVERY DETAIL', 'MATTERS.'],
      description: 'Light, proportions and textures come together in a space you make your own.',
    },
    rooms: [
      {
        label: 'Together',
        lines: ['ROOM FOR THE MOMENTS', 'THAT MATTER.'],
        description: 'A shared meal. A conversation that carries on. Simple moments give meaning to home.',
        caption: 'Living · dining · kitchen',
        alt: 'Eden Residence interior with a living room, round dining table and kitchen in warm tones.',
      },
      {
        label: 'Unwind',
        lines: ['CALM HAS', 'ITS OWN PLACE.'],
        description: 'At the end of the day, a space for yourself. A gentler rhythm, closer to what makes you feel at home.',
        caption: 'Bedroom · navy accents',
        alt: 'Eden Residence bedroom with a navy accent.',
      },
      {
        label: 'Balance',
        lines: ['COMFORT IN', 'EVERY DETAIL.'],
        description: 'Quiet tones and room for everyday rituals. An idea of comfort, completed in your own way.',
        caption: 'Bedroom · neutral tones',
        alt: 'Eden Residence bedroom in neutral tones.',
      },
    ],
  },
} as const satisfies Record<Locale, InteriorGalleryCopy>;
