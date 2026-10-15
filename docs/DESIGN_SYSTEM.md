# Eden Residence — design system (Phase 2.2)

## Status and reference

Phase 2 components, Phase 2.1 branded themes and Phase 2.2 refinements implemented for local review on 2026-10-15. The supplied [concept board](../public/brand/concept-board.png) was inspected directly. It uses Quicksand and cream, deep green, navy, anthracite, copper, and yellow, with timber and brick references. These informed restrained surfaces, clear typography, modest radii, and minimal decoration. No imagery, measurements, apartment inventory, legal copy, or factual marketing claims were invented.

The palette below was sampled from plain regions of that PNG. It represents the supplied screen image, not an authoritative RAL conversion. All colors, proportions, and component styling await final brand approval. The board is an existing owner-supplied asset and was not edited.

## Local review and production exclusion

Run from the project root:

```powershell
npm.cmd run dev
```

- Romanian: <http://localhost:4321/design-system/>
- English: <http://localhost:4321/design-system/?lang=en>
- Homepages: <http://localhost:4321/> and <http://localhost:4321/en/>

Use Astro's printed port if 4321 is occupied. Stop with Ctrl+C.

The review page is under `src/dev/`, outside `src/pages/`. The small local integration in `src/dev/preview-integration.ts` injects it only when Astro's command is `dev`. It is rendered on demand in development so the language query works. It is not registered during build, sync, or production preview. It also carries the existing layout's `noindex, nofollow` metadata. Production output should contain only the two existing homepage routes; `/design-system/` must return 404 from `npm.cmd run preview`. There is no environment flag that can accidentally publish it. Inclusion in a deployment requires an explicitly approved code change.

The preview uses review-only bilingual copy, real button/link semantics, simulated hover/focus examples, cards, section spacing, responsive grids, and the shared header/footer/CTA. Simulated examples are labeled as such; real keyboard and pointer states remain available. Demonstration heading sizes are paragraphs so the document retains one H1 and meaningful section headings.

## Token source and conventions

`src/styles/global.css` is the authoritative token source. Tailwind v4 `@theme static` declares the tokens and emits their CSS variables, including the breakpoint read by the navigation script. Semantic aliases use `@theme inline`. No Tailwind v3 configuration, extra styling library, or new dependency was added.

The review page reads swatch HEX labels from the computed CSS variables instead of maintaining a second copy of the palette in TypeScript. Reusable class maps use complete utility names so Tailwind can detect them.

### Fixed palette references — awaiting approval

| Reference | Name / token | Provisional HEX |
| --- | --- | --- |
| RAL 9001 | `brand-cream` | `#e5e1d4` |
| RAL 6005 | `brand-green` | `#234235` |
| RAL 5026 | `brand-blue` | `#1b2b4d` |
| RAL 7016 | `brand-anthracite` | `#3b4044` |
| RAL 2013 | `brand-copper` | `#824128` |
| RAL 1032 | `brand-yellow` | `#cfa81e` |
| Background | `canvas` | `#faf9f6` |
| Surface | `surface` | `#ffffff` |
| Muted surface | `surface-muted` | `#f1efe8` |
| Decorative border | `border` | `#c9c8bd` |
| Primary hover | `green-hover` | `#182f26` |
| Secondary hover | `cream-hover` | `#d7d1bf` |
| Disabled surface | `disabled-surface` | `#e5e5df` |
| Disabled text | `disabled-ink` | `#62675f` |

The six `brand-*` references and all Phase 2 fixed color values above are retained unchanged. Their original HEX values are not replaced by theme switching. UI now uses semantic aliases such as `bg-background`, `bg-panel`, `text-ink`, `text-heading`, `text-muted`, and `border-divider`; the current mapping below is authoritative. Fixed utilities such as `bg-surface` and `bg-canvas` remain available for deliberate fixed-color artwork/swatches, not general themed UI.

Light mode uses a cream page with green text/actions and neutral surfaces. Dark mode uses a forest-green page, cream text/actions and lighter green surfaces. Copper is a selective accent, with a lighter supporting tone for dark surfaces. Blue and yellow remain palette-review colors. Borders are decorative, not the sole indicator of an interactive control. Brand sections have context-specific cream foregrounds. Cards reset foreground/action roles for their own theme-aware surface, including inside brand sections.

### Typography

Quicksand Variable remains locally bundled through the existing Fontsource package, including Latin Extended characters. Font license: `public/fonts/OFL-Quicksand.txt`. No external font request was introduced.

| Utility | Size | Line height |
| --- | --- | --- |
| `text-hero` | `clamp(2.75rem, 1.7rem + 4vw, 6rem)` | 1.06 |
| `text-h1` | `clamp(2.25rem, 1.6rem + 2.6vw, 4.5rem)` | 1.12 |
| `text-h2` | `clamp(1.875rem, 1.45rem + 1.7vw, 3.25rem)` | 1.2 |
| `text-h3` | `clamp(1.5rem, 1.25rem + 1vw, 2rem)` | 1.3 |
| `text-h4` | `clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)` | 1.35 |
| `text-lead` | `clamp(1.125rem, 1rem + 0.5vw, 1.375rem)` | 1.65 |
| `text-body` | 1rem | 1.75 |
| `text-small` | 0.875rem | 1.6 |
| `text-label` | 0.8125rem | 1.5 |
| `text-button`, `text-navigation` | 0.9375rem | 1.5 |

Body weight: 500 (`font-body`); heading/control weights: 600 (`font-heading`, `font-control`). Hero/H1/H2 have restrained negative tracking; labels use 0.1em tracking. Small uppercase labels supplement readable headings; they do not replace instructions or body copy. Supporting paragraphs use the existing 1rem body token (16px at the default root size); lead introductions remain fluid and larger. `text-small` is reserved for captions, state labels and metadata. The Footer note and concept-board explanation now use `text-body`. Long descriptions use `max-w-reading`. Heading size and semantic level can be chosen independently to retain an appropriate document outline.

### Spacing, width, shape, and motion

| Token / utility | Value / behavior |
| --- | --- |
| Base spacing | 0.25rem; use the shared Tailwind spacing scale |
| `px-gutter` | `clamp(1.25rem, 4vw, 3rem)` |
| `py-section-sm` | `clamp(2.5rem, 5vw, 4rem)` |
| `py-section` | `clamp(4rem, 8vw, 7rem)` |
| `py-section-lg` | `clamp(5rem, 10vw, 10rem)` |
| `--spacing-card` | `clamp(1.5rem, 3vw, 2.5rem)` |
| `min-h-control` | 2.75rem (44px at the default root size) |
| Container widths | content 72rem; wide 88rem; narrow 48rem; reading 42rem |
| Breakpoints | existing sm 40rem, md 48rem, lg 64rem, xl 80rem |
| `rounded-control`, `rounded-card` | 0.25rem / 0.5rem |
| `shadow-card` | subtle 0.5rem/2rem green-tinted shadow, 6% opacity |
| `shadow-raised` | 0.75rem/2.5rem green-tinted shadow, 10% opacity |
| `--duration-fast`, `--duration-normal` | 160ms / 240ms |
| `--ease-brand` | `cubic-bezier(0.2, 0.65, 0.3, 1)` |
| Focus | 2px theme-aware outline, 4px offset, contrasting context halo |

Container maximums include their responsive gutters. Do not add another gutter to an already contained section unless deliberately nesting content. Transitions affect color/border only and become 0ms with reduced motion. No animated scrolling, GSAP, Three.js, or motion framework is installed. Forced-color mode uses the system focus and disabled colors.

## Reusable components

All components accept caller-supplied text or typed locale dictionaries. Brand name defaults are language-neutral. Navigation types live in `src/lib/navigation.ts`; control labels live in `src/i18n/navigation.ts`. The existing `LanguageSwitcher` accepts translated destination links while preserving its original homepage defaults. Header language/theme controls share a wrapping flex group with a 0.75rem gap; their reading/tab order is unchanged.

| Component / path | Important props / behavior |
| --- | --- |
| `ui/Container.astro` | `width: content \| wide \| narrow \| reading`; standard div attributes and `class`; default slot |
| `ui/Section.astro` | `tone: default \| surface \| muted \| cream \| brand \| contrast`; `spacing: sm \| default \| lg`; `width`; section attributes, IDs, ARIA labels; wraps one Container |
| `ui/Button.astro` | `variant: primary \| secondary \| outline`; `size: sm \| md \| lg`; `href`, `type`, `disabled`, `fullWidth`, `class`, IDs, labels, controls/expanded, link target/rel/download, name/value; text via slot |
| `ui/SectionHeading.astro` | required `title`; optional `eyebrow`, `description`, `id`, `as: h1–h4`, `size: hero \| h1–h4`, `align`, `class`; optional slot |
| `layout/Header.astro` | required `locale`, `items`, `homeHref`; optional `languageLinks`, `navigationId`, `brandLabel`; responsive navigation and localized theme toggle |
| `ui/ThemeToggle.astro` | required `locale`; native toggle button, stable localized accessible name, `aria-pressed` indicates dark mode, shared preference controller |
| `layout/Footer.astro` | required `locale`, `items`, `homeHref`; optional `note`, `brandLabel`; no invented company/legal details |
| `ui/Card.astro` | required `title`; optional `eyebrow`, `description`, `href`, `headingLevel: h2–h4`, `raised`; article attributes and default slot |
| `ui/CTASection.astro` | required `id`, `title`, `action: { label, href }`; optional `description`, `eyebrow`, `secondaryAction`, `tone: brand \| cream` |

Paths are relative to `src/components/`. Choose semantic headings and connect Sections to their heading IDs using `aria-labelledby`. Supply a unique `navigationId` when rendering more than one Header. The visible wordmark is plain brand text, not a new official logo.

Buttons render an anchor when `href` is supplied and a native button otherwise; native buttons default to `type="button"`. Disabled buttons use the native attribute. Disabled links omit their destination, expose `aria-disabled`, retain a link role, and are removed from tab order. The CTA uses primary/outline variants. Its Section supplies the appropriate context action colors, including cream actions on the deep green brand tone, in either theme.

Header uses a small vanilla TypeScript custom element, not a framework. Without JavaScript, navigation stays visible and the inactive toggle stays hidden. With JavaScript, the mobile panel collapses, synchronizes `aria-expanded`/localized labels, supports Enter/Space through its native button, closes on Escape/outside click/link activation, and returns focus when hiding the focused navigation. Below sm (40rem), the toggle shows its icon only while retaining its localized accessible name; at sm and above its visible menu label returns. Desktop navigation is visible at the shared lg breakpoint. Event listeners are cleaned up on disconnect. This is an expanding navigation region, not a modal or ARIA application menu; keyboard focus is not trapped.

### Usage example

```astro
---
import Section from '../components/ui/Section.astro';
import SectionHeading from '../components/ui/SectionHeading.astro';
import Button from '../components/ui/Button.astro';
// Copy and destinations come from the page's locale/content source.
const { heading, description, actionLabel, actionHref } = Astro.props;
---
<Section aria-labelledby="example-heading" tone="surface">
  <SectionHeading id="example-heading" title={heading} description={description} />
  <div class="mt-8">
    <Button href={actionHref}>{actionLabel}</Button>
  </div>
</Section>
```

## Accessibility and contrast verification

The table below records the original Phase 2 fixed-color reference pairs. Phase 2.1 rendered-theme contrast results are recorded separately below. Ratios use relative luminance:

| Text / background | Contrast |
| --- | --- |
| Green / cream | 8.44:1 |
| Green / canvas | 10.49:1 |
| Anthracite / canvas | 9.96:1 |
| Anthracite / white surface | 10.49:1 |
| Anthracite / muted surface | 9.11:1 |
| Copper / canvas | 7.29:1 |
| Copper / muted surface | 6.67:1 |
| Green / secondary hover | 7.23:1 |
| Cream / primary hover | 10.89:1 |
| Disabled text / disabled surface | 4.58:1 |

These tested text pairs exceed 4.5:1. This is not a claim that every possible token combination or future component meets accessibility requirements. Blue/yellow backgrounds, image overlays, gradients, and additional interactions require their own review.


## Phase 2.1 — semantic themes

### Semantic roles and Tailwind integration (current mappings)

Both themes share the same components, font/type/spacing tokens, and stylesheet. The six provisional brand references are unchanged; supporting colors below are provisional UI tones, not new RAL equivalences. No dependencies, framework, theme package, or animation library was installed.

| CSS role | Light | Dark |
| --- | --- | --- |
| `--theme-background` | cream `#e5e1d4` | forest `#234235` |
| `--theme-surface` | neutral `#faf9f6` | green `#2c4b3e` |
| `--theme-surface-muted` | neutral `#f1efe8` | subtle section green `#28473a` |
| `--theme-elevated` | white `#ffffff` | elevated green `#345646` |
| `--theme-text`, `--theme-heading` | green `#234235` | cream `#e5e1d4` |
| `--theme-muted` | muted green `#526154` | warm muted `#c2c9ba` |
| `--theme-border` | existing `#c9c8bd` | green `#789386` |
| `--theme-accent` | existing copper `#824128` | supporting copper `#edbc9c` |
| `--theme-primary` | green `#234235` | cream `#e5e1d4` |
| `--theme-primary-ink` | cream `#e5e1d4` | green `#234235` |
| `--theme-primary-hover` | existing `#182f26` | existing `#f1efe8` |
| `--theme-secondary` | existing `#f1efe8` | green `#345646` |
| `--theme-secondary-ink` | green `#234235` | cream `#e5e1d4` |
| `--theme-secondary-hover` | existing `#d7d1bf` | green `#40644f` |
| `--theme-disabled` | existing `#e5e5df` | green `#345646` |
| `--theme-disabled-ink` | existing `#62675f` | warm muted `#c2c9ba` |
| `--theme-focus` | green `#234235` | cream `#e5e1d4` |
| `--theme-strong-surface` | green `#234235` | existing deep green `#182f26` |
| `--theme-strong-ink` | cream `#e5e1d4` | cream `#e5e1d4` |

Supporting tokens introduced in Phase 2.1: `forest-surface`, `forest-muted`, `forest-hover`, `forest-border`, `warm-muted`, `warm-copper`, and `green-muted`. The lighter copper was adjusted against the muted green to exceed 4.5:1; the original `brand-copper` remains `#824128`.

The CSS uses `:root` light defaults, `:root[data-theme='dark']` overrides, and a dark-system fallback targeting only roots without an explicit theme. The fallback repeats the dark role mappings, not component rules or palette definitions, so it also works without JavaScript.

Tailwind's existing `@theme inline` maps utilities to runtime role variables:

| Utilities | Role / convention |
| --- | --- |
| `bg-background` | Page background |
| `bg-panel`, `bg-panel-muted` | Theme-aware surfaces |
| `bg-panel-elevated` | Elevated surface; also used by Card through the CSS role |
| `text-ink`, `text-heading`, `text-muted` | Main, heading and secondary text in the current context |
| `text-accent`, `border-accent` | Contrast-adjusted accent |
| `border-divider`, `divide-divider` | Theme-aware decorative border |
| `bg-action`, `text-action-ink` | Current-context primary action pair |

Use these semantic utilities for UI; use fixed `brand-*` values only when a color must deliberately remain constant. Do not add paired light/dark component copies or scatter `dark:` color overrides. `Container` remains color-neutral. `Section`, headings, buttons, cards, Header, Footer and CTA derive their colors from the same role layer.

The existing `Section tone="cream"` is a compatibility name for the warm page tone: it follows the selected theme and becomes forest green in dark mode. `tone="brand"` is a deeper contrasting green section in both modes. It changes local foreground/action/focus roles rather than redefining the brand palette. Cards, Header and Footer reset context roles for their own surfaces. Primary buttons, outline hover states, language selection and focus rings therefore remain legible even in nested contexts.

### Selection, persistence and initial rendering

- Storage key: `eden-theme`, scoped to the browser origin. Only `light` or `dark` are accepted.
- With no valid manual value, follow `prefers-color-scheme`, including live changes. Initial automatic selection is not written to storage.
- A toggle click saves an explicit preference. Manual selection wins over later system changes and carries across RO/EN pages and refreshes.
- Changes in another tab synchronize through the storage event. Removing the saved value returns to automatic mode. The UI intentionally has a two-state toggle; clearing the stored preference restores automatic selection.
- `src/lib/theme-init.js` is a small trusted classic script in the layout's head, before the body/styles can paint. It reads and validates storage, resolves the system fallback and sets `data-theme`, `data-theme-preference` and `color-scheme` synchronously. User-controlled storage is never injected as executable code.
- `src/lib/theme.ts` synchronizes controls, system changes, storage events and the `eden:theme-change` document event. The event includes `theme` and `preference`; the development preview uses it to refresh role values.
- Theme changes temporarily suppress existing button color transitions, avoiding low-contrast intermediate colors. Normal hover behavior resumes after rendering. No theme fade or page animation was added.
- Storage failures are caught. Manual selection still works for the current page, but cannot persist when storage is blocked.
- Without JavaScript, CSS follows the system preference and navigation stays visible. Inactive theme controls remain hidden; saved preferences cannot be read without JavaScript.

The localized native toggle uses a stable accessible name (`Temă întunecată` / `Dark theme`) and `aria-pressed="true"` when dark mode is active. It supports Enter/Space, preserves visible focus, and is included inside mobile navigation. All instances stay synchronized. The RO/EN placeholders receive the same control beside their existing language links; their content and layout remain placeholders.

### Review and Phase 2.1 verification (historical)

The existing development-only route now shows semantic role swatches, the current theme and an additional synchronized control. It renders the real shared components in the selected theme; no alternate component copies or production preview page were added.

Executed on 2026-10-15 with Node 24.22.0:

- `npm.cmd run check`: 25 files, 0 errors, 0 warnings, 0 hints.
- `npm.cmd run build`: passed, generating the two existing static homepage routes.
- Chrome: light and dark rendering at 320, 390, 768, 1024 and 1440 CSS pixels; no horizontal overflow.
- Keyboard: Enter/Space theme selection, pressed-state synchronization, mobile toggle operation, visible focus, Escape navigation dismissal and focus return.
- Behavior: system detection/live changes, saved light/dark choices after refresh, manual override, RO/EN navigation, English control label, cross-tab updates and return to automatic mode when the preference is removed.
- Fallbacks: invalid saved values, blocked storage, JavaScript-disabled system dark mode/navigation, hidden unavailable controls, and reduced-motion behavior.
- Contrast: 153 rendered text samples per theme, including button state demonstrations; light minimum 4.58:1, dark minimum 4.78:1. All sampled pairs exceeded 4.5:1. This is not a claim that every possible token combination meets WCAG AA.
- Initial loading: first animation frames and first-paint/first-contentful-paint observations matched saved dark against a light system, saved light against a dark system, and automatic system dark, under 4x CPU throttling. No wrong-theme frame was observed in these cases.
- Light/dark desktop, mobile navigation and dark CTA screenshots inspected. No uncaught JavaScript runtime exceptions in the exercised checks.
- Final production preview: RO/EN routes returned HTTP 200 with the initializer and toggle; `/design-system/` returned HTTP 404. The artifact contains exactly two HTML pages and no design-system directory. Chrome also verified production system-dark rendering, the bundled keyboard toggle, saved light selection on navigation to EN, localized labels and no runtime exceptions in those flows.

New theme files: `src/lib/theme-init.js`, `src/lib/theme.ts`, `src/i18n/theme.ts`, `src/components/ui/ThemeToggle.astro`. Updated theme consumers: global CSS, BaseLayout, Header, Footer, LanguageSwitcher, PlaceholderHome, SectionHeading, Card, CTASection and the dev preview. Button/Container/Section APIs and the architecture are retained.

No dependencies were installed, no WordPress request or modification was made, and no commit was created. The existing owner-started development server is reused and left running.

### Remaining review

The fixed palette remains provisional, and the new surface/accent supporting tones and theme styling require brand approval. Safari/Firefox, physical devices and screen readers were not tested. Startup observations cover the tested Chrome cases, not every browser/network/device. No final homepage, CMS integration or deployment work is included.


## Phase 2.2 — targeted refinement

### Exact changes

- **Typography:** the body and card description were already 16px, and SectionHeading already had a fluid 18–22px lead size. These, Quicksand, the heading hierarchy, 500/600 weights, and existing line-height tokens remain unchanged. Footer supporting copy and the concept-board explanation changed from `text-small` (14px) to `text-body` (16px / 1.75 line height). Caption, swatch, state-label and metadata sizes remain intentionally smaller.
- **Surface hierarchy:** added the supporting `forest-section` token `#28473a`. Dark `--theme-surface-muted` now uses it instead of `#345646`, softening the alternating section/footer bands. Added `--theme-elevated`: existing white `#ffffff` in light mode and existing forest-muted `#345646` in dark mode. Card uses this role instead of sharing its parent section's surface. The corresponding `bg-panel-elevated` utility follows the existing Tailwind inline convention.
- **Dark levels:** page `#234235` → quiet section `#28473a` → surface `#2c4b3e` → elevated card `#345646`. The six primary brand colors, accent/action/border/focus colors, radii, shadows, button dimensions, container widths and spacing tokens remain unchanged. These supporting surface refinements still await visual/brand approval; no RAL conversion is implied.
- **Mobile Header:** below 40rem, its existing native toggle shows the hamburger icon with its full localized accessible name retained. This keeps the brand and toggle on one row at 320px. Language and theme controls use a wrapping, vertically aligned group with a 12px gap; they share a row when space permits and wrap naturally at 320px. Existing menu logic, keyboard behavior, language destinations, theme storage and focus handling are unchanged.
- **Existing preview:** added the elevated-surface swatch and its RO/EN label, arranged the semantic swatches in a four-column large-screen grid, and applied the supporting paragraph refinement. No additional showcase route was created.

Files changed in this phase only:

1. `src/styles/global.css`
2. `src/components/layout/Header.astro`
3. `src/components/layout/Footer.astro`
4. `src/dev/DesignSystem.astro`
5. `src/i18n/theme.ts`
6. `docs/DESIGN_SYSTEM.md`

Button, Card, CTASection, Container, Section and SectionHeading source/APIs required no further changes; they inherit the refined shared roles. Theme initialization/controller, Astro configuration, dependencies, homepage implementation and WordPress are untouched in this phase.

### Executed verification

- `npm.cmd run check`: passed, 25 files, 0 errors, 0 warnings, 0 hints.
- `npm.cmd run build`: passed, static output with exactly the two existing homepage routes.
- Chrome: RO and EN, light and dark, at 320/390/768/1024/1440 CSS pixels (20 combinations). No horizontal overflow, overlapping header controls, or undersized language/theme targets; all measured controls were at least 44px in both dimensions.
- Computed body, card description, footer supporting copy and concept-board explanation were 16px across the tested widths.
- Rendered text contrast: 155 samples per language/theme; minimum 4.58:1 in light and 4.78:1 in dark. No sampled normal/interactive text pair fell below 4.5:1, including the existing state examples. Decorative borders remain separate from interactive focus indicators.
- Enter/Space, Escape/focus return, collapsed tab order, visible mobile/card action focus rings, theme persistence after refresh, RO/EN route selection and manual preference precedence passed.
- Chrome touch emulation at 320px: menu opening, mobile theme selection and language switching preserved the saved theme. This does not replace physical-device testing.
- Reduced-motion behavior passed; no runtime JavaScript exceptions were observed in the exercised flows.
- Before/after card and mobile screenshots were inspected; the cards now visibly separate from their section and the narrow-screen controls fit.
- Production preview: RO/EN homepages returned HTTP 200, both design-system URL variants returned HTTP 404, and no design-system directory was generated. `git diff --check` passed.

### Remaining review and scope

No implementation errors remain from these checks. Surface styling needs owner visual approval. Screen readers, Safari/Firefox and physical devices were not tested. No dependencies, WordPress changes, new homepage content or automatic commit were introduced. The existing owner development server remains running for review; the temporary test browser/production preview are stopped after validation.

## Phase 2 verification record (historical)

Runtime: Node 24.22.0 and npm 11.19.1. No packages were installed, upgraded, or added.

- Astro checks: 21 files; 0 errors, 0 warnings, 0 hints.
- Production build: static output with the two existing RO/EN homepage routes.
- Local HTTP checks: existing RO/EN routes and the development preview served successfully.
- Headless installed Chrome: no horizontal overflow at 320, 390, 768, 1024, and 1440 CSS pixels; correct menu states and local Quicksand loading.
- Keyboard: Enter and Space open navigation, Tab reaches the first link, Escape closes and restores focus; collapsed links are excluded from tab order.
- Interaction: outside-click dismissal, desktop/mobile resize synchronization, visible keyboard focus, and reduced-motion transitions verified.
- JavaScript disabled: navigation remained visible and usable.
- Semantic smoke checks: one H1, unique IDs, resolved section labels/fragment links, disabled buttons/links, and noindex metadata.
- Romanian and English preview content/document language and existing homepage languages verified in Chrome.
- Desktop, mobile, button-state, and CTA screenshots inspected. No JavaScript runtime exceptions occurred during the exercised browser checks.

- Production preview on a separate local port: `/` and `/en/` returned HTTP 200; `/design-system/` and `/design-system/?lang=en` returned HTTP 404. The final `dist/` contains exactly two HTML pages and no design-system directory.
- A card placed inside the dark CTA retained green title/eyebrow text on its own light surface.
- `git diff --check` passed. Existing homepage source, package manifest/lockfile, WordPress boundary, and production infrastructure were not changed.

## Limitations and decisions awaiting approval

1. Final digital palette approval; screen samples are not universal RAL equivalents.
2. Typography scale/weights, spacing, radii, component geometry, and interaction styling.
3. Official logo assets and architectural renders; the preview's wordmark is text and its only image is the supplied concept board.
4. Actual page navigation/content, approved RO/EN copy, property data, and legal/company details.
5. Screen-reader and assistive-technology review, Safari/Firefox and physical mobile device testing were not performed. Headless Chrome smoke checks do not establish full WCAG compliance.
6. No final homepage, CMS connection, forms, deployment, production WordPress changes, or additional animation/3D libraries are part of Phase 2.

Phase 2.2 ended at owner review. Phase 3A was subsequently authorized; its additions are recorded below.

## Phase 3A additions

The fixed brand palette, shared typography and theme-selection scripts are unchanged. `Section` now accepts `tone="contrast"`: a deliberate cream region in both themes, with green text/actions/focus, green-muted supporting text, copper accents and the existing light border. It is used for the apartment section to interrupt the dark green page rhythm. `tone="cream"` retains its previous theme-following behavior. Contrast uses semantic context roles rather than new HEX values. Primary/outline buttons and text links inherit those roles; nested self-contained cards continue to select their own theme surfaces.

`brand-wordmark` now has a 44px minimum clickable height, preserving its typography. The homepage adds a 44px-minimum underlined text-link style, full-aspect image figures and asymmetrical composition in `src/styles/home.css`; it does not replace shared primitives. The two apartment numerals use existing copper/green roles for visual distinction. No additional font, raw color, motion effect or browser dependency was introduced.

See [the Phase 3A record](HOMEPAGE.md) for composition, exact assets, verification, screenshots and remaining factual content. Historical Phase 2 scope statements above describe those phases, not the current homepage status.
