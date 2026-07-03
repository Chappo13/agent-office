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

## Milestone A2 — DONE

Isometric office render: agents are now positioned by GRID coordinates through a pure
projection util, not hardcoded pixels — A3 can swap the mock array for live Colyseus
x/y with zero layout changes.

Created:
- `apps/web/lib/iso.ts` — pure `isoProject(gx, gy, opts)` → `{x,y}` + `isoZIndex(gx,gy)`.
  `screenX = (gx-gy)*(tileW/2)+originX`, `screenY = (gx+gy)*(tileH/2)+originY`.
  Constants: GRID_SIZE=40, TILE_W=14, TILE_H=8, ORIGIN_X=320, ORIGIN_Y=60 (640×420 frame,
  same as A1's placeholder viewBox). alice(10,10) -> (320,140); bob(20,15) -> (355,200).
  Worked examples documented as comments (no test runner wired up yet — KISS).
- `apps/web/components/office/OfficeScene.tsx` (client) — background layer (procedural
  isometric room: floor diamond + 2 back walls + 3 desks + 2 plants, all placed via
  isoProject; swappable for a generated image via optional `backgroundImageUrl` prop,
  seam for A7) + sprite layer (`positions: OfficeAgentPosition[]`, paint-order sorted by
  `isoZIndex`, idle bob animation guarded by `prefers-reduced-motion`, hover/focus tooltip
  with role + "open chat" CTA, click/Enter/Space select with brand selection ring,
  role/tabIndex/aria a11y matching A1's pattern).

Edited:
- `apps/web/components/layout/OfficePanel.tsx` — replaced the inline placeholder `<svg>`
  block and the local `OfficeAgent` component with `<OfficeScene>`; mock positions
  (`alice`/`bob`, matching real backend agent ids) built from `MOCK_AGENTS` + translated
  name/role, `selectedAgentId` now a plain string id (was `"a"|"b"`). Topbar + RU hint kept.
- `apps/web/app/globals.css` — added `agent-bob` keyframe + `.animate-agent-bob` class
  inside the existing `prefers-reduced-motion: no-preference` block.
- `apps/web/lib/i18n/dictionaries/{ru,en}.ts` — `office.hintStep` "A2"→"A7" (A2 no longer
  the "real art" milestone — that's A7 now that positioning is real), reworded
  `office.hintPrefix` accordingly, added `office.tooltipOpenChat` key (RU "Открыть чат" /
  EN "Open chat").

Verified: `tsc --noEmit` clean (exit 0). Booted on :5175 (NODE_ENV=development), HTTP 200,
body contains RU labels ("Офис · изометрия", "Алиса", "Боб", "Координатор · онлайн", "A7"),
rendered SVG `transform="translate(320,140)"` / `"translate(355,200)"` match the iso.ts math
exactly, dev log has no errors/warnings. Killed after check, confirmed port 5175 free and no
stray process (only pre-existing unrelated dev servers on :5174 and in other repos remained).

## Next: Milestone A3
Wire live Colyseus x/y into the `positions` array feeding `OfficeScene` (replace
`MOCK_AGENTS` in OfficePanel.tsx) — no OfficeScene/iso.ts changes expected. Adversarial-review
gate before A3 too.
