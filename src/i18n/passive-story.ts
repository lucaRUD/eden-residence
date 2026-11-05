import type { Locale } from './ui';
import { passivePaths } from './passive-building';

export interface PassiveStoryTitle {
  text: string;
  lines: readonly [string, string];
}

export interface PassiveStoryPrinciple {
  id: 'insulation' | 'windows' | 'airtightness' | 'ventilation' | 'thermal-bridges';
  label: string;
  headline: string;
  lines: readonly [string, string];
  description: string;
}

export interface PassiveStoryCopy {
  eyebrow: string;
  intro: string;
  opening: PassiveStoryTitle;
  architecture: PassiveStoryTitle;
  principlesHeading: PassiveStoryTitle;
  principles: readonly [PassiveStoryPrinciple, PassiveStoryPrinciple, PassiveStoryPrinciple, PassiveStoryPrinciple, PassiveStoryPrinciple];
  closing: PassiveStoryTitle;
  action: { label: string; href: string };
}

export const passiveStoryCopy = {
  ro: {
    eyebrow: 'Eden Residence / Filosofia confortului',
    intro: 'Principiile construcției pasive privesc locuința ca pe un întreg: anvelopă, lumină și aer proaspăt. O perspectivă asupra confortului de zi cu zi.',
    opening: {
      text: 'CONFORTUL NU E ÎNTÂMPLĂTOR.',
      lines: ['CONFORTUL NU E', 'ÎNTÂMPLĂTOR.'],
    },
    architecture: {
      text: 'MAI MULT DECÂT O CLĂDIRE.',
      lines: ['MAI MULT DECÂT', 'O CLĂDIRE.'],
    },
    principlesHeading: {
      text: 'PERFORMANȚĂ PRIN DETALII.',
      lines: ['PERFORMANȚĂ', 'PRIN DETALII.'],
    },
    principles: [
      {
        id: 'insulation',
        label: 'Izolație termică',
        headline: 'CĂLDURA RĂMÂNE.',
        lines: ['CĂLDURA', 'RĂMÂNE.'],
        description: 'Ajută la păstrarea căldurii iarna și limitează transferul de căldură în zilele calde.',
      },
      {
        id: 'windows',
        label: 'Ferestre performante',
        headline: 'LUMINĂ. FĂRĂ COMPROMIS.',
        lines: ['LUMINĂ.', 'FĂRĂ COMPROMIS.'],
        description: 'Aduc lumină în interior, cu atenție la pierderile de căldură și confortul din apropierea ferestrei.',
      },
      {
        id: 'airtightness',
        label: 'Etanșeitate',
        headline: 'CONFORT SUB CONTROL.',
        lines: ['CONFORT', 'SUB CONTROL.'],
        description: 'Reduce curenții de aer nedoriți, în timp ce ventilația reînnoiește controlat aerul.',
      },
      {
        id: 'ventilation',
        label: 'Ventilație cu recuperare de căldură',
        headline: 'AER PROASPĂT. CONSTANT.',
        lines: ['AER PROASPĂT.', 'CONSTANT.'],
        description: 'Aerul proaspăt intră, aerul folosit pleacă, iar o parte din căldură este recuperată.',
      },
      {
        id: 'thermal-bridges',
        label: 'Reducerea punților termice',
        headline: 'DETALII CARE CONTEAZĂ.',
        lines: ['DETALII CARE', 'CONTEAZĂ.'],
        description: 'Continuitatea protecției termice limitează punctele reci și pierderile de căldură la îmbinări.',
      },
    ],
    closing: {
      text: 'UN ALT FEL DE A LOCUI.',
      lines: ['UN ALT FEL', 'DE A LOCUI.'],
    },
    action: { label: 'Descoperă blocul pasiv', href: passivePaths.ro },
  },
  en: {
    eyebrow: 'Eden Residence / A philosophy of comfort',
    intro: 'Passive design considers the home as a whole: its envelope, daylight and fresh air. A considered approach to everyday comfort.',
    opening: {
      text: 'COMFORT IS NO ACCIDENT.',
      lines: ['COMFORT IS', 'NO ACCIDENT.'],
    },
    architecture: {
      text: 'MORE THAN A BUILDING.',
      lines: ['MORE THAN', 'A BUILDING.'],
    },
    principlesHeading: {
      text: 'PERFORMANCE IN THE DETAILS.',
      lines: ['PERFORMANCE', 'IN THE DETAILS.'],
    },
    principles: [
      {
        id: 'insulation',
        label: 'Thermal insulation',
        headline: 'WARMTH STAYS.',
        lines: ['WARMTH', 'STAYS.'],
        description: 'Helps retain warmth in winter and limits heat transfer on warmer days.',
      },
      {
        id: 'windows',
        label: 'High-performance windows',
        headline: 'LIGHT. NO COMPROMISE.',
        lines: ['LIGHT.', 'NO COMPROMISE.'],
        description: 'Bring daylight indoors, with attention to heat loss and comfort close to the glass.',
      },
      {
        id: 'airtightness',
        label: 'Airtightness',
        headline: 'COMFORT UNDER CONTROL.',
        lines: ['COMFORT', 'UNDER CONTROL.'],
        description: 'Reduces unwanted draughts while controlled ventilation renews the air.',
      },
      {
        id: 'ventilation',
        label: 'Heat-recovery ventilation',
        headline: 'FRESH AIR. CONSTANTLY.',
        lines: ['FRESH AIR.', 'CONSTANTLY.'],
        description: 'Fresh air comes in, used air goes out, and some of its warmth is recovered.',
      },
      {
        id: 'thermal-bridges',
        label: 'Reduced thermal bridges',
        headline: 'DETAILS THAT MATTER.',
        lines: ['DETAILS', 'THAT MATTER.'],
        description: 'Continuous thermal protection limits cold spots and heat loss at junctions.',
      },
    ],
    closing: {
      text: 'ANOTHER WAY TO LIVE.',
      lines: ['ANOTHER WAY', 'TO LIVE.'],
    },
    action: { label: 'Discover the passive building', href: passivePaths.en },
  },
} as const satisfies Record<Locale, PassiveStoryCopy>;
