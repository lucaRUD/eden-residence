# Eden Residence

Local Eden Residence presentation website: Astro static generation, strict TypeScript, Tailwind CSS v4, and locally bundled Quicksand. Phase 3D.1 refines chapter spacing and motion and adds an image-led apartment-category showcase. See [current review, browser verification and screenshots](docs/PHASE_3D1.md). WordPress, inquiry processing and deployment remain deferred.

## Requirements

- Node.js 22.19.0 or newer supported even-numbered release. Phase 2 was verified with Node 24.22.0 and npm 11.19.1.
- npm and Git.

Run commands from the project root. Windows PowerShell examples use `npm.cmd` because execution policy can block `npm.ps1`. In other shells, use `npm` instead. No global installation or execution-policy change is needed.

## Install and develop

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the Local URL printed by Astro (normally <http://localhost:4321/>). Romanian is at `/`; English is at `/en/`. Stop the server with Ctrl+C. The server uses loopback by default; no LAN exposure is needed.

## Check, build, and preview

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd run preview
```

`check` runs the official `astro check` tool over Astro and TypeScript files. `build` produces a static site in ignored `dist/`. Run both commands before considering changes ready. `preview` serves that build locally, normally at <http://localhost:4321/>; stop it with Ctrl+C. No deployment occurs.

## Environment and production

`.env.example` reserves `WORDPRESS_URL=https://edenresidence.ro` for future build-time content access. A real `.env` file is unnecessary: neither development nor builds contact WordPress. Never put secrets in `PUBLIC_` variables, Git, or static output.

The live WordPress installation remains untouched. No cPanel changes, CMS configuration, plugins, hosting integration, source remote, or deployment are included. Both homepages retain `noindex, nofollow` for local review; approved factual/contact content and a production SEO review are required before launch.

## Project map

| Location | Responsibility |
| --- | --- |
| `src/pages/` | Romanian routes at root; English routes under `en/` |
| `src/layouts/` | Shared HTML document and metadata |
| `src/components/layout/` | Shared navigation and layout elements |
| `src/components/ui/` | Shared theme-aware UI primitives |
| `src/components/home/` | Homepage composition and seven presentation sections |
| `src/components/apartments/` | Reserved approved apartment components |
| `src/styles/global.css` | Tailwind import, provisional tokens, base styles |
| `src/i18n/` | Typed interface translations, homepage copy and route mappings |
| `src/assets/home/` | Five exact render source copies, metadata and localized alt text |
| `src/styles/home.css` | Homepage composition using shared design tokens |
| `src/lib/wordpress/` | Reserved CMS boundary; no integration |
| `public/renders/`, `public/brand/`, `public/fonts/` | Supplied originals, concept board and font license |

Quicksand is imported from `@fontsource-variable/quicksand` and bundled by Astro, so the browser does not request Google Fonts. Empty directories have `.gitkeep` files so Git retains the intended structure.

The font's distribution license is retained at `public/fonts/OFL-Quicksand.txt`.

## Local compatibility note

Phase 1 used Node 22.18.0 and reported an engine warning for an indirect dependency requiring 22.19.0. The owner subsequently updated Node; Phase 2 uses Node 24.22.0 and npm 11.19.1, satisfying that requirement. The minimum in `package.json` remains 22.19.0. No dependencies were reinstalled or changed in Phase 2.

## Phase 2 design-system review

Start `npm.cmd run dev`, then open <http://localhost:4321/design-system/> for Romanian or <http://localhost:4321/design-system/?lang=en> for English. The supplied concept board informs a provisional palette; all digital colors and component styling still await design approval.

The page demonstrates tokens, typography, buttons/states, cards, spacing, responsive grids, navigation, footer, and CTA components. It uses demonstration content, not apartment information. See [the design-system guide](docs/DESIGN_SYSTEM.md) for component props, usage, and verification details.

The review route is injected only during `astro dev`. It has `noindex, nofollow` and is absent from production builds and `npm.cmd run preview`. Making it deployable would require an explicitly approved code change. The RO/EN homepages now use the Phase 3A composition.

## Documentation

- [Project brief](docs/PROJECT_BRIEF.md)
- [Architecture and CMS plan](docs/ARCHITECTURE.md)
- [Design system and pending brand decisions](docs/DESIGN_SYSTEM.md)
- [Incremental implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Permanent coding rules](AGENTS.md)

## Official references

- [Astro installation](https://docs.astro.build/en/install-and-setup/)
- [Astro TypeScript](https://docs.astro.build/en/guides/typescript/)
- [Tailwind v4 with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro)
- [Astro internationalization](https://docs.astro.build/en/guides/internationalization/)

## Phase 3C homepage review

Open `/` or `/en/` using the dev server's printed URL. Navigation and CTAs use working homepage anchors. Apartment specifications and contact details remain explicitly pending; no inquiry form is simulated.

The supplied originals actually live in `public/renders/`. Nine byte-identical source copies remain in `src/assets/home/`; seven selected renders generate 28 responsive WebP variants. The mobile hero is art-directed to retain the building and credit. Originals and watermarks remain unchanged. See [the Phase 3B review record](docs/HOMEPAGE.md) for assets, changed files, screenshots, verification and pending decisions.

Phase 3B is not visually approved. See [Phase 3C](docs/PHASE_3C.md) for the image investigation, softer radii/framing, actual-viewport image proofs, full-page/hero screenshots and local capture helper. New scroll/entrance animations and GSAP remain deferred to Phase 3D.
