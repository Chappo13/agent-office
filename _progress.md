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

## Next: Milestone A1
Full 3-zone shell in `apps/web/app/page.tsx` (not built yet — A0 was skeleton only).
