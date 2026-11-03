import type { Locale } from './ui';

export const passivePaths = { ro: '/bloc-pasiv/', en: '/en/passive-building/' } as const;

export interface PassiveCopy {
  meta: { title: string; description: string };
  nav: readonly string[];
  apartments: string;
  home: string;
  hero: { eyebrow: string; lines: readonly string[]; body: string; closing: string; action: string; caption: string; notes: readonly string[] };
  principles: { eyebrow: string; title: string; intro: string; caption: string; source: string; items: readonly { title: string; text: string; detail: string }[] };
  ventilation: {
    eyebrow: string; title: string; intro: string; caption: string; description: string;
    outside: string; home: string; core: string; filter: string; energy: string;
    flows: readonly { name: string; text: string }[];
    steps: readonly { title: string; text: string }[];
  };
  comfort: { eyebrow: string; title: string; intro: string; seasons: readonly { label: string; title: string; text: string; points: readonly string[]; caption: string }[] };
  partners: { eyebrow: string; title: string; intro: string; roles: readonly { name: string; topic: string; text: string }[]; source: string };
  cta: { eyebrow: string; title: string; text: string; action: string; back: string; caption: string };
  footer: string;
}

export const passiveCopy = {
  ro: {
    meta: { title: 'Bloc pasiv | Filosofia confortului — Eden Residence', description: 'Descoperă principiile construcției pasive, ventilația cu recuperare de căldură și ideile de confort din povestea Eden Residence.' },
    nav: ['Filosofie', 'Principii', 'Aer proaspăt', 'Confort', 'Parteneri'], apartments: 'Apartamente', home: 'Eden Residence',
    hero: {
      eyebrow: '01 / Filosofia construcției pasive', lines: ['Confortul începe', 'cu felul în care', 'construim.'],
      body: 'O locuință se simte în fiecare zi. În temperatura suprafețelor, în aerul pe care îl respiri, în felul în care interiorul răspunde anotimpurilor.',
      closing: 'Povestea pasivă a Eden Residence pornește de aici: mai multă atenție pentru relația dintre arhitectură, energie și viața de acasă.',
      action: 'Descoperă principiile', caption: 'Eden Residence · arhitectură și viață în grădină', notes: ['Confort termic', 'Aer proaspăt', 'Eficiență energetică'],
    },
    principles: {
      eyebrow: '02 / Cinci principii. Un singur întreg.', title: 'Detaliile lucrează împreună.',
      intro: 'Standardul Passive House privește clădirea ca pe un sistem. Anvelopa și instalațiile se completează, în loc să compenseze una pierderile celeilalte.',
      caption: 'Arhitectura Eden Residence · o privire asupra ansamblului', source: 'Despre principiile Passive House',
      items: [
        { title: 'Izolație termică', text: 'O anvelopă bine izolată limitează transferul de căldură. Ajută interiorul să păstreze căldura iarna și să se protejeze de aporturile nedorite vara.', detail: 'Continuitate, înainte de toate.' },
        { title: 'Ferestre performante', text: 'Geamul, rama și montajul formează un singur detaliu. Performanța lor influențează pierderile de energie și temperatura suprafețelor din apropierea ferestrei.', detail: 'Lumină, cu grijă pentru confort.' },
        { title: 'Etanșeitate la aer', text: 'Un strat de etanșare continuu reduce infiltrațiile necontrolate. Aerul proaspăt este adus printr-un sistem de ventilație proiectat pentru acest rol.', detail: 'Aerul circulă pe trasee gândite.' },
        { title: 'Punți termice reduse', text: 'Îmbinările dintre elemente cer aceeași atenție ca suprafețele mari. Continuitatea protecției termice limitează pierderile locale și suprafețele reci.', detail: 'Precizie la fiecare întâlnire.' },
        { title: 'Ventilație cu recuperare', text: 'Aerul proaspăt intră controlat, iar aerul folosit este evacuat. Recuperarea unei părți din energia termică reduce pierderile asociate schimbului de aer.', detail: 'Reînnoim aerul. Păstrăm energie.' },
      ],
    },
    ventilation: {
      eyebrow: '03 / Aerul, explicat simplu', title: 'Aer nou. Căldură recuperată.',
      intro: 'Ventilația cu recuperare de căldură aduce aer din exterior și evacuează aerul folosit. În exemplul de iarnă de mai jos, căldura trece între două circuite separate.',
      caption: 'Schemă conceptuală de iarnă cu schimbător în plăci. Traseele și pozițiile sunt ilustrative, nu un plan al instalației Eden Residence.',
      description: 'Aerul exterior trece prin filtru și prin schimbător, apoi ajunge în spațiile de locuit. Aerul extras din baie și bucătărie cedează căldură în schimbător și este evacuat afară. În această schemă, energia se transferă între trasee, fără amestecarea fluxurilor de aer.',
      outside: 'Exterior', home: 'Locuință', core: 'Schimbător', filter: 'Filtru', energy: 'Transfer termic',
      flows: [
        { name: 'Aer exterior', text: 'Intră din afară, către filtru.' },
        { name: 'Aer introdus', text: 'Ajunge în living și dormitoare.' },
        { name: 'Aer extras', text: 'Pleacă din baie și bucătărie.' },
        { name: 'Aer evacuat', text: 'Este eliminat în exterior.' },
      ],
      steps: [
        { title: 'Aerul proaspăt intră.', text: 'Aerul exterior este filtrat și condus spre spațiile de locuit. Ventilația controlată este diferită de recircularea aceluiași aer în încăpere.' },
        { title: 'Aerul folosit pleacă.', text: 'Un traseu separat extrage aerul din spațiile în care se acumulează mirosuri și umiditate. Schimbul de aer este organizat, nu lăsat în seama infiltrațiilor.' },
        { title: 'Energia are un alt traseu.', text: 'În schimbătorul ilustrat, aerul extras încălzește prin plăci aerul proaspăt care intră. Cele două fluxuri rămân separate. Recuperarea de căldură nu înlocuiește încălzirea sau răcirea.' },
      ],
    },
    comfort: {
      eyebrow: '04 / Confort, în fiecare anotimp', title: 'Același echilibru. Alte anotimpuri.',
      intro: 'Confortul nu înseamnă doar temperatura aerului. Contează și suprafețele din jur, soarele, umiditatea și modul în care locuința este folosită.',
      seasons: [
        { label: 'Iarna', title: 'Căldura merită păstrată.', text: 'O anvelopă atent proiectată și ferestre performante reduc pierderile. Suprafețele interioare mai temperate susțin confortul, alături de o încălzire dimensionată după necesarul real.', points: ['Pierderi reduse prin anvelopă', 'Mai puține suprafețe reci', 'Recuperarea căldurii din aerul extras'], caption: 'Eden Residence · fațade, lumină și spațiu exterior' },
        { label: 'Vara', title: 'Răcoarea se proiectează.', text: 'Umbrirea și limitarea aporturilor solare sunt punctul de plecare. Pentru Eden Residence, Alpha Home prezintă public un concept de răcire prin pardoseală, completat de ventilație.', points: ['Umbrire și controlul aporturilor solare', 'Ventilație pentru reînnoirea aerului', 'Răcire radiantă corelată cu umiditatea și punctul de rouă'], caption: 'Eden Residence · grădini și spații de răgaz' },
      ],
    },
    partners: {
      eyebrow: '05 / Parteneri & know-how', title: 'O viziune. Competențe care se completează.',
      intro: 'În comunicările Alpha Home despre Eden Residence, soluțiile tehnice sunt explicate prin oamenii și companiile din spatele lor.',
      roles: [
        { name: 'Alpha Home', topic: 'Concept pasiv', text: 'Prezintă principiile de proiectare și conversațiile tehnice despre proiect.' },
        { name: 'Sistema', topic: 'Ventilație & instalații termice', text: 'Este menționată pentru ventilația cu recuperare și instalațiile termice.' },
        { name: 'Ortosil', topic: 'Protecție la apă', text: 'Hidroizolația lichidă apare în prezentările publice ale proiectului.' },
      ],
      source: 'Conversațiile tehnice Alpha Home',
    },
    cta: { eyebrow: 'De la principii, la viața de acasă', title: 'Mai departe, spațiul tău.', text: 'Descoperă arhitectura, grădinile și tipologiile de apartamente Eden Residence. Găsește perspectiva din care începe povestea ta.', action: 'Explorează apartamentele', back: 'Înapoi la Eden Residence', caption: 'Eden Residence · o perspectivă asupra locuirii' },
    footer: 'Eden Residence · arhitectură, natură și o perspectivă atentă asupra confortului.',
  },
  en: {
    meta: { title: 'Passive building | A philosophy of comfort — Eden Residence', description: 'Explore passive construction principles, heat-recovery ventilation and the thinking about comfort behind Eden Residence.' },
    nav: ['Philosophy', 'Principles', 'Fresh air', 'Comfort', 'Partners'], apartments: 'Apartments', home: 'Eden Residence',
    hero: {
      eyebrow: '01 / A passive approach to building', lines: ['Comfort begins', 'with how', 'we build.'],
      body: 'A home is something you feel every day. In the temperature of its surfaces, the air you breathe, and the way the interior responds to the seasons.',
      closing: 'At Eden Residence, the story starts here: with closer attention to the relationship between architecture, energy and life at home.',
      action: 'Discover the principles', caption: 'Eden Residence · architecture and life in the garden', notes: ['Thermal comfort', 'Fresh air', 'Energy efficiency'],
    },
    principles: {
      eyebrow: '02 / Five principles. One whole.', title: 'Details that work together.',
      intro: 'The Passive House standard considers a building as a system. Its envelope and services complement each other, rather than compensating for each other’s losses.',
      caption: 'Eden Residence architecture · a view of the development', source: 'About Passive House principles',
      items: [
        { title: 'Thermal insulation', text: 'A well-insulated envelope limits heat transfer. It helps retain warmth in winter and protect the interior from unwanted heat gains in summer.', detail: 'Continuity comes first.' },
        { title: 'High-performance windows', text: 'Glazing, frames and installation form one detail. Their quality influences energy losses and the temperature of surfaces close to the window.', detail: 'Daylight, with comfort in mind.' },
        { title: 'Airtight construction', text: 'A continuous airtight layer reduces uncontrolled leakage. Fresh air is supplied through a ventilation system designed for that purpose.', detail: 'Air follows a considered route.' },
        { title: 'Reduced thermal bridges', text: 'Junctions deserve the same attention as large surfaces. Continuous thermal protection limits local heat losses and cold spots.', detail: 'Precision at every connection.' },
        { title: 'Heat-recovery ventilation', text: 'Fresh air enters in a controlled way while used air is removed. Recovering some of its thermal energy reduces losses associated with air exchange.', detail: 'Renew the air. Retain energy.' },
      ],
    },
    ventilation: {
      eyebrow: '03 / A clearer picture of fresh air', title: 'New air. Recovered warmth.',
      intro: 'Heat-recovery ventilation brings in outside air and removes used air. In the winter example below, heat passes between two separate air circuits.',
      caption: 'Conceptual winter diagram with a plate exchanger. Routes and positions are illustrative, not an Eden Residence installation plan.',
      description: 'Outside air passes through a filter and heat exchanger, then reaches living spaces. Air extracted from bathrooms and kitchens gives up heat in the exchanger before it leaves the building. In this diagram, energy transfers between the routes without mixing the air streams.',
      outside: 'Outside', home: 'Home', core: 'Exchanger', filter: 'Filter', energy: 'Heat transfer',
      flows: [
        { name: 'Outdoor air', text: 'Enters from outside, towards the filter.' },
        { name: 'Supply air', text: 'Reaches living rooms and bedrooms.' },
        { name: 'Extract air', text: 'Leaves bathrooms and kitchens.' },
        { name: 'Exhaust air', text: 'Is discharged to the outside.' },
      ],
      steps: [
        { title: 'Fresh air comes in.', text: 'Outside air is filtered and directed towards living spaces. Controlled ventilation is different from circulating the same air around a room.' },
        { title: 'Used air goes out.', text: 'A separate route extracts air from spaces where odours and moisture build up. Air exchange is planned, rather than relying on uncontrolled leakage.' },
        { title: 'Energy takes another route.', text: 'In the illustrated exchanger, extracted air warms the incoming fresh air through plates. The air streams remain separate. Heat recovery does not replace heating or cooling.' },
      ],
    },
    comfort: {
      eyebrow: '04 / Comfort, through the seasons', title: 'The same balance. A different season.',
      intro: 'Comfort is about more than air temperature. Surrounding surfaces, sunlight, humidity and the way a home is used all play a part.',
      seasons: [
        { label: 'Winter', title: 'Warmth worth keeping.', text: 'A carefully designed envelope and high-performance windows reduce heat loss. More temperate interior surfaces support comfort, alongside heating sized for the actual demand.', points: ['Reduced losses through the envelope', 'Fewer cold surfaces', 'Heat recovered from extracted air'], caption: 'Eden Residence · façades, daylight and outdoor space' },
        { label: 'Summer', title: 'Cooling starts with design.', text: 'Shading and limiting solar gains come first. For Eden Residence, Alpha Home publicly describes an underfloor-cooling concept complemented by ventilation.', points: ['Shading and solar-gain control', 'Ventilation to renew the air', 'Radiant cooling coordinated with humidity and dew point'], caption: 'Eden Residence · gardens and places to pause' },
      ],
    },
    partners: {
      eyebrow: '05 / Partners & know-how', title: 'One vision. Complementary expertise.',
      intro: 'Alpha Home’s communications about Eden Residence introduce technical ideas through the people and companies behind them.',
      roles: [
        { name: 'Alpha Home', topic: 'Passive design thinking', text: 'Presents design principles and technical conversations about the project.' },
        { name: 'Sistema', topic: 'Ventilation & thermal installations', text: 'Named in connection with heat-recovery ventilation and thermal installations.' },
        { name: 'Ortosil', topic: 'Water protection', text: 'Liquid waterproofing appears in public presentations about the project.' },
      ],
      source: 'Alpha Home’s technical conversations',
    },
    cta: { eyebrow: 'From principles to life at home', title: 'Next, your own space.', text: 'Explore Eden Residence architecture, gardens and apartment types. Find the perspective from which your own story begins.', action: 'Explore the apartments', back: 'Back to Eden Residence', caption: 'Eden Residence · a perspective on living' },
    footer: 'Eden Residence · architecture, nature and a considered approach to comfort.',
  },
} as const satisfies Record<Locale, PassiveCopy>;
