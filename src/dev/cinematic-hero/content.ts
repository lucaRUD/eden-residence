import type { Locale } from '../../i18n/ui';

interface CinemaCopy {
  title: string;
  description: string;
  arrival: readonly string[];
  introduction: string;
  scroll: string;
  pauseVideo: string;
  playVideo: string;
  perspective: string;
  reveal: readonly string[];
  nextLabel: string;
  nextTitle: string;
  nextDescription: string;
  returnAction: string;
}

export const cinemaCopy = {
  ro: {
    title: 'Eden Residence — O nouă perspectivă',
    description: 'Arhitectură, natură și o nouă perspectivă asupra locuirii.',
    arrival: ['Acasă, în armonie', 'cu natura.'],
    introduction: 'Arhitectura dă formă locului. Tu îi dai sens.',
    scroll: 'Explorează',
    pauseVideo: 'Pauză video',
    playVideo: 'Redă video',
    perspective: 'O nouă perspectivă',
    reveal: ['Mai aproape', 'de ceea ce contează.'],
    nextLabel: 'Dincolo de prima privire',
    nextTitle: 'Mai departe, în ritmul tău.',
    nextDescription: 'Arhitectură, natură și spațiu pentru viața de zi cu zi. Povestea Eden Residence continuă.',
    returnAction: 'Explorează Eden Residence',
  },
  en: {
    title: 'Eden Residence — A new perspective',
    description: 'Architecture, nature and a new perspective on living.',
    arrival: ['At home, in harmony', 'with nature.'],
    introduction: 'Architecture shapes a place. You give it meaning.',
    scroll: 'Scroll to explore',
    pauseVideo: 'Pause video',
    playVideo: 'Play video',
    perspective: 'A new perspective',
    reveal: ['Closer', 'to what matters.'],
    nextLabel: 'Beyond the first impression',
    nextTitle: 'Go further, at your own pace.',
    nextDescription: 'Architecture, nature and space for everyday life. The Eden Residence story continues.',
    returnAction: 'Explore Eden Residence',
  },
} as const satisfies Record<Locale, CinemaCopy>;
