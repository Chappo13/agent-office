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

type OfficeStore = {
  agents: Record<string, OfficeAgent>;
  status: ConnectionStatus;
  setStatus: (status: ConnectionStatus) => void;
  upsertAgent: (agent: OfficeAgent) => void;
  removeAgent: (id: string) => void;
  resetAgents: () => void;
};

// Empty initial state on purpose — live data only ever lands here from a
// useEffect after connect (client-side), never during SSR/first render.
export const useOfficeStore = create<OfficeStore>((set) => ({
  agents: {},
  status: "connecting",
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
}));
