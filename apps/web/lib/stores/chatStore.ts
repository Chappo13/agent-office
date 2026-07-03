import { create } from "zustand";

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
  append: (message) => set((state) => ({ messages: [...state.messages, message] })),
  resetMessages: () => set({ messages: [] }),
}));
