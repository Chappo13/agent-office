"use client";

import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { LangToggle } from "@/components/ui/LangToggle";
import { ConnectionIndicator } from "@/components/ui/ConnectionIndicator";
import { OfficeScene, type OfficeAgentPosition } from "@/components/office/OfficeScene";
import { useOfficeStore } from "@/lib/stores/officeStore";

export function OfficePanel() {
  const t = useT();
  // Shared with ChatPanel (A5) — was local useState, now lives in the store
  // so ChatPanel can read it as the send target.
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const setSelectedAgentId = useOfficeStore((s) => s.setSelectedAgentId);
  const agents = useOfficeStore((s) => s.agents);
  const status = useOfficeStore((s) => s.status);

  // Live Colyseus agents (A3) — positions flow only through isoProject
  // (OfficeScene/iso.ts untouched), so this is a straight id→position map.
  const positions: OfficeAgentPosition[] = useMemo(
    () =>
      Object.values(agents).map((a) => {
        // Display name/role are language-dependent → resolved here (reactive
        // to `t`), not baked into the store at connect time.
        const meta = (t.agents as Record<string, { name: string; role: string }>)[a.id];
        return {
          id: a.id,
          gx: a.gx,
          gy: a.gy,
          name: meta?.name ?? a.id,
          role: meta?.role ?? "",
          color: a.color,
        };
      }),
    [agents, t],
  );
  const isEmpty = positions.length === 0;

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
        <ConnectionIndicator status={status} />
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

          {isEmpty ? (
            <div className="text-sm text-ink-muted">
              {status === "offline" ? t.office.offline : t.office.connecting}
            </div>
          ) : (
            <OfficeScene
              positions={positions}
              selectedAgentId={selectedAgentId}
              onSelectAgent={setSelectedAgentId}
            />
          )}

          <div className="absolute inset-x-0 bottom-[14px] text-center text-[12.5px] text-ink-muted">
            {t.office.hintPrefix} <b className="text-brand">{t.office.hintStep}</b>.
          </div>
        </div>
      </div>
    </main>
  );
}
