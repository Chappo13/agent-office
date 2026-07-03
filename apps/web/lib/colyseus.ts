/**
 * Colyseus client module. Client-only (uses `window.location`) — never
 * imported from a server component.
 *
 * Per Step 0 (notes/phase-1-step-0-verified.md): `joinOrCreate('office')`
 * decodes `state` fine WITHOUT a generated rootSchema (colyseus.js 0.15.28
 * via Reflection). Do NOT import `@colyseus/schema` here or anywhere in
 * apps/web — that's how a second copy of the schema package would sneak in
 * and break decoding (dual-package hazard).
 */
import * as Colyseus from "colyseus.js";

export const OFFICE_ROOM_NAME = "office";
const DEFAULT_WS_URL = "ws://localhost:3005";

/**
 * Structural (duck-typed) mirror of the decoded backend state — NOT an
 * import of `@colyseus/schema`. `joinOrCreate` has no default generic, so
 * without this the decoded `room.state` would type as `unknown`. The real
 * runtime object is still a `MapSchema` (decoded via Reflection, Step 0)
 * with these exact callback methods; this type just describes that shape
 * for the compiler.
 */
export type ServerAgentState = {
  id: string;
  name: string;
  x: number;
  y: number;
  direction: string;
  action: string;
  currentTask: string;
  thought: string;
  mood: number;
  reputation: number;
  riskLevel: number;
  momentum: number;
  /**
   * Per-instance schema callback — the real runtime value is a Schema. The
   * MAP-level onChange does NOT fire on nested field mutation in
   * @colyseus/schema 2.x, so field updates (movement/mood/action) must be
   * observed per instance (useOfficeConnection; cf. the fork's Game.ts:615).
   */
  onChange(callback: () => void): () => void;
};

type SchemaMapLike<V> = {
  onAdd(callback: (item: V, key: string) => void, triggerAll?: boolean): () => void;
  onChange(callback: (item: V, key: string) => void): () => void;
  onRemove(callback: (item: V, key: string) => void): () => void;
  forEach(callback: (item: V, key: string) => void): void;
};

export type OfficeState = {
  agents: SchemaMapLike<ServerAgentState>;
  officeTime: string;
  timeScale: number;
};

/** ?ws= query param → NEXT_PUBLIC_OFFICE_WS env → default :3005. */
export function resolveWsUrl(): string {
  if (typeof window !== "undefined") {
    const fromQuery = new URLSearchParams(window.location.search).get("ws");
    if (fromQuery) return fromQuery;
  }
  return process.env.NEXT_PUBLIC_OFFICE_WS || DEFAULT_WS_URL;
}

export type OfficeRoom = Colyseus.Room<OfficeState>;

export async function connectOffice(): Promise<OfficeRoom> {
  const client = new Colyseus.Client(resolveWsUrl());
  return client.joinOrCreate<OfficeState>(OFFICE_ROOM_NAME);
}

export function leaveOffice(room: OfficeRoom | null | undefined): void {
  room?.leave();
}
