# Eden Residence

Local Phase 1 foundation for the Romanian/English real estate presentation website: Astro static generation, strict TypeScript, Tailwind CSS v4, and locally bundled Quicksand. WordPress integration and the final design are planned, not implemented.

## Requirements

- Node.js 22.19.0 or newer supported even-numbered release. Astro declares a lower minimum, but its installed indirect dependency `undici@8` requires 22.19.0. This machine currently has 22.18.0; see the compatibility note below.
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

`.env.example` reserves `WORDPRESS_URL=https://edenresidence.ro` for future build-time content access. A real `.env` file is unnecessary in Phase 1: neither development nor builds contact WordPress. Never put secrets in `PUBLIC_` variables, Git, or static output.

The live WordPress installation remains untouched. No cPanel changes, CMS configuration, plugins, hosting integration, source remote, or deployment are included. The placeholder carries `noindex, nofollow`; a future launch must replace placeholder content and review metadata before removing it.

## Project map

| Location | Responsibility |
| --- | --- |
| `src/pages/` | Romanian routes at root; English routes under `en/` |
| `src/layouts/` | Shared HTML document and metadata |
| `src/components/layout/` | Shared navigation and layout elements |
| `src/components/ui/` | Reserved reusable UI primitives |
| `src/components/home/` | Temporary homepage; future home sections |
| `src/components/apartments/` | Reserved approved apartment components |
| `src/styles/global.css` | Tailwind import, provisional tokens, base styles |
| `src/i18n/` | Typed interface translations and route mappings |
| `src/lib/wordpress/` | Reserved CMS boundary; no integration |
| `public/images/`, `public/fonts/` | Reserved asset locations |

Quicksand is imported from `@fontsource-variable/quicksand` and bundled by Astro, so the browser does not request Google Fonts. Empty directories have `.gitkeep` files so Git retains the intended structure.

The font's distribution license is retained at `public/fonts/OFL-Quicksand.txt`.

## Local compatibility note

Initialization used system Node 22.18.0 and npm 10.9.3. Dependency installation reported an engine warning for `undici@8.12.1` (through Astro's `unifont` dependency), which requires Node 22.19.0 or newer. The executed Astro check and build passed on 22.18.0, but that does not establish dependency support. Use a supported Node 22.19+ release for subsequent development and CI. No system Node update, dependency override, or version downgrade was performed.

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
