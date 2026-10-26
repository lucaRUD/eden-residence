# Eden Residence — design system

Current conventions for the shared components, semantic themes and [homepage composition](#homepage-conventions). This document describes the implementation; code remains authoritative.

## Status and reference

The supplied [concept board](../public/brand/concept-board.png) was inspected directly. It uses Quicksand and cream, deep green, navy, anthracite, copper, and yellow, with timber and brick references. These informed restrained surfaces, clear typography, modest radii, and minimal decoration. No imagery, measurements, apartment inventory, legal copy, or factual marketing claims were invented.

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

`src/styles/global.css` is the authoritative token source. Tailwind v4 `@theme static` declares the tokens and emits their CSS variables, including the breakpoint read by the navigation script. Semantic aliases use `@theme inline`. Use Tailwind v4 conventions rather than a Tailwind v3 configuration or extra styling library.

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

The six `brand-*` references and fixed color values above are retained unchanged. Their original HEX values are not replaced by theme switching. UI now uses semantic aliases such as `bg-background`, `bg-panel`, `text-ink`, `text-heading`, `text-muted`, and `border-divider`; the current mapping below is authoritative. Fixed utilities such as `bg-surface` and `bg-canvas` remain available for deliberate fixed-color artwork/swatches, not general themed UI.

Light mode uses a cream page with green text/actions and neutral surfaces. Dark mode uses a forest-green page, cream text/actions and lighter green surfaces. Copper is a selective accent, with a lighter supporting tone for dark surfaces. Blue supports the passive concept feature; yellow is used sparingly. Borders are decorative, not the sole indicator of an interactive control. Brand sections have context-specific cream foregrounds. Cards reset foreground/action roles for their own theme-aware surface, including inside brand sections.

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
| `rounded-control`, `rounded-card` | 0.5rem / 0.75rem |
| `--radius-image` | `clamp(0.5rem, 1.2vw, 1rem)` for selected photographs |
| `shadow-card` | subtle 0.5rem/2rem green-tinted shadow, 6% opacity |
| `shadow-raised` | 0.75rem/2.5rem green-tinted shadow, 10% opacity |
| `--duration-fast`, `--duration-normal` | 160ms / 240ms |
| `--ease-brand` | `cubic-bezier(0.2, 0.65, 0.3, 1)` |
| Focus | 2px theme-aware outline, 4px offset, contrasting context halo |

Container maximums include their responsive gutters. Do not add another gutter to an already contained section unless deliberately nesting content. Shared color transitions become 0ms with reduced motion. Homepage GSAP and pointer effects are progressive enhancements; Three.js is not installed. Forced-color mode uses the system focus and disabled colors.

## Reusable components

All components accept caller-supplied text or typed locale dictionaries. Brand name defaults are language-neutral. Navigation types live in `src/lib/navigation.ts`; control labels live in `src/i18n/navigation.ts`. The existing `LanguageSwitcher` accepts translated destination links while preserving its original homepage defaults. Header language/theme controls share a wrapping flex group with a 0.75rem gap; their reading/tab order is unchanged.

| Component / path | Important props / behavior |
| --- | --- |
| `ui/Container.astro` | `width: content \| wide \| narrow \| reading`; standard div attributes and `class`; default slot |
| `ui/Section.astro` | `tone: default \| surface \| muted \| cream \| brand \| contrast`; `spacing: sm \| default \| lg`; `width`; section attributes, IDs, ARIA labels; wraps one Container |
| `ui/Button.astro` | `variant: primary \| secondary \| outline`; `size: sm \| md \| lg`; `href`, `type`, `disabled`, `fullWidth`, `class`, IDs, labels, controls/expanded, link target/rel/download, name/value; text via slot |
| `ui/SectionHeading.astro` | required `title`; optional `eyebrow`, `description`, `id`, `as: h1–h4`, `size: hero \| h1–h4`, `align`, `class`; optional slot |
| `layout/Header.astro` | required `locale`, `items`, `homeHref`; optional `languageLinks`, `navigationId`, `brandLabel`, `appearance: default \| editorial`, `contactAction`; responsive navigation and localized theme toggle |
| `ui/ThemeToggle.astro` | required `locale`; `appearance: default \| icon`; default pressed-state toggle or icon action button, shared preference controller |
| `layout/Footer.astro` | required `locale`, `items`, `homeHref`; optional `note`, `brandLabel`; no invented company/legal details |
| `ui/Card.astro` | required `title`; optional `eyebrow`, `description`, `href`, `headingLevel: h2–h4`, `raised`; article attributes and default slot |
| `ui/CTASection.astro` | required `id`, `title`, `action: { label, href }`; optional `description`, `eyebrow`, `secondaryAction`, `tone: brand \| cream` |

Paths are relative to `src/components/`. Choose semantic headings and connect Sections to their heading IDs using `aria-labelledby`. Supply a unique `navigationId` when rendering more than one Header. The default Header uses brand text; its editorial appearance uses the supplied logo artwork.

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

## Accessibility

Reference text/background pairs use relative luminance:

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

## Semantic themes

### Semantic roles and Tailwind integration

Both themes share the same components, font/type/spacing tokens, and stylesheet. The six provisional brand references are unchanged; supporting colors below are provisional UI tones, not new RAL equivalences.

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

Supporting tokens: `forest-surface`, `forest-muted`, `forest-hover`, `forest-border`, `warm-muted`, `warm-copper`, and `green-muted`. The lighter copper was adjusted against the muted green to exceed 4.5:1; the original `brand-copper` remains `#824128`.

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

The localized native toggle uses a stable accessible name (`Temă întunecată` / `Dark theme`) and `aria-pressed="true"` when dark mode is active. It supports Enter/Space, preserves visible focus, and is included inside mobile navigation. All instances stay synchronized. Both home routes share this controller. Icon appearance instead exposes a localized next-action name and omits `aria-pressed`.

## Homepage conventions

Homepage composition lives in `src/styles/home.css`; global tokens and shared primitives remain separate. The order is Hero → PassiveConcept → ProjectIntro → ApartmentTypes → GreenLiving → ContactCTA. ContactCTA also includes the honest contact-status region.

| Homepage role | Current value |
| --- | --- |
| Chapter padding | `clamp(2.75rem, 5vw, 4.5rem)` |
| Composition gap | `clamp(1.5rem, 3vw, 2.5rem)` |
| Editorial display | `clamp(2.5rem, 1.1rem + 4.8vw, 5.5rem)` |
| Apartment image height from md | `clamp(30rem, 44vw, 39rem)` |
| Apartment mobile image minimum | 15rem |
| Apartment room-count size | `clamp(3.5rem, 5vw, 5rem)` |
| Final CTA display cap | 6rem |

The hero uses a native mobile image source below md, with 3:2 right/bottom framing; md and above retain the full street view. Below xl the text panel sits beneath the image. At xl the stage follows the render's full-width 16:9 proportions instead of capping its height and shrinking the photograph on wide landscape screens; an inset two-column panel leaves the bottom-right image credit clear. Its background/foreground use the existing primary pair in reverse between themes. The single H1, supporting copy and both native anchor actions remain readable throughout.

`heroScenes` in `src/assets/home/renders.ts` selects the arrival street view, its existing mobile alternative and the complementary garden aerial. The second scene reuses the project image's optimized derivatives; originals and watermarks are unchanged. With motion allowed, desktop viewports at least xl wide and 45rem high, with an aspect ratio no wider than 16:9, use one scrubbed hero pin lasting 90vh: arrival holds through 25%, a right-to-left mask reveals the aerial through 70% while the arrival image scales from 1 to 1.025, then the panel settles before release. Panel travel is only 10px; interactive text never fades. Smaller, shorter or wider viewports use an unpinned crossfade without zoom or panel movement, allowing the complete scene and its actions to scroll naturally. Reduced motion, no JavaScript or a failed image/runtime retain the static arrival. Late loads and initial hash arrivals avoid inserting a pin beneath the reader. No new copy or semantic color tokens are introduced.

PassiveConcept uses the existing navy reference with cream text in both themes. Its headline and supporting wording are provisional client copy, visibly qualified and linked to the qualification through `aria-describedby`. The general principles are always visible. The informational CTA targets `#passive-principles` while the dedicated page remains pending; change the centralized `action`/`actionHref` only when a real page exists. See [content boundaries](PROJECT_BRIEF.md).

Apartment panels use actual `<picture>` imagery with opaque paper/forest text rails and compact action footers. From md, titles use `writing-mode: vertical-rl` and 180° rotation, with upright room counts. Mobile restores horizontal titles and stacks the panels. Each category has one native anchor named by its H3; its accessible description includes the general-development imagery note and action. Inquiry destinations reach the real contact-status region, not an unimplemented apartment page.

For fine hover pointers without reduced motion, the active image scales to 1.025 over 480ms, anchored at bottom right; inactive imagery uses brightness 0.85 and saturation 0.65. Text remains sharp and geometry stays fixed. Keyboard focus receives equivalent image emphasis plus the established outline. Touch and reduced motion keep static imagery, visible labels/actions and focus affordances.

Project copy shares a spread above its large aerial image. Gardens pair a dominant full-frame courtyard view with text and a smaller sunset perspective. The final CTA combines its statement and brand render in one spread. No chapter uses an arbitrary fixed height.

Five chapter ScrollTriggers serve the passive, project, garden and closing treatments, independently of the cinematic hero. Apartments use CSS interactions only. Below the hero, text and photography remain opaque; small leading-edge masks retain bottom-right credits.

The Eden Journey adds one scrubbed SVG route through existing negative space, connecting the passive concept, apartment selection and gardens. Its thin stroke uses each section's semantic copper accent, with a muted track and three understated circular milestones. Desktop alternates sides through measured heading gaps; tablet simplifies the curves and mobile uses a straight left-margin line. It adds no text, padding or focusable controls and never handles pointer input. Reduced motion, no JavaScript and insufficient gutter space hide it. Geometry, cleanup and failure behavior are documented in [Architecture](ARCHITECTURE.md#homepage-motion).

## Header and supplied logos

The editorial Header centers its main navigation between equal outer columns and groups language/theme controls with one `contactAction` on the right. Below lg, the non-modal expanding panel contains these controls and starts closed when JavaScript is available. Native keyboard, Escape, outside-click, focus return and resize behavior remain available. The independent 180ms menu entrance respects reduced motion.

`LanguageSwitcher` supports `appearance: default | inline`. Inline shows RO / EN while retaining full localized accessible names, translated destinations, current-language semantics and at least 44px targets. `ThemeToggle` supports `appearance: default | icon`; icon mode shows the next action (moon for dark, sun for light), with a localized name/title, rather than a pressed state.

The official `public/brand/logo-Eden-residence-light.png` and `logo-Eden-residence-dark.png` originals have large opaque margins. A decorative SVG viewport frames their complete artwork without modifying the files or proportions. Light mode uses darken blending; dark mode uses the supplied cream-on-green artwork. Theme/OS fallback selection also works without JavaScript. The containing link retains the full accessible brand name.

## Review and unresolved decisions

Use the live development-only preview and targeted interaction checks. Follow [AGENTS.md](../AGENTS.md) for verification and artifact handling; do not append phase reports or automatic screenshot collections.

The digital palette, visual styling and final bilingual copy still require owner review. National-first positioning, passive performance/certification, apartment data, company/contact details and legal text require approved evidence. The site has no working inquiry submission. Reference contrast pairs and automated checks do not constitute a full accessibility audit; keyboard, assistive technology and physical-device review remain important before launch.
