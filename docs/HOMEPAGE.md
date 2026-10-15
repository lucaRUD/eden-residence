# Phase 3A — homepage review

Implemented locally on 2026-10-15 with Node 24.22.0 / npm 11.19.1. Romanian remains `/`; English remains `/en/`. No additional production page, CMS connection, form processor, dependency, deployment or commit was introduced.

## Review locally

```powershell
npm.cmd run dev
```

Use the printed port, normally:

- Romanian: <http://localhost:4321/>
- English: <http://localhost:4321/en/>
- Development design system: <http://localhost:4321/design-system/>

Temporary QA servers and the isolated headless browser are stopped after verification. Start the dev command above for review. Both homepages retain `noindex, nofollow`; launch SEO is deferred. The design-system route remains registered only for `astro dev`.

## Sections and imagery

All filenames below start with `eden-residence-`. The supplied originals actually live in `public/renders/`, rather than `public/images/renders/` named in the brief and render README. All 19 were inspected in a contact sheet; the manifest was read before selection.

| Section / anchor | Treatment | Render filename suffix |
| --- | --- | --- |
| Hero | Editorial text/image split, one H1, two anchor CTAs | `exterior-street-corner.jpeg` |
| Project / `#project` | Large aerial overview beside introduction | `aerial-building-overview.jpeg` |
| Why / `#vision` | Three numbered themes with rules and open spacing | None |
| Green living / `#gardens` | Large courtyard and smaller walkway in an asymmetrical composition | `landscaped-courtyard.jpeg`, `garden-family-walkway.jpeg` |
| Apartments / `#apartments` | Two-room and three-room typographic previews with distinct copper/green numerals | None; no invented interiors or plans |
| Passive concept / `#passive-concept` | General principles beside an explicitly captioned landscape study | `landscape-concept-sketch.jpeg` |
| Final CTA / `#contact` | Shared branded CTA, leading to honest contact information placeholder | None |

The landscape sketch illustrates the outdoor concept, not a technical passive-building diagram. Contact/category actions reach `#contact-information`, which clearly explains that contact details and inquiry handling are pending. No data is collected or submitted. The introduction links to the meaningful `#vision` section; navigation and footer use existing section anchors. Language links use the existing localized home routes.

## Composition and implementation

Quicksand, the existing fixed brand colors and light/dark preference architecture are preserved. Image frames retain their entire original aspect ratio: no stretch, overlay text, cropped credit, rounded image-card treatment, slider or image repetition. Desktop split layouts become a linear mobile reading order. Gardens use unequal image widths and a staggered secondary image; feature themes use typography and rules instead of generic cards.

The shared `Section` adds a deliberate `contrast` tone: cream background with green foregrounds/actions/focus in either theme. Apartments use this role to create a warm pause in dark mode. Existing `cream` behavior is unchanged. Other sections use existing theme background/surface/brand roles. No new raw colors were added. The shared wordmark's clickable area now has the existing 44px minimum control height.

`src/i18n/home.ts` centralizes typed RO/EN copy, apartment categories and section navigation. `src/assets/home/renders.ts` separately defines image imports and localized alt text. `HomePage.astro` composes presentation sections and the existing Header, Footer, Button, Container, Section, SectionHeading and CTASection. Content can later be supplied from validated CMS data without mixing fetch logic into those sections. No CMS abstraction was built.

Five JPEGs were copied byte-for-byte into `src/assets/home/` to use the installed Astro image pipeline, following [Astro's local image guidance](https://docs.astro.build/en/guides/images/#src-vs-public). SHA-256 comparisons confirmed each source copy matches its supplied public original. Originals and visible SKY Block marks remain intact. Astro generates 20 WebP derivatives at quality 85: 480, 768, 1120 and original width (1475 or 1600px). The hero uses eager/high-priority loading; four later images use lazy loading. Images include dimensions, localized alt text and responsive `sizes`/`srcset`.

General insulation, thermal-bridge and heat-recovery copy was checked against the [Passive House Institute's principles](https://passivehouse.com/en/home/building-certification/). It is not evidence of Eden Residence specifications, energy performance or certification; the on-page caveat states this in both languages.

## Files created

- `src/i18n/home.ts`
- `src/assets/home/renders.ts` and the five exact JPEG copies listed in the section table
- `src/styles/home.css`
- `src/components/home/HomePage.astro`
- `src/components/home/Hero.astro`
- `src/components/home/ProjectIntro.astro`
- `src/components/home/Vision.astro`
- `src/components/home/GreenLiving.astro`
- `src/components/home/ApartmentTypes.astro`
- `src/components/home/PassiveConcept.astro`
- `src/components/home/ContactCTA.astro`
- `src/components/home/RenderImage.astro`
- This review record and four screenshot artifacts under `docs/previews/phase-3a/`

## Files modified or removed

- `src/pages/index.astro`, `src/pages/en/index.astro`: render the shared homepage.
- `src/components/ui/Section.astro`, `src/styles/global.css`: semantic contrast tone and wordmark target height.
- `src/i18n/ui.ts`: remove obsolete coming-soon copy; retain shared control strings/home paths.
- `src/layouts/BaseLayout.astro`: clarify the existing local-review robots comment; metadata behavior unchanged.
- `README.md`, `docs/PROJECT_BRIEF.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/IMPLEMENTATION_PLAN.md`: current status, boundaries and review records.
- Removed `src/components/home/PlaceholderHome.astro`, which the new homepage replaces.

`public/renders/` was already present and untracked before this phase; none of its files were changed. Package manifests, lockfile, Astro config, theme scripts, development-preview implementation and WordPress boundary were not modified.

## Executed verification

- `npm.cmd run check`: passed, 35 files, zero errors/warnings/hints.
- `npm.cmd run build`: passed; exactly two static HTML pages and 20 optimized WebP variants.
- Chrome on development and final production preview: RO/EN × light/dark × 320/375/768/1024/1440 CSS-pixel viewport widths. No horizontal overflow, overflowing visible page elements, distorted images, missing fragment destinations or undersized tested header/button controls. Expanded navigation also passed at 320px. Body text remains 16px.
- Rendered text sampling: 67 samples per language/theme at desktop width, minimum 5.02:1 in all four combinations, no sampled pair below 4.5:1. Solid backgrounds were calculated from computed colors; there is no text over imagery. This is a targeted contrast check, not a full accessibility audit.
- Keyboard: Enter/Space open the mobile menu, Tab reaches the first link, Escape closes and returns focus, collapsed links leave tab order, and Space toggles the mobile theme. Visible 2px focus outlines verified on hero buttons, apartment links and final CTA in both themes, including green focus on the cream section in dark mode.
- Touch emulation opens mobile navigation. RO→EN→RO switching preserves the manual theme; both themes persist after reload. OS light/dark selection works without saved preference; manual preference overrides the opposite OS scheme.
- Early body/render observations retained the selected light/dark theme against the opposite OS setting. Without JavaScript, the OS dark background and visible navigation remain usable. This does not replace filmstrip testing on a throttled physical device.
- Activated every homepage fragment link in both languages, including category and contact CTAs, skip link, header and footer. All reached existing targets. Both language routes returned HTTP 200.
- All five selected image URLs loaded successfully with HTTP 200 and nonzero natural dimensions in both languages. Confirmed hero priority and the four later images' lazy attributes, nonempty alt text, one H1, unique IDs, resolved section labels and local-review robots metadata.
- Reduced-motion mode sets button transition durations to zero. No runtime JavaScript exceptions occurred in exercised flows.
- Development `/design-system/` and `?lang=en` returned 200; production variants returned 404. No design-system HTML was emitted.
- Source image hashes match the supplied originals. `git diff --check` passed.

## Screenshots

Full-page Romanian screenshots captured from the production build at desktop (1440px viewport) and mobile (375px viewport). Chromium may omit the scrollbar gutter from the encoded screenshot width. Desktop/mobile light and dark views were inspected; an additional English 1024px capture was inspected during QA.

- [Desktop light](previews/phase-3a/desktop-light.png)
- [Desktop dark](previews/phase-3a/desktop-dark.png)
- [Mobile light](previews/phase-3a/mobile-light.png)
- [Mobile dark](previews/phase-3a/mobile-dark.png)

## Remaining approval and limitations

- The composition, provisional digital colors, RO/EN editorial copy and translations await owner approval.
- Two-room/three-room previews are categories only. Verified areas, plans, layouts, floors, pricing, inventory and availability are not supplied or represented.
- Contact/company information and a real inquiry channel remain pending. The visible destination is intentionally informational; it cannot send a request.
- Building technologies, energy figures and certification remain unverified. No first-in-Romania claim is made.
- Original renders retain watermarks. Confirm publication rights and obtain approved final assets before launch; image colors/content were not retouched.
- Public originals, including unused renders, are still copied to build output. Homepage visitors load optimized variants, but the output directory contains those originals as well. A later approved publication cleanup can change storage without deleting the owner's assets now.
- Screen readers, Safari/Firefox, physical mobile devices and formal Lighthouse/Core Web Vitals measurements were not tested. Chrome emulation and sampled contrast do not establish full WCAG compliance or real-device performance.
- Dedicated project/apartment/passive/contact pages, WordPress, forms, launch metadata, hosting and deployment remain outside Phase 3A.

Stop after Phase 3A for owner review.
