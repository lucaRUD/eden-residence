# Homepage implementation and review

Current work is Phase 3D.1: tighter chapter rhythm, chapter-specific motion and an immersive apartment-category showcase. See [current findings, verification and screenshots](PHASE_3D1.md). Visual approval is pending; Phase 3D was not visually approved. The [Phase 3D implementation](PHASE_3D.md), [Phase 3C.2 composition](PHASE_3C2.md), [Phase 3C image investigation](PHASE_3C.md) and Phase 3B record below are historical. The architectural hero, contrasting panel, passive chapter and closing direction are retained.

## Phase 3B record

Implemented locally on 2026-10-15. Astro, TypeScript, Tailwind, Quicksand, the RO/EN content model and theme preference mechanism are preserved. No dependencies, CMS integration, contact processing, additional production routes, deployment or commit were introduced.

## Local review

Run `npm.cmd run dev` from the project root, then open the printed URL (normally <http://localhost:4321/> or <http://localhost:4321/en/>). The temporary QA servers/browser are stopped after verification. Both pages retain local-review `noindex, nofollow`. The design-system preview remains development-only.

## Findings before implementation

Phase 3A gave the image only about 57% of the desktop hero width. Its repeated contained columns, small apartment numerals and similar section spacing made architecture secondary to copy. Mobile placed the headline/actions before the main image. Phase 3B changes the composition of each chapter rather than only recoloring the old layout.

All 19 supplied renders were reviewed again. They live in `public/renders/`; `public/images/renders/` is absent. The requested `references/nord-one/` folder is also absent, and the live Nord One site returned HTTP 403 during the reference attempt. No unavailable screenshot was claimed as inspected. The owner's stated reference qualities guided an independent Eden composition.

## Main visual changes

- Full-width street-corner hero: at the tested 1440?1000 viewport, the image is 810px tall. A solid theme-aware headline panel occupies the roadway below the building; no text sits directly over busy photography or the credit.
- Mobile uses a closer garden-side exterior with right/bottom 4:3 framing. This retains the building and SKY Block mark. Tablet uses the full street view with a two-column text/action area below it; the overlay starts only at 1280px, after visual inspection caught the tablet panel covering the building.
- The project statement precedes an almost full-width aerial view, followed by an oversized introductory sentence and a quieter reading column.
- Benefits are numbered editorial rows with large titles and separators.
- Gardens have a full-width courtyard image and a substantial sunset companion image, with brief copy between the visual moments.
- Apartment categories are large, offset paper/forest panels with oversized 02/03 numerals. There are no unit photographs, measurements, plans or availability claims.
- The passive-concept chapter uses the existing navy reference, cream text and a clearly captioned landscape sketch. The general-principles caveat remains visible.
- The conclusion uses a large cream typographic spread, a real inquiry anchor and a full-width street-side brand render.
- The homepage masthead uses the shared Header's optional `appearance="editorial"`: quieter language selection, a control divider and unchanged accessible menu behavior. Its default appearance remains available to the design-system page.

## Render selection

Every filename below begins with `eden-residence-`. Originals and watermarks are unchanged.

| Placement | JPEG filename suffix | Treatment |
| --- | --- | --- |
| Desktop/tablet hero | `exterior-street-corner.jpeg` | Full 16:9 frame; panel overlays road at wide desktop |
| Mobile hero | `garden-building-family.jpeg` | Native picture source; right/bottom crop retains building and credit |
| Project overview | `aerial-garden-water-feature.jpeg` | Full original frame, almost page-wide |
| Primary garden | `landscaped-courtyard.jpeg` | Full-width original frame |
| Supporting garden | `garden-sunset-walkway.jpeg` | Full original frame, asymmetric reading row |
| Passive chapter | `landscape-concept-sketch.jpeg` | Landscape study, not an energy-system diagram |
| Closing chapter | `exterior-brand-sign.jpeg` | Full-width original frame |

Four new byte-identical source copies enable Astro optimization. Together with retained Phase 3A sources there are nine JPEGs under `src/assets/home/`, seven currently imported. Original source hashes match `public/renders/`. Astro emits 28 WebP derivatives, four widths per selected source, at the existing quality of 85. Browser picture selection requests one hero view, not both. Six images appear on each page: one responsive hero and five later images.

The hero is eager/high priority; all five later images remain lazy. All have explicit dimensions, localized alt text and responsive sizes/srcsets. Only the mobile hero is cropped; other images retain their complete frames. The hero's shared alt describes architecture appropriately across both views.

## Image-loading investigation

The existing Phase 3A light screenshot saved in the repository contains all five selected images. Before editing, live light/dark pages also loaded all five after normal scrolling, with HTTP 200, nonzero decoded dimensions, opacity 1 and visible display rules. No theme-specific image hiding, missing URL, network failure or JavaScript exception was found.

On the initial cold light viewport, three later images were still deferred by native lazy loading. This is consistent with a full-page screenshot taken before visiting/decoding below-fold images; it does not prove the cause of a different screenshot that was not available here. There was no confirmed frontend image defect to fix by forcing eager loading or changing theme visibility.

For Phase 3B, screenshots were captured from the production build with cache disabled. Each page was scrolled to every image, each `img.decode()` was awaited, the page returned to the top, and two animation frames passed before capture. Lazy attributes were not changed. Cold-load checks covered both languages, themes and desktop/mobile viewports. All six displayed images decoded in every case; all 28 generated WebP URLs separately returned HTTP 200 with nonempty image content. No network or runtime errors occurred.

## Content and component boundaries

`src/i18n/home.ts` is unchanged: existing content types, translations, categories and navigation destinations remain intact. Asset imports/alt text stay separate in `src/assets/home/renders.ts`. Presentation stays in the existing homepage components; no alternate theme component tree or image theme-switching script was added.

Composition tokens are scoped to `.home-page` in `src/styles/home.css`: fluid display/statement scales, chapter spacing, grid gap and paper surface. Shared global brand tokens are unchanged. The passive section locally maps the existing strong-surface role to navy; paired text/focus roles remain supplied by the shared brand context. Apartment and contact sections use existing contrast/brand contexts.

All actions go to real homepage sections or the existing localized routes. Contact/category actions still reach the honest `#contact-information` placeholder, which cannot collect/send inquiries. No future page is presented as implemented.

## Files modified

- `src/styles/home.css`
- `src/assets/home/renders.ts`
- `src/components/layout/Header.astro`
- `src/components/home/HomePage.astro`
- `src/components/home/Hero.astro`
- `src/components/home/ProjectIntro.astro`
- `src/components/home/Vision.astro`
- `src/components/home/GreenLiving.astro`
- `src/components/home/ApartmentTypes.astro`
- `src/components/home/PassiveConcept.astro`
- `src/components/home/ContactCTA.astro`
- `src/components/home/RenderImage.astro`
- `README.md`, `docs/HOMEPAGE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ARCHITECTURE.md`, `docs/IMPLEMENTATION_PLAN.md`

Added four JPEG source copies (aerial garden, garden-side building, sunset walkway and brand sign) and the four screenshots below. No files were deleted. Routes, shared global tokens, homepage copy, theme scripts, dependencies, Astro configuration and WordPress boundary remain unchanged.

## Executed verification

- `npm.cmd run check`: passed, 35 files, zero errors/warnings/hints.
- `npm.cmd run build`: passed, two static HTML pages and 28 optimized WebP variants.
- Development and production Chrome: RO/EN ? light/dark ? 320/375/768/1024/1440px. No horizontal overflow, overflowing visible elements, missing fragment targets, incorrectly hidden images or undersized tested header/button targets. Body text remains 16px.
- Mobile menu was closed after initialization at 320/375/768px; visible at desktop. Expanded controls fit at 320px. Enter/Space, Tab, Escape/focus return, collapsed tab order, touch opening and the mobile theme button passed.
- RO?EN?RO switching preserves manual theme; refresh persistence, OS light/dark defaults and manual precedence passed. Without JavaScript, navigation remains visible and CSS follows the OS dark scheme.
- All homepage fragment links were activated in both languages. Language routes return 200; no dedicated-page links or fake form submission were added.
- Sampled text contrast: 67 samples per language/theme at desktop width; minimum 5.02:1 in all combinations. Focus outlines were checked on hero actions, both apartment panels and final CTA in both themes; skip link moves keyboard focus to main.
- Cold image/network tests: eight language/theme/viewport combinations. Six images decoded in every case, no failed image responses or runtime exceptions; all 28 generated variants additionally return HTTP 200.
- Image boxes stayed within 0.063px of their initial position/height through loading/scrolling (subpixel rounding). Observed layout-shift totals ranged from 0 to 0.0183 in these runs; remaining shifts involved text/control layout. This is local instrumentation, not a formal Core Web Vitals result.
- Reduced-motion button durations remain zero. No scroll animation, parallax or reveal effect was introduced.
- Development design-system preview returns 200; production `/design-system/` and `?lang=en` return 404. Output contains only RO/EN homepage HTML.
- All nine source JPEG hashes match originals. `git diff --check` passed.

## Final screenshots

Full-page production captures, inspected for composition, imagery, text hierarchy, mobile framing, watermarks and section rhythm:

- [Desktop light ? 1440px](previews/phase-3b/desktop-light.png)
- [Desktop dark ? 1440px](previews/phase-3b/desktop-dark.png)
- [Mobile light ? 375px](previews/phase-3b/mobile-light.png)
- [Mobile dark ? 375px](previews/phase-3b/mobile-dark.png)

Phase 3A comparison captures remain under [previews/phase-3a/](previews/phase-3a/). English and tablet views were also inspected during QA.

## Remaining limitations and approval

- Visual direction, provisional palette and existing RO/EN copy still need owner approval.
- Apartment data, plans, actual inventory, company/contact details and a real inquiry channel remain pending.
- Building performance, technologies and certification are unverified; no new project-specific claims were introduced.
- Render publication rights/final clean assets require owner confirmation. All supplied marks remain visible; no original was retouched.
- Reference screenshots were unavailable and the live benchmark blocked access. No direct reference-layout comparison was possible.
- Screen readers, Safari/Firefox, physical devices and formal Lighthouse/LCP testing were not performed. Native image resolution is at most 1600px wide; very dense/large displays may reveal source limitations.
- Public originals are still copied to build output, including unused images; browser pages request optimized variants. Publication storage cleanup remains deferred.
- WordPress, forms, other pages, launch metadata, hosting and deployment remain outside this phase.

Stop after Phase 3B for owner review.
