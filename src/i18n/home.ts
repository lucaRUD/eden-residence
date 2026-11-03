import type { Locale } from './ui';
import type { NavigationItem } from '../lib/navigation';
import { passivePaths } from './passive-building';

interface HeadingCopy { eyebrow: string; title: string; description: string }
interface FeatureCopy { title: string; description: string }
interface ApartmentCopy extends FeatureCopy { id: 'two-room' | 'three-room'; rooms: '02' | '03'; label: string; action: string }

export interface HomeCopy {
  meta: { title: string; description: string };
  navigation: readonly NavigationItem[];
  hero: HeadingCopy & { primaryAction: string; secondaryAction: string };
  introduction: { lines: readonly string[]; bridge: string; imageCaption: string; next: string };
  project: HeadingCopy & { body: string; action: string; imageCaption: string };
  gardens: HeadingCopy & { primaryCaption: string; secondaryCaption: string; detail: string };
  apartments: HeadingCopy & { categories: readonly ApartmentCopy[]; note: string; imageNote: string };
  passive: HeadingCopy & { provisionalLabel: string; qualification: string; principles: readonly FeatureCopy[]; note: string; imageCaption: string; action: string; actionHref: string; pageStatus: string };
  contact: HeadingCopy & { action: string; informationTitle: string; information: string; returnAction: string };
  footerNote: string;
}

// Local editorial content, awaiting owner approval. No inventory or performance data.
export const homeCopy = {
  ro: {
    meta: { title: 'Eden Residence | Acasă, în armonie cu natura', description: 'Descoperă arhitectura contemporană, grădinile și conceptul rezidențial Eden Residence.' },
    navigation: [{ label: 'Proiect', href: '#project' }, { label: 'Bloc pasiv', href: passivePaths.ro }, { label: 'Apartamente', href: '#apartments' }, { label: 'Natură', href: '#gardens' }, { label: 'Contact', href: '#contact' }],
    hero: {
      eyebrow: 'Arhitectură. Natură. Acasă.',
      title: 'Acasă, în armonie\ncu natura.',
      description: 'Arhitectură contemporană, spații verzi și o nouă perspectivă asupra locuirii.',
      primaryAction: 'Descoperă proiectul', secondaryAction: 'Explorează apartamentele',
    },
    introduction: {
      lines: ['UN ALT FEL', 'DE A LOCUI.'],
      bridge: 'Povestea continuă cu ideea de confort și cu principiile generale ale proiectării pasive.',
      imageCaption: 'Arhitectură și peisaj, în dialog.',
      next: 'Descoperă conceptul pasiv',
    },
    project: {
      eyebrow: '02 / Proiectul', title: 'Un proiect construit în jurul ideii de acasă.',
      description: 'O arhitectură cu linii clare, texturi calde și un dialog firesc cu spațiul verde.',
      body: 'În imaginile de prezentare, texturile de cărămidă și accentele cu aspect de lemn se întâlnesc cu balcoane deschise și grădini amenajate. O viziune despre locuire în care clădirile și spațiile dintre ele sunt gândite împreună.',
      action: 'Explorează grădinile', imageCaption: 'Ansamblul, privit în contextul său',
    },
    gardens: {
      eyebrow: '04 / Viața în aer liber', title: 'Mai aproape de natură, în fiecare zi.',
      description: 'Un alt ritm al zilei. O plimbare printre arbori, o pauză în grădină, un moment petrecut afară.',
      primaryCaption: 'Grădina ca spațiu de întâlnire', secondaryCaption: 'Aleile care leagă locuirea de peisaj',
      detail: 'Peisajul propus în randări îmbină vegetația, aleile și locurile de relaxare într-o continuare firească a arhitecturii.',
    },
    apartments: {
      eyebrow: '03 / Apartamente', title: 'Loc pentru felul tău de a trăi.',
      imageNote: 'Imagini generale ale ansamblului, fără asociere cu un anumit tip de apartament.',
      description: 'Două categorii de explorat. Începutul unei alegeri personale, în jurul ideii tale de acasă.',
      categories: [
        { id: 'two-room', rooms: '02', label: 'Camere', title: 'Apartamente cu 2 camere', description: 'Un nou început. Un spațiu al tău, de imaginat în ritmul vieții de zi cu zi.', action: 'Informații despre 2 camere' },
        { id: 'three-room', rooms: '03', label: 'Camere', title: 'Apartamente cu 3 camere', description: 'O nouă perspectivă. Mai multe posibilități de a-ți contura ideea de acasă.', action: 'Informații despre 3 camere' },
      ],
      note: 'Planurile, suprafețele și disponibilitatea vor fi prezentate după confirmarea datelor proiectului.',
    },
    passive: {
      // TODO: Client verification before public launch
      // Client-supplied positioning; national-first status and exact category are unverified.
      eyebrow: '01 / Conceptul pasiv', title: 'Primul bloc pasiv din România.',
      description: 'Un nou standard de confort, eficiență energetică și arhitectură orientată spre viitor.',
      provisionalLabel: 'Mesaj propus · în curs de verificare',
      qualification: 'Formulare de marketing furnizată de client. Statutul de „primul” și categoria exactă necesită verificare înainte de publicare.',
      principles: [
        { title: 'Confort termic', description: 'O anvelopă bine izolată și atenția la punțile termice pot susține un climat interior mai stabil.' },
        { title: 'Eficiență energetică', description: 'Proiectarea pasivă urmărește limitarea necesarului de energie prin forma, orientarea și anvelopa clădirii.' },
        { title: 'Calitatea aerului interior', description: 'Ventilarea controlată, cu recuperare de căldură, este unul dintre principiile generale ale proiectării pasive.' },
      ],
      note: 'Acestea sunt principii generale, nu specificații confirmate pentru Eden Residence. Performanța energetică și orice certificare necesită documentație verificată.',
      imageCaption: 'Vedere arhitecturală a ansamblului · nu este o ilustrare tehnică a performanței',
      action: 'Explorează principiile', actionHref: '#passive-principles', pageStatus: 'Pagina dedicată conceptului pasiv este în pregătire.',
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
    navigation: [{ label: 'Project', href: '#project' }, { label: 'Passive building', href: passivePaths.en }, { label: 'Apartments', href: '#apartments' }, { label: 'Gardens', href: '#gardens' }, { label: 'Contact', href: '#contact' }],
    hero: {
      eyebrow: 'Architecture. Nature. Home.', title: 'A home in harmony\nwith nature.',
      description: 'Contemporary architecture, green surroundings and a fresh perspective on home.',
      primaryAction: 'Discover the project', secondaryAction: 'Explore apartments',
    },
    introduction: {
      lines: ['ANOTHER WAY', 'TO LIVE.'],
      bridge: 'The story continues with the idea of comfort and the general principles of passive design.',
      imageCaption: 'Architecture in dialogue with the landscape.',
      next: 'Discover the passive concept',
    },
    project: {
      eyebrow: '02 / The project', title: 'A project built around the idea of home.',
      description: 'Clear architectural lines, warm textures and a natural dialogue with the landscape.',
      body: 'In the architectural visualisations, brick textures and timber-like accents meet open balconies and landscaped gardens. A vision of living that considers buildings and the spaces between them together.',
      action: 'Explore the gardens', imageCaption: 'The development in its surroundings',
    },
    gardens: {
      eyebrow: '04 / Outdoor living', title: 'Closer to nature, every day.',
      description: 'A different rhythm to the day. A walk beneath the trees, a pause in the garden, a moment spent outdoors.',
      primaryCaption: 'The garden as a place to come together', secondaryCaption: 'Paths connecting home and landscape',
      detail: 'The landscape proposed in the renders brings planting, pathways and places to unwind into a natural continuation of the architecture.',
    },
    apartments: {
      eyebrow: '03 / Apartments', title: 'Room for your way of living.',
      imageNote: 'General development imagery, not representations of a specific apartment type.',
      description: 'Two categories to explore. The beginning of a personal choice, shaped around your idea of home.',
      categories: [
        { id: 'two-room', rooms: '02', label: 'Rooms', title: 'Two-room apartments', description: 'A new beginning. A space of your own, imagined around the rhythm of everyday life.', action: 'Ask about two-room apartments' },
        { id: 'three-room', rooms: '03', label: 'Rooms', title: 'Three-room apartments', description: 'A new perspective. More possibilities for shaping your own idea of home.', action: 'Ask about three-room apartments' },
      ],
      note: 'Floor plans, areas and availability will be shared once the project information is confirmed.',
    },
    passive: {
      // TODO: Client verification before public launch
      // Keep this provisional translation paired with the client-supplied Romanian claim.
      eyebrow: '01 / The passive concept', title: "Romania's first passive residential building",
      description: 'A new standard of comfort, energy efficiency and architecture looking towards the future.',
      provisionalLabel: 'Proposed message · verification pending',
      qualification: 'Client-supplied marketing wording. The national-first status and exact category require verification before publication.',
      principles: [
        { title: 'Thermal comfort', description: 'A well-insulated envelope and attention to thermal bridges can support a more stable indoor climate.' },
        { title: 'Energy efficiency', description: 'Passive design aims to limit energy demand through a building’s form, orientation and envelope.' },
        { title: 'Indoor air quality', description: 'Controlled ventilation with heat recovery is one of the general principles of passive design.' },
      ],
      note: 'These are general principles, not confirmed Eden Residence specifications. Energy performance and any certification require verified documentation.',
      imageCaption: 'Architectural development view · not a technical illustration of performance',
      action: 'Explore the principles', actionHref: '#passive-principles', pageStatus: 'The dedicated passive-concept page is being prepared.',
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
