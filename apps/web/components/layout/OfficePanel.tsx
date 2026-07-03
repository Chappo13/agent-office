"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { LangToggle } from "@/components/ui/LangToggle";
import { OfficeScene, type OfficeAgentPosition } from "@/components/office/OfficeScene";

// MOCK positions (Step 0 verified spawns: alice(10,10), bob(20,15) on the
// 40×40 grid). A3 replaces this array with live Colyseus state — OfficeScene
// only ever consumes grid coords through isoProject, so nothing downstream
// changes.
const MOCK_AGENTS: Array<{ id: string; gx: number; gy: number; color: string }> = [
  { id: "alice", gx: 10, gy: 10, color: "#4f5bd5" },
  { id: "bob", gx: 20, gy: 15, color: "#7c3aed" },
];

export function OfficePanel() {
  const t = useT();
  const [selectedAgentId, setSelectedAgentId] = useState<string>("alice");

  const positions: OfficeAgentPosition[] = useMemo(
    () =>
      MOCK_AGENTS.map((a) => ({
        ...a,
        name: a.id === "alice" ? t.office.agentA : t.office.agentB,
        role: a.id === "alice" ? t.sidebar.coordinatorRole : t.sidebar.bobRole,
      })),
    [t],
  );

  return (
    <main
      className="scroll-thin flex min-w-0 flex-1 flex-col overflow-x-auto"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, #e7ebf3 1px, transparent 0)",
        backgroundSize: "22px 22px",
        backgroundColor: "#fafbfc",
      }}
    >
      <div className="flex items-center gap-[14px] border-b border-line bg-canvas/80 px-[22px] py-4 backdrop-blur-sm">
        <div className="flex cursor-pointer items-center gap-[9px] font-display text-base tracking-wide">
          {t.topbar.teamSwitch}
          <ChevronDown size={16} className="text-ink-muted" />
        </div>
        <span className="rounded-full bg-surface px-[10px] py-1 text-xs font-semibold text-ink-muted">
          {t.topbar.onlinePill}
        </span>
        <div className="ml-auto flex items-center gap-[14px]">
          <div className="cursor-pointer rounded-full border border-[#f5e0b0] bg-[#fff7e8] px-3 py-[5px] text-xs font-semibold text-[#a9730a]">
            {t.topbar.tier}
          </div>
          <LangToggle />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div
          className="relative grid place-items-center overflow-hidden rounded-[18px] border border-line bg-gradient-to-b from-white to-[#f4f6fb] shadow-[0_20px_50px_-30px_rgba(26,31,54,0.5),inset_0_1px_0_#fff]"
          style={{ width: "min(760px, 92%)", aspectRatio: "16 / 11" }}
        >
          <div className="absolute left-4 top-[14px] font-display text-xs uppercase tracking-wide text-ink-muted">
            {t.office.caption}
          </div>

          <OfficeScene
            positions={positions}
            selectedAgentId={selectedAgentId}
            onSelectAgent={setSelectedAgentId}
          />

          <div className="absolute inset-x-0 bottom-[14px] text-center text-[12.5px] text-ink-muted">
            {t.office.hintPrefix} <b className="text-brand">{t.office.hintStep}</b>.
          </div>
        </div>
      </div>
    </main>
  );
}
