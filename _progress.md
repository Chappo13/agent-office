# Progress — Teamly-clone build

Plan: ~/projects/agent-mastery/artifacts/teamly-clone-build-plan.md

## Milestone A0 — DONE

Scaffolded a minimal Next.js 14 web app in the monorepo (bare skeleton, no features).

Created:
- `apps/web/package.json` (@agent-office/web, next 14.2, react/react-dom 18.3.1, ts/tailwind/postcss/autoprefixer devDeps)
- `apps/web/next.config.mjs`
- `apps/web/tsconfig.json`
- `apps/web/postcss.config.mjs`
- `apps/web/tailwind.config.ts` (brand/ink/canvas/surface/success tokens)
- `apps/web/app/globals.css`
- `apps/web/app/layout.tsx` (root layout, lang="ru", metadata "AI Офис")
- `apps/web/app/page.tsx` (minimal placeholder, server component)
- `apps/web/.gitignore`

Edited:
- root `package.json` — added `"apps/*"` to `workspaces` (kept `packages/*`, `examples/*`)

Verified: typecheck PASS, build PASS, dev boot HTTP 200 with "AI Офис" in HTML.

Notable environment issue (not app-related): sandbox has `NODE_ENV=production` set globally.
This caused (a) `npm install` to silently omit all devDependencies repo-wide (fixed via
`npm install --include=dev`), and (b) `next dev`'s CSS/postcss webpack chain to break
(fixed for verification by running with `NODE_ENV=development` override). Root package-lock.json
is gitignored (regenerated per-environment) so a full `rm -rf node_modules package-lock.json && npm
install --include=dev` was safe and didn't touch any package's declared dependency versions.
If future `npm install`/`npm run dev` invocations in this sandbox omit devDependencies or break
next dev's CSS pipeline again, check `printenv NODE_ENV` first.

Branch: `agent/teamly-web` (off `agent/teamly-style-ui`).

## Milestone A1 — DONE

Ported the approved mockup (`teamly-shell-mockup.html`) into real Next.js/React/Tailwind
components: static 3-zone shell (sidebar 256px / office 1fr / chat 388px), pixel-font chrome
(Pixelify Sans self-hosted, cyrillic+latin @font-face with unicode-range), SVG isometric
office placeholder, RU/EN toggle via a KISS context-based i18n layer.

Created:
- `apps/web/lib/i18n/dictionaries/{ru,en,index}.ts`, `apps/web/lib/i18n/LanguageProvider.tsx` (`useT`/`useLanguage`)
- `apps/web/components/ui/{Avatar,StatusDot,NavItem,LangToggle,TonePill}.tsx`
- `apps/web/components/layout/{LeftSidebar,OfficePanel,ChatPanel}.tsx`

Edited:
- `apps/web/tailwind.config.ts` — finalized token set to match spec exactly (brand-dark
  #3f4bc5, brand-tint, ink-muted #6b7291, panel, sidebar, surface #eef1f6, line, amber)
- `apps/web/app/globals.css` — @font-face (cyrillic+latin, local woff2, unicode-range),
  thin-scrollbar utility, typing-blink + selection-spin keyframes (prefers-reduced-motion guarded)
- `apps/web/app/layout.tsx` — wraps children in `LanguageProvider`
- `apps/web/app/page.tsx` — composes the 3-zone shell, lifts `activeNav` state
- `apps/web/package.json` — added `lucide-react` dependency

Interactivity: active nav (useState), RU/EN toggle (context, swaps all copy incl. `<html lang>`),
tone pill selection (useState), office agent click → `selectedAgentId` (visual dashed ring +
`animate-selection-spin`). Send/chips/hire/model-tier are visual-only — wiring is A3–A5.

Verified: `tsc --noEmit` clean; `next dev -p 5174` boots, HTTP 200, HTML contains "Офис" and
"Координатор" plus all other RU labels; dev log has no errors/warnings; PID killed after check,
confirmed no stray `next dev -p 5174` process (port 5174 connection-refused after kill).

## Next: Milestone A2
Office: webp background + positioned agent sprites (replace SVG placeholder), idle/typing
states, hover-tooltip. Adversarial-review gate.
