"use client";

import { useEffect, useRef } from "react";
import { connectOffice, leaveOffice, type OfficeRoom, type ServerAgentState } from "@/lib/colyseus";
import { useOfficeStore, type OfficeAgent } from "@/lib/stores/officeStore";
import { useChatStore } from "@/lib/stores/chatStore";
import { getAgentRole } from "@/lib/roles";

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY_MS = 2000;

function toStoreAgent(item: ServerAgentState): OfficeAgent {
  const { displayName, role, color } = getAgentRole(item.id);
  return {
    id: item.id,
    gx: item.x,
    gy: item.y,
    name: displayName,
    role,
    color,
    action: item.action,
    thought: item.thought,
    mood: item.mood,
  };
}

/**
 * Connects to the live Colyseus office room once, at the app shell root.
 * Client-only (colyseus.ts touches `window`) — must run inside a `useEffect`
 * so nothing live is ever rendered during SSR.
 */
export function useOfficeConnection(): void {
  const roomRef = useRef<OfficeRoom | null>(null);
  const attemptsRef = useRef(0);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    connect();

    return () => {
      cancelledRef.current = true;
      leaveOffice(roomRef.current);
      roomRef.current = null;
    };

    async function connect() {
      useOfficeStore.getState().setStatus("connecting");
      try {
        const room = await connectOffice();
        if (cancelledRef.current) {
          leaveOffice(room);
          return;
        }
        roomRef.current = room;
        attemptsRef.current = 0;
        useOfficeStore.getState().resetAgents();
        useOfficeStore.getState().setStatus("online");

        room.state.agents.onAdd((item, _key) => {
          useOfficeStore.getState().upsertAgent(toStoreAgent(item));
        }, true);
        room.state.agents.onChange((item, _key) => {
          useOfficeStore.getState().upsertAgent(toStoreAgent(item));
        });
        room.state.agents.onRemove((_item, key) => {
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
        // No UI consumer for these yet (A4/A5+) — registered so colyseus.js
        // doesn't log "onMessage() not registered" warnings (Step 0 finding).
        room.onMessage("task-update", () => {});
        room.onMessage("layout-sync", () => {});
        room.onMessage("relationship-update", () => {});
        room.onMessage("tasks-sync", () => {});

        room.onLeave(() => {
          if (cancelledRef.current) return;
          useOfficeStore.getState().setStatus("offline");
          scheduleReconnect();
        });
        room.onError((code, message) => {
          console.error("[office] room error", code, message);
          if (cancelledRef.current) return;
          useOfficeStore.getState().setStatus("offline");
          scheduleReconnect();
        });
      } catch (err) {
        console.error("[office] connect failed", err);
        if (cancelledRef.current) return;
        useOfficeStore.getState().setStatus("offline");
        scheduleReconnect();
      }
    }

    function scheduleReconnect() {
      if (cancelledRef.current) return;
      if (attemptsRef.current >= MAX_RECONNECT_ATTEMPTS) return;
      attemptsRef.current += 1;
      setTimeout(() => {
        if (!cancelledRef.current) connect();
      }, RECONNECT_DELAY_MS);
    }
  }, []);
}
