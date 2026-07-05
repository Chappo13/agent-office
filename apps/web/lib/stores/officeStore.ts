import { create } from "zustand";

export type OfficeAgent = {
  id: string;
  gx: number;
  gy: number;
  color: string;
  action: string;
  thought: string;
  mood: number;
};

export type ConnectionStatus = "connecting" | "online" | "offline";

export type ChatSendPayload = { text: string; tone: string; agentId: string };

type OfficeStore = {
  agents: Record<string, OfficeAgent>;
  status: ConnectionStatus;
  // Shared across OfficePanel (sets it on agent click) and ChatPanel (reads
  // it as the send target) — was OfficePanel-local `useState` before A5.
  selectedAgentId: string;
  // Bound to `room.send("chat", payload)` by useOfficeConnection once
  // connected; reset to a no-op while offline so calling it is always safe.
  sendChat: (payload: ChatSendPayload) => void;
  setStatus: (status: ConnectionStatus) => void;
  upsertAgent: (agent: OfficeAgent) => void;
  removeAgent: (id: string) => void;
  resetAgents: () => void;
  setSelectedAgentId: (id: string) => void;
  setSendChat: (sendChat: (payload: ChatSendPayload) => void) => void;
};

// Empty initial state on purpose — live data only ever lands here from a
// useEffect after connect (client-side), never during SSR/first render.
export const useOfficeStore = create<OfficeStore>((set) => ({
  agents: {},
  status: "connecting",
  selectedAgentId: "alice",
  sendChat: () => {},
  setStatus: (status) => set({ status }),
  upsertAgent: (agent) =>
    set((state) => ({ agents: { ...state.agents, [agent.id]: agent } })),
  removeAgent: (id) =>
    set((state) => {
      const next = { ...state.agents };
      delete next[id];
      return { agents: next };
    }),
  resetAgents: () => set({ agents: {} }),
  setSelectedAgentId: (selectedAgentId) => set({ selectedAgentId }),
  setSendChat: (sendChat) => set({ sendChat }),
}));
