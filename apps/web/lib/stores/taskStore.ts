import { create } from "zustand";

// Cap the board so a long-running simulation doesn't grow this without
// bound (mirrors chatStore's MAX_MESSAGES / activityStore's MAX_EVENTS).
const MAX_TASKS = 50;

export type OfficeTask = {
  id: string;
  title: string;
  agentId: string;
  agentName: string;
  status: string;
};

type TaskStore = {
  // Keyed by title (the server's `task-update` broadcast carries no task id,
  // just the title) — re-broadcasts of the same task update in place instead
  // of duplicating. Insertion-order of string keys is preserved by JS, so the
  // oldest entry is always `Object.keys(tasks)[0]` for the cap eviction below.
  tasks: Record<string, OfficeTask>;
  upsertTask: (task: OfficeTask) => void;
  resetTasks: () => void;
};

// Empty initial state — populated only from the live `task-update` broadcast
// handler (useOfficeConnection), never during SSR.
export const useTaskStore = create<TaskStore>((set) => ({
  tasks: {},
  upsertTask: (task) =>
    set((state) => {
      const next = { ...state.tasks, [task.id]: task };
      const keys = Object.keys(next);
      if (keys.length > MAX_TASKS) delete next[keys[0]];
      return { tasks: next };
    }),
  resetTasks: () => set({ tasks: {} }),
}));
