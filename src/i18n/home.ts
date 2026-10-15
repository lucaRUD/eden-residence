import type { Locale } from './ui';
import type { NavigationItem } from '../lib/navigation';

interface HeadingCopy { eyebrow: string; title: string; description: string }
interface FeatureCopy { title: string; description: string }
interface ApartmentCopy extends FeatureCopy { id: 'two-room' | 'three-room'; rooms: '02' | '03'; label: string; action: string }

export interface HomeCopy {
  meta: { title: string; description: string };
  navigation: readonly NavigationItem[];
  hero: HeadingCopy & { primaryAction: string; secondaryAction: string; imageCaption: string };
  project: HeadingCopy & { body: string; action: string; imageCaption: string };
  vision: { eyebrow: string; title: string; features: readonly FeatureCopy[] };
  gardens: HeadingCopy & { primaryCaption: string; secondaryCaption: string; detail: string };
  apartments: HeadingCopy & { categories: readonly ApartmentCopy[]; note: string };
  passive: HeadingCopy & { principles: readonly FeatureCopy[]; note: string; imageCaption: string };
  contact: HeadingCopy & { action: string; informationTitle: string; information: string; returnAction: string };
  footerNote: string;
}

// Local editorial content, awaiting owner approval. No inventory or performance data.
export const homeCopy = {
  ro: {
    meta: { title: 'Eden Residence | Acasă, în armonie cu natura', description: 'Descoperă arhitectura contemporană, grădinile și conceptul rezidențial Eden Residence.' },
    navigation: [{ label: 'Proiect', href: '#project' }, { label: 'Natură', href: '#gardens' }, { label: 'Apartamente', href: '#apartments' }, { label: 'Contact', href: '#contact' }],
    hero: {
      eyebrow: 'Arhitectură. Natură. Acasă.',
      title: 'Acasă, în armonie cu natura.',
      description: 'Descoperă Eden Residence — un proiect rezidențial în care arhitectura contemporană întâlnește spațiile verzi și confortul de zi cu zi.',
      primaryAction: 'Descoperă proiectul', secondaryAction: 'Explorează apartamentele', imageCaption: 'Eden Residence · Perspectivă exterioară',
    },
    project: {
      eyebrow: '01 / Proiectul', title: 'Un proiect construit în jurul ideii de acasă.',
      description: 'O arhitectură cu linii clare, texturi calde și un dialog firesc cu spațiul verde.',
      body: 'În imaginile de prezentare, texturile de cărămidă și accentele cu aspect de lemn se întâlnesc cu balcoane deschise și grădini amenajate. O viziune despre locuire în care clădirile și spațiile dintre ele sunt gândite împreună.',
      action: 'Descoperă viziunea', imageCaption: 'Ansamblul, privit în contextul său',
    },
    vision: {
      eyebrow: '02 / Viziunea', title: 'Un echilibru care se simte în fiecare detaliu.',
      features: [
        { title: 'Arhitectură contemporană', description: 'Volume bine definite, ritmuri ale fațadelor și texturi calde conturează identitatea vizuală a proiectului.' },
        { title: 'Spațiu pentru natură', description: 'Grădinile, aleile și zonele de ședere din randări aduc viața în aer liber în centrul conceptului.' },
        { title: 'Confort gândit responsabil', description: 'Relația dintre arhitectură, confort și utilizarea atentă a energiei este o temă de explorat în conceptul de locuire.' },
      ],
    },
    gardens: {
      eyebrow: '03 / Viața în aer liber', title: 'Mai aproape de natură, în fiecare zi.',
      description: 'Un alt ritm al zilei. O plimbare printre arbori, o pauză în grădină, un moment petrecut afară.',
      primaryCaption: 'Grădina ca spațiu de întâlnire', secondaryCaption: 'Aleile care leagă locuirea de peisaj',
      detail: 'Peisajul propus în randări îmbină vegetația, aleile și locurile de relaxare într-o continuare firească a arhitecturii.',
    },
    apartments: {
      eyebrow: '04 / Apartamente', title: 'Loc pentru felul tău de a trăi.',
      description: 'Două categorii de explorat. Începutul unei alegeri personale, în jurul ideii tale de acasă.',
      categories: [
        { id: 'two-room', rooms: '02', label: 'Camere', title: 'Apartamente cu 2 camere', description: 'Un nou început. Un spațiu al tău, de imaginat în ritmul vieții de zi cu zi.', action: 'Informații despre 2 camere' },
        { id: 'three-room', rooms: '03', label: 'Camere', title: 'Apartamente cu 3 camere', description: 'O nouă perspectivă. Mai multe posibilități de a-ți contura ideea de acasă.', action: 'Informații despre 3 camere' },
      ],
      note: 'Planurile, suprafețele și disponibilitatea vor fi prezentate după confirmarea datelor proiectului.',
    },
    passive: {
      eyebrow: '05 / Conceptul pasiv', title: 'Confortul începe cu o arhitectură gândită inteligent.',
      description: 'Principiile clădirilor pasive privesc confortul interior și eficiența energetică ca părți ale aceluiași întreg.',
      principles: [
        { title: 'O anvelopă bine gândită', description: 'Izolarea și atenția la punțile termice pot limita transferul de căldură între interior și exterior.' },
        { title: 'Aer și confort interior', description: 'Ventilarea controlată, cu recuperare de căldură, este unul dintre principiile generale ale proiectării pasive.' },
      ],
      note: 'Acestea sunt principii generale, nu specificații confirmate pentru Eden Residence. Performanța energetică și orice certificare necesită documentație verificată.',
      imageCaption: 'Studiu de peisaj · Imagine de concept',
    },
    contact: {
      eyebrow: 'Următorul pas', title: 'Descoperă viitorul tău acasă.',
      description: 'Arhitectură, natură și o nouă perspectivă asupra locuirii. Explorează posibilitățile Eden Residence.',
      action: 'Solicită informații', informationTitle: 'Informații de contact în pregătire',
      information: 'Datele de contact și modalitatea de solicitare a informațiilor vor fi publicate după confirmare. Momentan, această prezentare nu preia și nu trimite cereri.',
      returnAction: 'Revino la apartamente',
    },
    footerNote: 'Vizualizări arhitecturale cu caracter ilustrativ. Imaginile prezintă conceptul proiectului și păstrează însemnele SKY Block.',
  },
  en: {
    meta: { title: 'Eden Residence | A home in harmony with nature', description: 'Explore the contemporary architecture, gardens and residential concept of Eden Residence.' },
    navigation: [{ label: 'Project', href: '#project' }, { label: 'Gardens', href: '#gardens' }, { label: 'Apartments', href: '#apartments' }, { label: 'Contact', href: '#contact' }],
    hero: {
      eyebrow: 'Architecture. Nature. Home.', title: 'A home in harmony with nature.',
      description: 'Discover Eden Residence — a residential project where contemporary architecture meets green surroundings and everyday comfort.',
      primaryAction: 'Discover the project', secondaryAction: 'Explore apartments', imageCaption: 'Eden Residence · Exterior perspective',
    },
    project: {
      eyebrow: '01 / The project', title: 'A project built around the idea of home.',
      description: 'Clear architectural lines, warm textures and a natural dialogue with the landscape.',
      body: 'In the architectural visualisations, brick textures and timber-like accents meet open balconies and landscaped gardens. A vision of living that considers buildings and the spaces between them together.',
      action: 'Discover the vision', imageCaption: 'The development in its surroundings',
    },
    vision: {
      eyebrow: '02 / The vision', title: 'A sense of balance in every detail.',
      features: [
        { title: 'Contemporary architecture', description: 'Defined volumes, a rhythm of façades and warm textures shape the visual identity of the project.' },
        { title: 'Room for nature', description: 'The gardens, paths and seating areas shown in the renders place outdoor living at the heart of the concept.' },
        { title: 'Thoughtful residential design', description: 'The relationship between architecture, comfort and careful energy use is a theme to explore within the residential concept.' },
      ],
    },
    gardens: {
      eyebrow: '03 / Outdoor living', title: 'Closer to nature, every day.',
      description: 'A different rhythm to the day. A walk beneath the trees, a pause in the garden, a moment spent outdoors.',
      primaryCaption: 'The garden as a place to come together', secondaryCaption: 'Paths connecting home and landscape',
      detail: 'The landscape proposed in the renders brings planting, pathways and places to unwind into a natural continuation of the architecture.',
    },
    apartments: {
      eyebrow: '04 / Apartments', title: 'Room for your way of living.',
      description: 'Two categories to explore. The beginning of a personal choice, shaped around your idea of home.',
      categories: [
        { id: 'two-room', rooms: '02', label: 'Rooms', title: 'Two-room apartments', description: 'A new beginning. A space of your own, imagined around the rhythm of everyday life.', action: 'Ask about two-room apartments' },
        { id: 'three-room', rooms: '03', label: 'Rooms', title: 'Three-room apartments', description: 'A new perspective. More possibilities for shaping your own idea of home.', action: 'Ask about three-room apartments' },
      ],
      note: 'Floor plans, areas and availability will be shared once the project information is confirmed.',
    },
    passive: {
      eyebrow: '05 / The passive concept', title: 'Comfort begins with thoughtful architecture.',
      description: 'Passive-building principles consider indoor comfort and energy efficiency as parts of the same whole.',
      principles: [
        { title: 'A considered building envelope', description: 'Insulation and attention to thermal bridges can limit heat transfer between indoors and outdoors.' },
        { title: 'Air and indoor comfort', description: 'Controlled ventilation with heat recovery is one of the general principles of passive design.' },
      ],
      note: 'These are general principles, not confirmed Eden Residence specifications. Energy performance and any certification require verified documentation.',
      imageCaption: 'Landscape study · Concept image',
    },
    contact: {
      eyebrow: 'Your next step', title: 'Discover your future home.',
      description: 'Architecture, nature and a fresh perspective on living. Explore the possibilities of Eden Residence.',
      action: 'Request information', informationTitle: 'Contact information is being prepared',
      information: 'Contact details and a way to request information will be published once confirmed. This presentation does not currently collect or send inquiries.',
      returnAction: 'Back to apartments',
    },
    footerNote: 'Architectural visualisations for illustrative purposes. The images show the project concept and retain their SKY Block marks.',
  },
} as const satisfies Record<Locale, HomeCopy>;
