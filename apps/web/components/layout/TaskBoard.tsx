"use client";

import { useState, type KeyboardEvent } from "react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useTaskStore, type OfficeTask } from "@/lib/stores/taskStore";
import { useOfficeStore } from "@/lib/stores/officeStore";

const STATUS_DOT_CLASSES: Record<string, string> = {
  in_progress: "bg-amber",
  todo: "bg-ink-muted",
  done: "bg-success",
  blocked: "bg-[#e2574c]",
};

export function TaskBoard() {
  const t = useT();
  const [draft, setDraft] = useState("");
  const tasks = useTaskStore((s) => s.tasks);
  const sendTask = useOfficeStore((s) => s.sendTask);
  const status = useOfficeStore((s) => s.status);
  const online = status === "online";

  // Object key insertion order is oldest-first (taskStore); reversed here so
  // the most recently touched task reads at the top, same "recent on top"
  // convention as ActivityFeed.
  const taskList: OfficeTask[] = Object.values(tasks).reverse();

  function handleCreate() {
    const title = draft.trim();
    if (!title || !online) return;
    // Only calls sendTask — the server persists + broadcasts task-update
    // (and a chat line), which useOfficeConnection's listener already routes
    // into taskStore. Appending here too would race/duplicate that.
    sendTask({ title });
    setDraft("");
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCreate();
    }
  }

  return (
    <main className="scroll-thin flex min-w-0 flex-1 flex-col overflow-x-auto bg-canvas">
      <div className="flex items-center gap-[14px] border-b border-line bg-canvas/80 px-[22px] py-4 backdrop-blur-sm">
        <div className="font-display text-base tracking-wide">{t.tasks.title}</div>
      </div>

      <div className="flex gap-[10px] border-b border-line bg-panel/60 px-[22px] py-[14px]">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleComposerKeyDown}
          placeholder={t.tasks.composerPlaceholder}
          aria-label={t.tasks.composerPlaceholder}
          className="min-w-0 flex-1 rounded-xl border border-line bg-panel px-3 py-[9px] text-[13.5px] text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={!online}
          aria-disabled={!online}
          className={`flex-none rounded-[10px] bg-brand px-[16px] py-[9px] font-display text-xs uppercase tracking-wide text-white shadow-[0_2px_0_#3f4bc5] hover:bg-brand-dark ${
            online ? "" : "cursor-not-allowed opacity-50 hover:bg-brand"
          }`}
        >
          {t.tasks.create}
        </button>
      </div>

      <div className="scroll-thin flex flex-1 flex-col gap-[10px] overflow-y-auto p-[22px]">
        {taskList.length === 0 ? (
          <div className="grid flex-1 place-items-center text-sm text-ink-muted">{t.tasks.empty}</div>
        ) : (
          taskList.map((task) => {
            // Display name is language-dependent, resolved here by id (same
            // pattern as OfficePanel) — falls back to the server's raw
            // English `agentName` for ids not in the i18n roster (e.g. a
            // future hire), then to the id itself.
            const agentMeta = (t.agents as Record<string, { name: string; role: string }>)[
              task.agentId
            ];
            const agentLabel = agentMeta?.name ?? task.agentName ?? task.agentId ?? t.tasks.unassigned;
            const statusLabel =
              (t.tasks.status as Record<string, string>)[task.status] ?? task.status;
            const dotClass = STATUS_DOT_CLASSES[task.status] ?? "bg-ink-muted";
            return (
              <div
                key={task.id}
                className="flex items-center gap-[12px] rounded-xl border border-line bg-panel px-[14px] py-[12px] shadow-panel"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px]">{task.title}</div>
                  <div className="text-xs text-ink-muted">{agentLabel}</div>
                </div>
                <span className="flex flex-none items-center gap-[6px] rounded-full bg-surface px-[10px] py-1 text-xs font-semibold text-ink-muted">
                  <span className={`h-[7px] w-[7px] rounded-full ${dotClass}`} />
                  {statusLabel}
                </span>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
