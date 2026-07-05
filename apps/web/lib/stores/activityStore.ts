import { create } from "zustand";

// Cap the live feed so a long-running simulation doesn't grow the array
// (and ActivityFeed's re-render) without bound (mirrors chatStore).
const MAX_EVENTS = 50;

export type OfficeActivityEvent = {
  id: string;
  type: string;
  title: string;
  body: string;
  agentId?: string;
  time: string;
};

type ActivityStore = {
  // Newest first — matches the feed's chronological (most-recent-on-top)
  // reading order, unlike chatStore's newest-last transcript.
  events: OfficeActivityEvent[];
  pushEvent: (event: OfficeActivityEvent) => void;
  resetEvents: () => void;
};

// Empty initial state — populated only from the live `highlight-event`
// broadcast handler (useOfficeConnection), never during SSR.
export const useActivityStore = create<ActivityStore>((set) => ({
  events: [],
  pushEvent: (event) =>
    set((state) => ({ events: [event, ...state.events].slice(0, MAX_EVENTS) })),
  resetEvents: () => set({ events: [] }),
}));
