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

// A6: which center-column panel is showing. Sourced from LeftSidebar's nav
// clicks, consumed by MainArea — lives here (not a separate uiStore) since
// it's simple UI state alongside the other cross-component fields this store
// already carries (selectedAgentId, connection status).
export type ActiveTab = "office" | "tasks" | "activity" | "artifacts";

export type SendTaskPayload = { title: string };

type OfficeStore = {
  agents: Record<string, OfficeAgent>;
  status: ConnectionStatus;
  // Shared across OfficePanel (sets it on agent click) and ChatPanel (reads
  // it as the send target) — was OfficePanel-local `useState` before A5.
  selectedAgentId: string;
  // Which center-column tab is active (A6). Default "office" — LeftSidebar's
  // nav highlight and MainArea's render-by-tab both read this.
  activeTab: ActiveTab;
  // Bound to `room.send("chat", payload)` by useOfficeConnection once
  // connected; reset to a no-op while offline so calling it is always safe.
  sendChat: (payload: ChatSendPayload) => void;
  // Bound to `room.send("assign-task", payload)` the same way as sendChat
  // (A6) — TaskBoard's composer is the only caller.
  sendTask: (payload: SendTaskPayload) => void;
  setStatus: (status: ConnectionStatus) => void;
  upsertAgent: (agent: OfficeAgent) => void;
  removeAgent: (id: string) => void;
  resetAgents: () => void;
  setSelectedAgentId: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setSendChat: (sendChat: (payload: ChatSendPayload) => void) => void;
  setSendTask: (sendTask: (payload: SendTaskPayload) => void) => void;
};

// Empty initial state on purpose — live data only ever lands here from a
// useEffect after connect (client-side), never during SSR/first render.
export const useOfficeStore = create<OfficeStore>((set) => ({
  agents: {},
  status: "connecting",
  selectedAgentId: "alice",
  activeTab: "office",
  sendChat: () => {},
  sendTask: () => {},
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
  setActiveTab: (activeTab) => set({ activeTab }),
  setSendChat: (sendChat) => set({ sendChat }),
  setSendTask: (sendTask) => set({ sendTask }),
}));
