# Eden Residence — project brief

## Purpose and status

Premium residential real estate presentation website in Romania, with Romanian as the primary language and English as the secondary language. The approved direction emphasizes modern architecture, energy efficiency, sustainability, and premium living. These are editorial themes, not verified technical claims or certifications.

Phases 1?2.2 established the local Astro foundation, shared design system and branded themes. Phase 3A now provides the bilingual homepage for local review using supplied architectural renders. Verified property data, final copy approval, CMS integration, forms and deployment remain deferred.

## Existing infrastructure — supplied by the owner

| Item | Supplied information |
| --- | --- |
| Public domain | `https://edenresidence.ro` |
| Hosting / control panel | Host.Age / cPanel |
| CMS | WordPress already installed at `https://edenresidence.ro/wp-admin` |
| Database | MySQL/MariaDB, managed by WordPress |
| Current CMS content | Clean installation; no important content |
| Possible later CMS location | `https://cms.edenresidence.ro` — not approved or configured |

Do not reinstall, migrate, modify, or deploy to this infrastructure in Phase 1. The frontend must not connect directly to MySQL. The production configuration has not been audited or changed.

## Approved technical foundation

- Astro with static site generation and strict TypeScript.
- Tailwind CSS v4 via the official `@tailwindcss/vite` plugin, plus custom CSS where clearer.
- Vanilla JS/TS for future interactions; no additional frontend framework.
- npm, a dependency lockfile, and local Git version control.
- WordPress REST API for a future content integration, not implemented now.
- Modular boundaries for possible Three.js or GSAP later; neither is installed.

## Intended page content

| Page / content | Planned sections |
| --- | --- |
| Home | Architectural hero, introduction, key benefits, apartment previews, passive building concept, contact calls to action |
| About the project | Presentation, architecture/concept, verified building information |
| Apartments | Overview; two-room and three-room details; technical specifications, surface areas, galleries, PDF floor plans, inquiry actions |
| Passive building | Concept, verified energy-efficiency and comfort information |
| Benefits | Residential benefits, owner-approved payment methods, verified energy information |
| Contact | Approved contact/company information, location, secure contact form, reusable inquiry modal |
| Supporting content | FAQ, partners, Terms and Conditions, privacy/GDPR information, cookie policy, company identification |

Each content page needs Romanian and English versions with localized URLs. Only the two homepage routes exist as of Phase 3A; dedicated pages remain future work.

## Ownership of content and presentation

WordPress will manage editable page text, apartments, images, galleries, PDF plans, benefits, FAQs, partners, contact information, and SEO metadata. Astro will manage layouts, reusable components, navigation structure, localized routes, responsive styles, animation, and static output.

Never invent measurements, prices, apartment availability, payment terms, company details, legal text, energy performance, or passive-building certification. The owner must supply and approve factual content and translations.

## Brand input

Brand: Eden Residence. Primary font: Quicksand. References: RAL 9001 cream, RAL 6005 dark green, RAL 5026 blue, RAL 7016 anthracite, RAL 2013 copper, RAL 1032 yellow. These are supplied references; no authoritative digital palette is established.

The intended aesthetic is natural, elegant, minimal, architectural, spacious, image-led, and mobile-first, with restrained interactions. The concept board and 19 architectural renders have now been supplied and inspected. Five renders are used in Phase 3A; watermarks remain intact. The digital palette remains provisional.

`https://nord-one.ro/` is inspiration only. Its content, visual composition, branding, code, and assets must not be copied. The reference could not be retrieved during initialization; no design conclusions were drawn from it.

## Definition of Phase 1 completion

Astro can serve locally; Tailwind utilities compile; strict type checking and a production build are executed; the requested project structure and documentation exist; Git is initialized; launch instructions are available. Production WordPress remains untouched. Stop after reporting verification and open decisions.
