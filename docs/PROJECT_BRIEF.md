# Eden Residence — project brief

## Purpose and status

Premium residential real estate presentation website in Romania, with Romanian as the primary language and English as the secondary language. The approved direction emphasizes modern architecture, energy efficiency, sustainability, and premium living. These are editorial themes, not verified technical claims or certifications.

The local Astro foundation, shared design system, branded light/dark themes and bilingual homepage are implemented for review using supplied architectural renders and logos. The six homepage chapters include one featured passive concept and two apartment categories. Verified property data, final visual/copy approval, CMS integration, forms and deployment remain deferred.

## Existing infrastructure — supplied by the owner

| Item | Supplied information |
| --- | --- |
| Public domain | `https://edenresidence.ro` |
| Hosting / control panel | Host.Age / cPanel |
| CMS | WordPress already installed at `https://edenresidence.ro/wp-admin` |
| Database | MySQL/MariaDB, managed by WordPress |
| Current CMS content | Clean installation; no important content |
| Possible later CMS location | `https://cms.edenresidence.ro` — not approved or configured |

Do not reinstall, migrate, modify or deploy to this infrastructure without explicit approval. The frontend must not connect directly to MySQL. The production configuration has not been audited or changed.

## Approved technical foundation

- Astro with static site generation and strict TypeScript.
- Tailwind CSS v4 via the official `@tailwindcss/vite` plugin, plus custom CSS where clearer.
- Vanilla JS/TS for interactions; no additional frontend framework.
- npm, a dependency lockfile, and local Git version control.
- WordPress REST API for a future content integration, not implemented now.
- Homepage-only GSAP/ScrollTrigger as progressive enhancement, with a static baseline and reduced-motion support. Three.js is not installed.

## Intended page content

| Page / content | Planned sections |
| --- | --- |
| Home | Architectural hero, featured passive concept, project introduction, apartment categories, gardens and contact calls to action |
| About the project | Presentation, architecture/concept, verified building information |
| Apartments | Overview; two-room and three-room details; technical specifications, surface areas, galleries, PDF floor plans, inquiry actions |
| Passive building | Concept, verified energy-efficiency and comfort information |
| Benefits | Residential benefits, owner-approved payment methods, verified energy information |
| Contact | Approved contact/company information, location, secure contact form, reusable inquiry modal |
| Supporting content | FAQ, partners, Terms and Conditions, privacy/GDPR information, cookie policy, company identification |

Each content page needs Romanian and English versions with localized URLs. Only the two homepage routes exist; dedicated pages remain future work.

## Ownership of content and presentation

WordPress will manage editable page text, apartments, images, galleries, PDF plans, benefits, FAQs, partners, contact information, and SEO metadata. Astro will manage layouts, reusable components, navigation structure, localized routes, responsive styles, animation, and static output.

Never invent measurements, prices, apartment availability, payment terms, company details, legal text, energy performance, or passive-building certification. The owner must supply and approve factual content and translations. The client-supplied “Primul bloc pasiv din România” / “Romania's first passive residential building” positioning and supporting line are centralized in `src/i18n/home.ts`, visibly provisional and marked `TODO: Client verification before public launch`. National-first status, exact category, performance and certification require substantiation before publication.

## Brand input

Brand: Eden Residence. Primary font: Quicksand. References: RAL 9001 cream, RAL 6005 dark green, RAL 5026 blue, RAL 7016 anthracite, RAL 2013 copper, RAL 1032 yellow. These are supplied references; no authoritative digital palette is established.

The intended aesthetic is natural, elegant, minimal, architectural, spacious, image-led, and mobile-first, with restrained interactions. The concept board and 19 architectural renders have now been supplied and inspected. The current image pipeline selects nine sources including the mobile hero alternate; watermarks remain intact. The digital palette remains provisional.

`https://nord-one.ro/` is inspiration only. Its content, visual composition, branding, code, and assets must not be copied. The repository has no local Nord One reference folder; genuine owner-supplied references must be preserved.

## Working scope

Continue in the existing project and preserve functionality, themes, localization and supplied assets. Use the maintained architecture, design-system and implementation-plan docs for context. Follow [AGENTS.md](../AGENTS.md) for focused development, verification and artifact handling. Additional pages, CMS work and launch require their own approved tasks.
