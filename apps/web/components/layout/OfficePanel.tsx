"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { LangToggle } from "@/components/ui/LangToggle";

type AgentId = "a" | "b";

export function OfficePanel() {
  const t = useT();
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>("a");

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

          <svg viewBox="0 0 640 420" className="w-[78%]">
            <polygon
              points="320,60 600,220 320,380 40,220"
              fill="#e7ebf3"
              stroke="#d5dae8"
              strokeWidth={1.2}
            />
            <g stroke="#d5dae8" strokeWidth={1} opacity={0.8}>
              <line x1={180} y1={140} x2={460} y2={300} />
              <line x1={250} y1={100} x2={530} y2={260} />
              <line x1={110} y1={180} x2={390} y2={340} />
              <line x1={460} y1={140} x2={180} y2={300} />
              <line x1={390} y1={100} x2={110} y2={260} />
              <line x1={530} y1={180} x2={250} y2={340} />
            </g>
            <polygon
              points="200,150 250,178 210,202 160,174"
              fill="#dfe4f1"
              stroke="#c7cde0"
              strokeWidth={1.4}
            />
            <polygon
              points="440,150 490,178 450,202 400,174"
              fill="#dfe4f1"
              stroke="#c7cde0"
              strokeWidth={1.4}
            />
            <circle
              cx={320}
              cy={220}
              r={34}
              fill="none"
              stroke="#4f5bd5"
              strokeWidth={2}
              strokeDasharray="5 5"
              opacity={0.65}
            />
            <path d="M320 172 l7 10 h-14 z" fill="#4f5bd5" opacity={0.7} />
            <path d="M320 268 l7 -10 h-14 z" fill="#4f5bd5" opacity={0.7} />
            <path d="M258 220 l10 7 v-14 z" fill="#4f5bd5" opacity={0.7} />
            <path d="M382 220 l-10 7 v-14 z" fill="#4f5bd5" opacity={0.7} />

            <OfficeAgent
              id="a"
              x={205}
              y={150}
              fill="#4f5bd5"
              initial={t.brand.mark}
              name={t.office.agentA}
              selected={selectedAgentId === "a"}
              onSelect={() => setSelectedAgentId("a")}
            />
            <OfficeAgent
              id="b"
              x={445}
              y={150}
              fill="#7c3aed"
              initial={t.office.agentB.slice(0, 1)}
              name={t.office.agentB}
              selected={selectedAgentId === "b"}
              onSelect={() => setSelectedAgentId("b")}
            />
          </svg>

          <div className="absolute inset-x-0 bottom-[14px] text-center text-[12.5px] text-ink-muted">
            {t.office.hintPrefix} <b className="text-brand">{t.office.hintStep}</b>.
          </div>
        </div>
      </div>
    </main>
  );
}

type OfficeAgentProps = {
  id: AgentId;
  x: number;
  y: number;
  fill: string;
  initial: string;
  name: string;
  selected: boolean;
  onSelect: () => void;
};

function OfficeAgent({ x, y, fill, initial, name, selected, onSelect }: OfficeAgentProps) {
  const tagWidth = Math.max(44, name.length * 9 + 26);
  return (
    <g className="cursor-pointer" transform={`translate(${x},${y})`} onClick={onSelect}>
      {selected && (
        <circle
          className="animate-selection-spin"
          r={26}
          cx={0}
          cy={-4}
          fill="none"
          stroke="#4f5bd5"
          strokeWidth={2.5}
          strokeDasharray="4 4"
        />
      )}
      <circle r={17} cx={0} cy={-4} fill={fill} stroke="#fff" strokeWidth={3} />
      <text x={0} y={1} textAnchor="middle" fontFamily="'Pixelify Sans', ui-monospace, monospace" fontSize={15} fill="#fff">
        {initial}
      </text>
      <rect
        x={-tagWidth / 2}
        y={18}
        width={tagWidth}
        height={18}
        rx={9}
        fill="#fff"
        stroke="#e4e8f0"
        strokeWidth={1}
      />
      <text x={0} y={31} textAnchor="middle" fontSize={11} fontWeight={600} fill="#1a1f36">
        {name}
      </text>
    </g>
  );
}
