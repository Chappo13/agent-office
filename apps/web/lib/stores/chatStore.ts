import { create } from "zustand";

// Cap the live message log so a long-running simulation doesn't grow the
// array (and ChatPanel's re-render) without bound.
const MAX_MESSAGES = 200;

export type ChatMessage = {
  id: string;
  from: string;
  text: string;
  ts: number;
};

type ChatStore = {
  messages: ChatMessage[];
  append: (message: ChatMessage) => void;
  resetMessages: () => void;
};

// Empty initial state — populated only from the live `chat` broadcast
// handler (useOfficeConnection), never during SSR.
export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  append: (message) =>
    set((state) => ({ messages: [...state.messages, message].slice(-MAX_MESSAGES) })),
  resetMessages: () => set({ messages: [] }),
}));
