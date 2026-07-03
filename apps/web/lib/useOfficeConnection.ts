"use client";

import { useEffect } from "react";
import {
  connectOffice,
  leaveOffice,
  type OfficeRoom,
  type ServerAgentState,
} from "@/lib/colyseus";
import { useOfficeStore, type OfficeAgent } from "@/lib/stores/officeStore";
import { useChatStore } from "@/lib/stores/chatStore";
import { getAgentRole } from "@/lib/roles";

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY_MS = 2000;

// Server emits all of these (Step 0 + review of OfficeRoom.ts). Registered as
// no-ops so colyseus.js doesn't warn "onMessage() not registered"; 'chat' is
// handled separately with a real consumer.
const IGNORED_BROADCASTS = [
  "task-update",
  "layout-sync",
  "relationship-update",
  "tasks-sync",
  "highlight-event",
  "scenario-event",
];

// Display name/role are language-dependent → resolved reactively in the
// component (i18n by id). The store carries only language-independent data
// plus the id-based color.
function toStoreAgent(item: ServerAgentState): OfficeAgent {
  return {
    id: item.id,
    gx: item.x,
    gy: item.y,
    color: getAgentRole(item.id).color,
    action: item.action,
    thought: item.thought,
    mood: item.mood,
  };
}

/**
 * Connects to the live Colyseus office room once, at the app shell root.
 * Client-only — runs in a useEffect so nothing live renders during SSR.
 */
export function useOfficeConnection(): void {
  useEffect(() => {
    // Per-effect-run state (plain locals, NOT refs). React StrictMode does
    // mount → cleanup → mount in dev; making each run own its connection means
    // its cleanup fully tears that run down, with no shared flag a later run
    // could reset out from under an in-flight connect (that was leaking a
    // second room + duplicating every broadcast).
    let cancelled = false;
    let room: OfficeRoom | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;
    const changeDisposers = new Map<string, () => void>();

    void connect();

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = null;
      changeDisposers.forEach((dispose) => dispose());
      changeDisposers.clear();
      leaveOffice(room);
      room = null;
    };

    async function connect(): Promise<void> {
      useOfficeStore.getState().setStatus("connecting");

      let joined: OfficeRoom;
      try {
        joined = await connectOffice();
      } catch (err) {
        console.error("[office] connect failed", err);
        if (cancelled) return;
        useOfficeStore.getState().setStatus("offline");
        scheduleReconnect();
        return;
      }

      // Unmounted / superseded while joinOrCreate was in flight → drop it so
      // its socket doesn't linger with live listeners writing into the store.
      if (cancelled) {
        leaveOffice(joined);
        return;
      }

      room = joined;
      attempts = 0;
      useOfficeStore.getState().resetAgents();
      useOfficeStore.getState().setStatus("online");

      const agents = room.state.agents;

      agents.onAdd((item, key) => {
        useOfficeStore.getState().upsertAgent(toStoreAgent(item));
        // MAP-level onChange does NOT fire on nested field mutation in
        // @colyseus/schema 2.x; the server mutates AgentState in place every
        // tick. The fork's own Phaser UI (packages/ui/src/game/Game.ts:615)
        // uses this same per-instance subscription — mirror it so agents
        // actually move/update instead of freezing at their spawn snapshot.
        const dispose = item.onChange(() => {
          useOfficeStore.getState().upsertAgent(toStoreAgent(item));
        });
        changeDisposers.set(key, dispose);
      }, true);

      agents.onRemove((_item, key) => {
        changeDisposers.get(key)?.();
        changeDisposers.delete(key);
        useOfficeStore.getState().removeAgent(key);
      });

      room.onMessage("chat", (message: { sender: string; text: string }) => {
        useChatStore.getState().append({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          from: message.sender,
          text: message.text,
          ts: Date.now(),
        });
      });
      for (const type of IGNORED_BROADCASTS) {
        room.onMessage(type, () => {});
      }

      // Single reconnect trigger. An abnormal socket close ALWAYS fires
      // onLeave, and per the WS spec is preceded by onError — so scheduling a
      // reconnect in both would double-dispatch (burn retry attempts + spawn a
      // duplicate room). onError only logs + flags offline.
      room.onError((code, message) => {
        console.error("[office] room error", code, message);
        if (cancelled) return;
        useOfficeStore.getState().setStatus("offline");
      });
      room.onLeave(() => {
        room = null;
        if (cancelled) return; // our own cleanup leaveOffice() — don't reconnect
        useOfficeStore.getState().setStatus("offline");
        scheduleReconnect();
      });
    }

    function scheduleReconnect(): void {
      if (cancelled || reconnectTimer) return; // dedup: one pending reconnect
      if (attempts >= MAX_RECONNECT_ATTEMPTS) return;
      attempts += 1;
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        if (!cancelled) void connect();
      }, RECONNECT_DELAY_MS);
    }
  }, []);
}
