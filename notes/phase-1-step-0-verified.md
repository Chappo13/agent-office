---
type: verification
phase: 1
step: 0
created: 2026-06-25
status: GO
---

# Phase 1 · Step 0 — De-Risk Spike (State Decode, Perception, Grid)

## 1. Что хотел сделать

Де-риск: проверить что Colyseus `state.agents` декодируется без `rootSchema`, что ключи MapSchema === `agent.id`, что форма perception понятна, и что числа в спеке (grid, clamps, spawns) совпадают с источником.

## 2. Что сделал

- Создал ветку `agent/teamly-style-ui` в форке.
- Создал ветку `agent/teamly-style-ui` в форке.
- Запустил backend (`OFFICE_MODEL=openai/gpt-4o-mini`) в фоне. Порт `:3000` занят `next-server` (PID 864622) — backend поднят на свободном порту.
- Запустил headless colyseus.js клиент из `packages/ui/` (workspace `node_modules`). Декодирование успешно, backend убит.
- Прочитал исходники: `OfficeRoom.ts`, `OfficeState.ts`, `Agent.ts`.
- **Независимая перепроверка (Opus, escalation #1):** поднят чистый backend на `:3005`, повторный headless-декод — идентичный результат (agents.size=2, alice 10,10 / bob 20,15, `keyEqualsId=true`, 12 полей в порядке декларации). Подтверждает, что числа — реальный runtime-decode, а не чтение исходника.

## 3. Проверенный контракт

| Допущение | Ожидалось | Фактически | Статус |
|---|---|---|---|
| state decode без rootSchema | работает | DECODE_OK agents.size=2 | MATCH |
| agents.size | 2 | 2 | MATCH |
| key===id (alice) | true | keyEqualsId: true | MATCH |
| key===id (bob) | true | keyEqualsId: true | MATCH |
| alice spawn x,y | 10, 10 | x=10, y=10 | MATCH |
| bob spawn x,y | 20, 15 | x=20, y=15 | MATCH |
| grid width×height | 40×40 | `grid: { width: 40, height: 40, tileSize: 16 }` (line 86) | MATCH |
| tileSize | 16 | 16 (line 86) | MATCH |
| movement clamp min | 2 | `minX: 2, minY: 2` (line 446) | MATCH |
| movement clamp max | 36 | `maxX: 36, maxY: 36` (line 446) | MATCH |
| AgentState 12 fields | id, name, x, y, direction, action, currentTask, thought, mood, reputation, riskLevel, momentum | Все 12 в указанном порядке (OfficeState.ts lines 4-15) | MATCH |
| AgentState field order | positional per schema | Порядок декларации совпадает с toJSON() output | MATCH |

## 4. Форма perception / recentMessages

Из `OfficeRoom.ts` ~245-251, `Agent.ts` lines 6-13, 40-44, 82-90:

```ts
// Perception object (built in OfficeRoom.update(), passed to coreAgent.think()):
{
  time: string,               // this.state.officeTime
  location: string,           // `${agentState.x},${agentState.y}`
  nearbyAgents: Array<{       // all other agents with manhattan distance
    name: string,
    role: string,
    distance: number
  }>,
  currentTask: any | null,    // coreAgent.currentTask || null
  recentMessages: ConversationMessage[],  // coreAgent.getUnreadMessages()
  memories: string[]          // coreAgent.getRecentMemories(5)
}

// ConversationMessage shape (Agent.ts line 40-45):
{
  from: string,       // sender name
  to: string,        // recipient name
  content: string,   // message text
  timestamp: string  // this.state.officeTime at send time
}
```

**Важно (уточнено перепроверкой):** `getUnreadMessages()` возвращает `[...this.inbox]` — shallow copy, сам инбокс НЕ чистит. НО `clearInbox()` **вызывается** в `OfficeRoom.ts:299` (`// Clear after processing`) — только это **внутри ветки обработки `talk`-решения** (`if (decision.action === 'talk' && decision.message)`). То есть инбокс чистится лишь когда агент в этот think решил `action:talk`. Если think прошёл без talk (любое другое решение / parse-fail / idle) — инбокс НЕ очищается → те же сообщения перечитываются на следующем тике (до авто-обрезки 20). Спека (стр.94: «чистится при следующем talk, OfficeRoom.ts:299») это описала **верно**. Вывод для Step 4a: consume-on-read нужен именно для **no-talk / immediate-think** путей — помечать сообщение прочитанным при попадании в perception, не полагаясь на talk-ветку.

## 5. Полный state.toJSON()

```json
{
  "agents": {
    "alice": {
      "id": "alice",
      "name": "Alice",
      "x": 10,
      "y": 10,
      "direction": "down",
      "action": "idle",
      "currentTask": "",
      "thought": "",
      "mood": 0.6,
      "reputation": 0.5,
      "riskLevel": 0.2,
      "momentum": 0.4
    },
    "bob": {
      "id": "bob",
      "name": "Bob",
      "x": 20,
      "y": 15,
      "direction": "down",
      "action": "idle",
      "currentTask": "",
      "thought": "",
      "mood": 0.6,
      "reputation": 0.5,
      "riskLevel": 0.2,
      "momentum": 0.4
    }
  },
  "officeTime": "2026-06-25T11:01:58.117Z",
  "timeScale": 1
}
```

## 6. Что неожиданного

- **Порт `:3000` занят `next-server`** (PID 864622) на этой машине. Спека/handoff предполагают backend на `:3000`. Для dev → `PORT=<свободный>` override (проверено на :3002 и :3005). UI читает `?ws=`/localStorage (Game.ts), так что указать порт фронту тривиально. Зафиксировать в README/spec как dev-нюанс (не баг кода).
- `clearInbox()` срабатывает только на talk-решение (OfficeRoom.ts:299), не на каждый think → на no-talk-тиках сообщения остаются. Спека это предусмотрела (стр.94); consume-on-read — задача Step 4a, не gate-блокер.
- При join клиент логирует `colyseus.js: onMessage() not registered` для broadcast-типов `relationship-update`, `layout-sync`, `tasks-sync` (сервер их шлёт). Спека перечисляла `chat`/`task-update`/`layout-sync` — есть ещё `relationship-update` и `tasks-sync`. **Для Step 2:** зарегистрировать (или осознанно проигнорировать) эти типы, иначе консоль засорена ворнингами.
- Backend загружает 20 memory-записей из SQLite (`./data/office-memory.db`) при старте — персистентное состояние от прошлых сессий. На state decode не влияет, на поведение think() — да (cold-start `thought`/`action` отличается). Decode-проверка делалась до первого think (≈3с), поэтому поля чистые.

## 7. GATE: GO

Все проверки пройдены. Decode работает без rootSchema, все ключи совпадают, spawns/grid/clamps точные. Форма perception понята.

**Правки/заметки (ни одна не блокирует gate):**
- Порт: спека говорит `:3000`, на машине занят `next-server`. Dev → `PORT=<свободный>` override. Зафиксировать в spec/README (dev-нюанс, не правка контракта).
- consume-on-read: спека (стр.94) **ВЕРНА** — `clearInbox()` вызывается при talk (OfficeRoom.ts:299). Правка спеки НЕ нужна. Это реализационная задача **Step 4a** (consume-on-read для no-talk / immediate-think путей), не gate-блокер.
- Broadcast-типы `relationship-update` / `tasks-sync` (сверх спековых `chat`/`task-update`/`layout-sync`) — учесть в Step 2 при подписке.

## 8. Следующий шаг

**Step 1** (по спеке) — scaffold `packages/ui-teamly/`: Vite7 + React18.2 + TS с EXACT pins, свой tsconfig (`react-jsx`, без `experimentalDecorators`), 3 зоны layout (250/canvas/380), светлая тема + cyan, RU-плейсхолдеры, RU/EN тоггл (react-i18next). Готово когда: dev на :5174, чистый `tsc --noEmit`, чистая консоль. Colyseus-коннект — Step 2, изометрия на PixiJS 7 (НЕ Phaser) — Step 3.
