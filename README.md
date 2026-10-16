# Eden Residence

Local residential presentation website built with Astro, strict TypeScript, Tailwind CSS v4, Quicksand and homepage-only GSAP/ScrollTrigger. Romanian is at `/`; English is at `/en/`. The homepage and design system are available for review. WordPress integration, inquiry processing and deployment remain deferred.

The client-supplied national-first passive-building claim is visibly provisional and requires verification before public launch. Apartment details and contact information remain pending. Both homepages retain `noindex, nofollow`.

## Develop

Use Node.js compatible with `package.json` (minimum 22.19.0), npm and Git. The project has been checked with Node 24.22.0. PowerShell examples use `npm.cmd` to avoid execution-policy restrictions on `npm.ps1`; other shells can use `npm`.

For a fresh checkout, run `npm.cmd ci` once. Do not reinstall dependencies for routine frontend changes.

```powershell
npm.cmd run dev
```

Open Astro's printed URL, normally <http://localhost:4321/> or <http://localhost:4321/en/>. Stop with Ctrl+C. The default server is local only.

## Verify and preview

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd run preview
```

`check` performs Astro/TypeScript diagnostics; `build` writes static output to ignored `dist/`. Production preview serves that output locally and does not deploy it. Use focused browser checks for changed behavior. Follow [AGENTS.md](AGENTS.md) for testing, artifact and completion-response rules.

The useful development-only design-system page is at `/design-system/` (Romanian) or `/design-system/?lang=en` (English). It uses demonstration content and shared components. It is excluded from production builds and production preview.

## Project map

| Location | Responsibility |
| --- | --- |
| `src/pages/`, `src/layouts/` | RO/EN routes, document metadata and shared layout |
| `src/components/home/` | Six homepage presentation chapters |
| `src/components/layout/`, `src/components/ui/` | Accessible shared navigation, controls and primitives |
| `src/i18n/` | Typed translations, homepage copy and navigation |
| `src/styles/global.css`, `src/styles/home.css` | Tailwind tokens, semantic themes and homepage composition |
| `src/lib/motion/` | Progressive homepage motion and reduced-motion handling |
| `src/assets/home/` | Exact render source copies, image mappings and localized alt text |
| `public/renders/`, `public/brand/` | Original owner-supplied renders, logos and concept board |
| `src/dev/` | Development-only design-system preview |
| `src/lib/wordpress/` | Reserved CMS boundary, currently unconnected |

Quicksand is bundled locally through Fontsource; its license remains in `public/fonts/OFL-Quicksand.txt`. Source renders and watermarks must be preserved.

## Environment and production

`.env.example` reserves `WORDPRESS_URL` for future build-time use. A real `.env` is unnecessary for current development: builds do not contact WordPress. Keep secrets out of `PUBLIC_` variables, Git and static output. Production WordPress and hosting require separate approval before modification.

## Maintained documentation

- [Project brief and content boundaries](docs/PROJECT_BRIEF.md)
- [Architecture, image pipeline and CMS plan](docs/ARCHITECTURE.md)
- [Design tokens, components and themes](docs/DESIGN_SYSTEM.md)
- [Current status and next steps](docs/IMPLEMENTATION_PLAN.md)
- [Retained editorial drafts](docs/CONTENT_ARCHIVE.md)
- [Permanent workflow rules](AGENTS.md)

Update these documents when their subject changes. Routine work does not need phase reports, screenshot collections or recordings. Requested diagnostic captures and temporary QA outputs belong outside the repository; generated fallback directories are ignored.
