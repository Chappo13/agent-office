"use client";

import { useT } from "@/lib/i18n/LanguageProvider";
import { useActivityStore, type OfficeActivityEvent } from "@/lib/stores/activityStore";
import type { Dictionary } from "@/lib/i18n/dictionaries";

// Server highlight types observed in OfficeRoom.ts (conversation/task/hiring/
// tool/scenario/character_arc/chaos/high_risk/audience_vote) — mapped to a
// dot color; anything unmapped (future types) falls back to ink-muted so the
// feed never breaks on an unknown `type`.
const TYPE_DOT_CLASSES: Record<string, string> = {
  conversation: "bg-brand",
  task: "bg-amber",
  hiring: "bg-success",
  tool: "bg-[#7c3aed]",
  scenario: "bg-brand-dark",
  character_arc: "bg-success",
  chaos: "bg-[#e2574c]",
  high_risk: "bg-[#e2574c]",
  audience_vote: "bg-amber",
};

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function formatRelativeTime(iso: string, t: Dictionary["activity"]): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < MINUTE_MS) return t.timeJustNow;
  if (diff < HOUR_MS) return `${Math.floor(diff / MINUTE_MS)} ${t.timeMinutesSuffix}`;
  if (diff < DAY_MS) return `${Math.floor(diff / HOUR_MS)} ${t.timeHoursSuffix}`;
  return `${Math.floor(diff / DAY_MS)} ${t.timeDaysSuffix}`;
}

export function ActivityFeed() {
  const t = useT();
  const events = useActivityStore((s) => s.events);

  return (
    <main className="scroll-thin flex min-w-0 flex-1 flex-col overflow-x-auto bg-canvas">
      <div className="flex items-center gap-[14px] border-b border-line bg-canvas/80 px-[22px] py-4 backdrop-blur-sm">
        <div className="font-display text-base tracking-wide">{t.activity.title}</div>
      </div>

      <div className="scroll-thin flex flex-1 flex-col gap-[10px] overflow-y-auto p-[22px]">
        {events.length === 0 ? (
          <div className="grid flex-1 place-items-center text-sm text-ink-muted">
            {t.activity.empty}
          </div>
        ) : (
          events.map((event: OfficeActivityEvent) => {
            // Display name is language-dependent — resolved here by id (same
            // pattern as OfficePanel/TaskBoard), omitted entirely when the
            // event has no agentId (e.g. scenario/chaos events).
            const agentMeta = event.agentId
              ? (t.agents as Record<string, { name: string; role: string }>)[event.agentId]
              : undefined;
            const dotClass = TYPE_DOT_CLASSES[event.type] ?? "bg-ink-muted";
            return (
              <div
                key={event.id}
                className="flex gap-[12px] rounded-xl border border-line bg-panel px-[14px] py-[12px] shadow-panel"
              >
                <span className={`mt-[6px] h-[8px] w-[8px] flex-none rounded-full ${dotClass}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-[8px]">
                    <span className="truncate text-[13.5px] font-semibold">{event.title}</span>
                    {agentMeta && (
                      <span className="flex-none text-xs text-ink-muted">{agentMeta.name}</span>
                    )}
                  </div>
                  {event.body && (
                    <div className="mt-[2px] text-[13px] text-ink-muted">{event.body}</div>
                  )}
                </div>
                <span className="flex-none whitespace-nowrap text-[11px] text-ink-muted">
                  {formatRelativeTime(event.time, t.activity)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
