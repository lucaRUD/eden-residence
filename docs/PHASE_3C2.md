# Phase 3C.2 - navbar, hero and project transition

Implemented locally for visual review on 2026-10-15. No commit, deployment, dependency change or WordPress operation was performed. Existing uncommitted Phase 3B/3C work was preserved. Apartments, gardens, passive chapter and Footer were not edited in this phase.

## Findings and changes

The previous masthead grouped navigation and boxed utilities on the right. The hero panel shared the following section's surface, while a caption and a long description formed an additional disconnected row. Desktop/mobile Phase 3C captures were inspected before implementation.

No official SVG or transparent logo was found in the project. The temporary Quicksand wordmark now has two typographic levels. Desktop navigation is centered between equal outer grid columns; inline RO / EN, the sun/moon action control and a Contact button occupy the right. Contact uses the existing #contact destination and caller-supplied translated copy. Mobile uses an unboxed hamburger/close icon, larger navigation links, integrated controls and contact action. The panel starts closed with JavaScript.

The icon control shows moon for switching to dark and sun for switching to light. Its accessible name/title changes to the localized next action. Existing manual persistence, OS detection, head initialization and the default design-system toggle's pressed-state semantics remain intact.

The hero retains its wording and existing architecture renders. Localized line breaks and fluid Quicksand typography strengthen the statement. A shorter 16px description sits inside the panel above the original primary/secondary actions. Both the visible hero caption and the detached description row are removed; alt text is retained.

In light mode the panel is forest green on the cream page; in dark mode it is cream on the forest page. These use the existing semantic color pairs. At desktop xl the panel overlaps the roadway, extends below the image in normal grid flow, and leaves the architecture and bottom-right credit visible. Mobile/tablet join the panel directly beneath the photograph, avoiding overlap of the image/credit. Mobile retains 3:2 right/bottom framing; md and above retain the complete 16:9 street view. No image file, optimizer or loading strategy was changed.

The project introduction starts after 48-80px of responsive spacing, with its existing chapter label, asymmetrical heading and large aerial render. Surface contrast and the chapter composition provide separation; no divider or shadow was added.

## Files changed in this phase

- `src/components/layout/Header.astro`
- `src/components/layout/LanguageSwitcher.astro`
- `src/components/ui/ThemeToggle.astro`
- `src/components/home/HomePage.astro`
- `src/components/home/Hero.astro`
- `src/i18n/home.ts` - hero copy and removal of its unused caption field only
- `src/i18n/theme.ts` - localized action labels
- `src/lib/theme.ts` - synchronize action labels alongside existing pressed-state controls
- `src/styles/home.css` - header, hero and project-opening styles only
- `scripts/capture-homepage.mjs` - read legacy CSS clip through getPropertyValue to avoid a TypeScript deprecation hint; capture behavior unchanged
- `docs/DESIGN_SYSTEM.md`, `docs/HOMEPAGE.md`, this record
- `docs/previews/phase-3c2/` - five screenshots and responsive verification JSON

ProjectIntro markup, other homepage sections, Footer, global palette, image assets, theme initialization, routes, configuration and dependencies were not modified in this phase.

## Actual verification

- `npm.cmd run check`: 36 files; 0 errors, 0 warnings, 0 hints.
- `npm.cmd run build`: passed; two static HTML routes and 28 optimized WebP variants. Production `/design-system/` returns 404.
- Chrome production browser matrix: RO and EN, light and dark, widths 320, 375, 768, 1024 and 1440px (20 combinations). No horizontal overflow, including expanded mobile panels. Desktop navigation remained centered. Tested header links/buttons had at least 44px width/height. Each route had one H1, description inside its panel, no hero caption and contrasting hero/project backgrounds.
- All six displayed image URLs decoded and returned HTTP 200 in every matrix case. Hero geometry changed by less than 1px through decoding and scrolling. All fragment links have real targets; each homepage action was activated in both languages. Contact still leads to the existing honest information placeholder, not a working inquiry form.
- Keyboard Enter/Space menu operation, Tab navigation, visible 2px focus outline, Escape closure/focus return and exclusion of collapsed links from tab order passed. Touch opened the mobile panel. Outside click, fragment activation and desktop/mobile resizing closed/reset it correctly.
- Mobile theme switching, refresh persistence, RO-to-EN-to-RO switching, automatic OS light/dark selection, live OS changes, invalid stored preference fallback and manual precedence passed. Action icon/name correspond to the next theme. Instrumentation observed the saved theme already selected when the body first appeared in both modes; this is not a formal frame-by-frame flash audit.
- Sampled normal text contrast across the rendered pages: minimum 5.02:1, no samples below 4.5:1. Hero hover states were also sampled. Hero action focus indicators were checked in both themes. This is a local computed-color check, not a full accessibility certification.
- Reduced-motion button transitions remain zero. Without JavaScript, mobile navigation remains visible, inactive menu/theme controls are hidden, the CSS OS-dark fallback renders correctly and there is no horizontal overflow.
- Development `/design-system/` and `?lang=en` were checked: default shared Header/menu and stable-name pressed-state ThemeToggle still work. The existing owner dev server was reused and left running.
- No JavaScript runtime exceptions occurred during these checks. `git diff --check` passed.

## Screenshots

Production captures were taken after fonts and hero/project images decoded. These include the complete navbar/hero and the transition through the project heading into the aerial photograph. All four final captures were visually inspected, including image framing, architectural visibility, credit visibility, text wrapping and spacing.

- [Desktop light, 1440px](previews/phase-3c2/desktop-light.jpg)
- [Desktop dark, 1440px](previews/phase-3c2/desktop-dark.jpg)
- [Mobile light, 375px](previews/phase-3c2/mobile-light.jpg)
- [Mobile dark, 375px](previews/phase-3c2/mobile-dark.jpg)
- [Expanded mobile navigation](previews/phase-3c2/mobile-menu.jpg)
- [Responsive/image/contrast measurements](previews/phase-3c2/responsive-report.json)

Local review: <http://localhost:4321/> and <http://localhost:4321/en/>. The temporary production QA server/browser are stopped after verification; the existing dev server is left available.

## Remaining review items

Visual approval of the wordmark, hero overlap, line breaks and shortened bilingual description is pending. The official logo is still required for final branding. Existing provisional HEX values remain provisional, not official RAL conversions.

Safari, Firefox, physical devices and screen-reader testing were not available. The checks do not constitute a formal performance or accessibility audit. Existing unverified project specifications and missing contact functionality are unchanged. No further homepage chapters or CMS integration were undertaken.

Stop after Phase 3C.2 for owner review.
