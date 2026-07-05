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

## Milestone A3 — DONE

Wired the frontend to the fork's LIVE Colyseus engine. Office now renders real
agents from backend state; `MOCK_AGENTS` is gone.

Created:
- `apps/web/lib/roles.ts` — id → `{displayName, role, color}` RU lookup (decision D1),
  `alice`→Алиса/Координатор, `bob`→Боб/Ресёрчер, grey fallback for unknown ids.
- `apps/web/lib/colyseus.ts` — client module. `resolveWsUrl()` (`?ws=` → `NEXT_PUBLIC_OFFICE_WS`
  → default `ws://localhost:3005`), `connectOffice()`/`leaveOffice()`. Defines a local
  structural `OfficeState`/`ServerAgentState` type (duck-typed MapSchema shape) instead of
  importing `@colyseus/schema` — `joinOrCreate<T>` has no default generic, so without this
  `room.state` types as `unknown` under strict mode.
- `apps/web/lib/stores/officeStore.ts` (zustand) — `agents: Record<id, OfficeAgent>` (gx/gy/
  name/role/color/action/thought/mood), `status: connecting|online|offline`, upsert/remove/reset.
- `apps/web/lib/stores/chatStore.ts` (zustand) — `messages: {id,from,text,ts}[]`, append/reset.
- `apps/web/lib/useOfficeConnection.ts` — client hook, called once at app root. Connects via
  colyseus.ts; `room.state.agents.onAdd/onChange/onRemove` (item,key signature, per
  `@colyseus/schema` 2.0.37's collection-level callback API) → officeStore, merging roles.ts
  by id; registers all 5 broadcast handlers (`chat` pushes into chatStore, the other 4 are
  no-ops to silence colyseus.js's "onMessage() not registered" warning per Step 0); tracks
  connection status; simple reconnect (max 3 attempts, 2s delay) on `onLeave`/`onError`/connect
  failure.
- `apps/web/components/ui/ConnectionIndicator.tsx` — dot + label, green/grey/pulsing-amber for
  online/offline/connecting.

Edited:
- `apps/web/app/page.tsx` — calls `useOfficeConnection()` once at the shell root.
- `apps/web/components/layout/OfficePanel.tsx` — `MOCK_AGENTS` removed; positions now
  `Object.values(useOfficeStore().agents)` (still flows only through `isoProject`, OfficeScene/
  iso.ts untouched). Empty/connecting state renders `t.office.connecting` ("Подключение…")
  instead of `OfficeScene`. `ConnectionIndicator` added to the topbar.
- `apps/web/components/layout/ChatPanel.tsx` — renders live `chatStore` messages (newest last,
  `sender === "User"` styled outgoing/right, everything else incoming/left) when present, else
  keeps the original placeholder examples. Send stays non-functional (A4/A5).
- `apps/web/lib/i18n/dictionaries/{ru,en}.ts` — added `topbar.connOnline/connOffline/
  connConnecting`, `office.connecting`; removed `office.agentA/agentB` (orphaned — their only
  caller was the now-deleted `MOCK_AGENTS` mapping in OfficePanel).
- `apps/web/app/globals.css` — added `connection-pulse` keyframe + `.animate-connection-pulse`,
  inside the existing `prefers-reduced-motion: no-preference` guard.
- `apps/web/package.json` — added `colyseus.js@0.15.28` (exact, matches root) and
  `zustand@^4.5.7` (latest 4.x).

Verified:
- `npm ls @colyseus/schema` from repo root: single version `2.0.37` everywhere (server, ui,
  web all dedupe to it); confirmed only one physical `node_modules/@colyseus/schema` dir on
  disk — no dual-package hazard.
- `tsc --noEmit` (apps/web) clean, exit 0.
- Engine booted `PORT=3005 OFFICE_MODEL=openai/gpt-4o-mini node packages/server/dist/index.js`
  → log confirmed "AgentOffice Engine listening on ws://localhost:3005".
- Headless sanity script (colyseus.js via root `NODE_PATH`) against `:3005`: reading
  `room.state.agents.size` synchronously right after `joinOrCreate()` resolves races the first
  state patch and reads `0` (the join promise resolves before the initial full-state sync
  message arrives) — switched to asserting via the `onAdd(cb, triggerAll=true)` callback
  instead (exactly what `useOfficeConnection.ts` does), which is the correct pattern.
  Result: `agents.size=2`, keys `["alice","bob"]` — PASS. This is a useful confirmation that
  the hook's event-driven approach (not a synchronous read) is required, not just a style choice.
- Booted web on `:5176` (`NODE_ENV=development`, `NEXT_PUBLIC_OFFICE_WS=ws://localhost:3005`):
  HTTP 200, SSR body contains RU labels including "Подключение" (confirms the connecting/empty
  state renders server-side with no live data — no hydration mismatch, since the store starts
  empty and only populates client-side in `useOfficeConnection`'s `useEffect`). Dev log clean,
  no compile errors/warnings. (No headless-browser tooling in this environment to capture actual
  browser console output — verification follows the same curl+dev-log-log convention used in
  A1/A2.)
- Killed both the `:5176` web process and the `:3005` engine after verification (engine spends
  OpenRouter credits while running); confirmed both ports free and no stray processes; confirmed
  `:5174` (pre-existing dev server, left untouched throughout) still serving HTTP 200.

## Next: Milestone A4
Chat wiring + immediate-think (consume-on-read fix from Step 0 finding #2) on Opus+Thinking.
`chat` SEND becomes functional; ChatPanel's composer currently posts nowhere.

## Milestone A5 — DONE

Wired the ChatPanel composer end-to-end: user can send a chat message to the selected
agent from the browser and see the live reply. Backend (A4) and the `chat` broadcast
listener (A3) were already done — this only adds the send path + shared selection state.

Edited:
- `apps/web/lib/stores/officeStore.ts` — added `selectedAgentId` (default `"alice"`) +
  `setSelectedAgentId`, and `sendChat: (payload: ChatSendPayload) => void` (default no-op)
  + `setSendChat`. `ChatSendPayload = {text, tone, agentId}` exported for reuse.
- `apps/web/lib/useOfficeConnection.ts` — on successful connect, `setSendChat((p) =>
  joined.send("chat", p))`; reset back to a local `noopSendChat` on every disconnect path
  (`connectOffice` failure, `room.onError`, `room.onLeave`, and effect cleanup/unmount) so
  calling `sendChat` while offline is always inert, never throws.
- `apps/web/components/layout/OfficePanel.tsx` — `selectedAgentId` moved out of local
  `useState` into `useOfficeStore`; `OfficeScene` still just receives it as a prop
  (untouched itself), now sourced from the store so ChatPanel reads the same value.
- `apps/web/components/layout/ChatPanel.tsx` — controlled draft-text `useState`; tone
  pills now map to a `tone` key already passed to `sendChat`; send on button click or
  Enter (Shift+Enter inserts a newline via default textarea behavior, since preventDefault
  only fires for plain Enter); trims text, no-ops if empty or status isn't `"online"`;
  calls `sendChat({text, tone, agentId: selectedAgentId || "alice"})` only — never appends
  to `chatStore` directly (the backend's echo broadcast + existing A3 listener already
  renders the sent message, so no duplicate). Send button disabled + visually softened
  (opacity/cursor) when not online. Header now shows `t.agents[selectedAgentId].name`,
  falling back to `t.chat.title` ("Координатор"/"Coordinator") for unknown ids. Textarea
  got an `aria-label` (reusing `composerPlaceholder`) since it had none before. Existing
  live-vs-placeholder conditional (`messages.length > 0`) was already correct — no fix
  needed there. No new i18n keys required (reused `chat.title` and
  `chat.composerPlaceholder`).

Verified:
- `npm run typecheck --workspace=@agent-office/web` → `tsc --noEmit`, exit 0, clean.
- Booted `NODE_ENV=development npm run dev --workspace=@agent-office/web -- -p 5177`:
  HTTP 200; response HTML contains the composer's placeholder/aria-label text and
  "Отправить" unconditionally (composer renders regardless of connection/message state).
  Confirmed via `ss -ltnp` that :5177 was a distinct process from the pre-existing :5174
  server (left untouched throughout); killed the :5177 process after the check, :5174
  still up afterward.
- Code-traced the full send path by reading the final files: ChatPanel's button
  `onClick`/textarea `onKeyDown` → `handleSend()` → `useOfficeStore().sendChat(...)` →
  in `useOfficeConnection.ts`, bound to `room.send("chat", payload)` on connect, reset to
  `noopSendChat` on every disconnect path.

Diff: 4 files changed, 67 insertions(+), 5 deletions(-) (~72 lines touched).

## Milestone A6 — DONE

Sidebar tabs are now functional: clicking Офис/Задачи/Активность/Артефакты switches the
CENTER column; the right ChatPanel (coordinator chat) stays mounted on every tab. Live
`task-update` and `highlight-event` broadcasts (previously registered as no-op handlers in
A3, per Step 0's server-contract review) now feed a real Task Board and Activity Feed.

Created:
- `apps/web/lib/stores/taskStore.ts` (zustand) — `tasks: Record<title, OfficeTask>`
  (`id/title/agentId/agentName/status`), `upsertTask`, cap 50 via evicting
  `Object.keys(tasks)[0]` (oldest-inserted; JS preserves string-key insertion order, and a
  same-title re-broadcast updates in place without moving position).
- `apps/web/lib/stores/activityStore.ts` (zustand) — `events: OfficeActivityEvent[]`
  (`id/type/title/body/agentId?/time`), `pushEvent` (newest-first, `slice(0, 50)`).
- `apps/web/components/layout/MainArea.tsx` — center-column router reading
  `officeStore.activeTab`: `office`→`OfficePanel`, `tasks`→`TaskBoard`,
  `activity`→`ActivityFeed`, `artifacts`→inline tasteful "Скоро" placeholder card.
- `apps/web/components/layout/TaskBoard.tsx` — header + composer (text input + "Создать
  задачу" button → `officeStore.sendTask({title})`, Enter-to-submit, disabled while
  offline) + task list (title, agent display name resolved via `t.agents[agentId]` same
  pattern as OfficePanel, falling back to the server's raw `agentName` then the id, status
  pill with a per-status dot color) + empty state.
- `apps/web/components/layout/ActivityFeed.tsx` — header + chronological (newest-first)
  event list: dot color by highlight `type` (covers all 9 types seen in OfficeRoom.ts —
  conversation/task/hiring/tool/scenario/character_arc/chaos/high_risk/audience_vote —
  unmapped future types fall back to a grey dot), title, body, agent name when `agentId`
  is present, local `formatRelativeTime()` helper (just now / Nm / Nh / Nd, i18n'd
  suffixes, no interpolation infra existed in the codebase so kept to simple concatenation)
  + empty state.

Edited:
- `apps/web/lib/stores/officeStore.ts` — added `activeTab: ActiveTab` (default `"office"`)
  + `setActiveTab` (LeftSidebar's nav highlight + MainArea's switch both read this; kept
  here rather than a new uiStore since it's simple cross-component UI state alongside
  `selectedAgentId`/connection status this store already carries), and `sendTask` +
  `setSendTask` — bound to `room.send("assign-task", payload)` the same way `sendChat` is
  bound to `room.send("chat", payload)`.
- `apps/web/lib/useOfficeConnection.ts` — `task-update` and `highlight-event` moved out of
  `IGNORED_BROADCASTS` into real `room.onMessage` handlers → `taskStore.upsertTask` /
  `activityStore.pushEvent` (id generated the same way as the existing `chat` handler:
  `${Date.now()}-${random}`). `setSendTask((payload) => joined.send("assign-task", payload))`
  wired on connect, reset to a local `noopSendTask` on every disconnect path (connect
  failure, `onError`, `onLeave`, effect cleanup) — mirrors the existing `sendChat`/
  `noopSendChat` pattern exactly. Tasks/activity are NOT reset on reconnect (unlike
  `resetAgents()`): both stores are pure incremental broadcast logs with no full-resync
  payload consumed (`tasks-sync` stays a no-op per the milestone's scope), so there's
  nothing to discard on a short reconnect blip — a decision, not an oversight.
- `apps/web/components/layout/LeftSidebar.tsx` — dropped the `activeNav`/`onNavChange`
  props and local `NavKey` type; now reads/writes `officeStore.activeTab` directly via
  `ActiveTab` (re-exported from officeStore).
- `apps/web/app/page.tsx` — dropped the lifted `useState<NavKey>`; renders
  `<LeftSidebar /><MainArea /><ChatPanel />` (no props threaded for the tab anymore).
- `apps/web/lib/i18n/dictionaries/{ru,en}.ts` — added `tasks` (title/composerPlaceholder/
  create/empty/unassigned/status.{in_progress,todo,done,blocked}), `activity`
  (title/empty/timeJustNow/timeMinutesSuffix/timeHoursSuffix/timeDaysSuffix), `artifacts`
  (comingSoonTitle/comingSoonBody). Key trees identical between ru/en (enforced by `en.ts`
  typing itself as `Dictionary = typeof ru`).

Verified:
- `npm run typecheck --workspace=@agent-office/web` → `tsc --noEmit`, exit 0, clean.
- Booted `NODE_ENV=development npx next dev -p 5177`: HTTP 200; response HTML contains all
  four nav labels ("Задачи", "Активность", "Артефакты") plus the default-tab's
  "Офис · изометрия" (confirms SSR still renders the `office` tab by default — no
  hydration mismatch, since `officeStore.activeTab` defaults to `"office"` and only
  changes client-side). `TaskBoard`/`ActivityFeed` aren't reachable via a pure SSR curl
  (client zustand state, not a URL param) but are in `MainArea`'s static import graph, so
  a type or syntax error in either would have failed the same `tsc`/webpack compile that
  passed cleanly (webpack log: "Compiled / in 9s (626 modules)", no errors/warnings besides
  benign stale-webpack-cache restore warnings unrelated to this change). Killed the :5177
  process after (`fuser -k 5177/tcp`); confirmed :5174 (pre-existing, untouched) still
  serving HTTP 200 throughout and after.
- Code-traced: NavItem click → `LeftSidebar` `setActiveTab` → `MainArea` re-renders the
  matching panel. Server `task-update`/`highlight-event` → `useOfficeConnection`'s new
  handlers → `taskStore.upsertTask` / `activityStore.pushEvent` → `TaskBoard`/
  `ActivityFeed` re-render via their `useTaskStore`/`useActivityStore` selectors.
  `TaskBoard`'s composer → `officeStore.sendTask` → (bound on connect) →
  `room.send("assign-task", {title})` → server persists + broadcasts `task-update` (+ a
  `chat` system line, already rendered by the existing A3 chat listener) → round-trips
  back through the same `task-update` handler into `taskStore`.

## Next: Milestone A7
Generated office art (background swap in OfficeScene's optional `backgroundImageUrl` seam)
+ Artifacts tab real content (currently a placeholder).
