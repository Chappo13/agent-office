"use client";

import { useMemo, useState } from "react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { GRID_SIZE, isoProject, isoZIndex } from "@/lib/iso";

export type OfficeAgentPosition = {
  id: string;
  name: string;
  role?: string;
  gx: number;
  gy: number;
  color: string;
};

type OfficeSceneProps = {
  positions: OfficeAgentPosition[];
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  /** Seam for A7: a generated background replaces the procedural room below. */
  backgroundImageUrl?: string;
};

const VIEW_W = 640;
const VIEW_H = 420;

export function OfficeScene({
  positions,
  selectedAgentId,
  onSelectAgent,
  backgroundImageUrl,
}: OfficeSceneProps) {
  const t = useT();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...positions].sort((a, b) => isoZIndex(a.gx, a.gy) - isoZIndex(b.gx, b.gy)),
    [positions],
  );

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-[86%]" role="img" aria-label={t.office.caption}>
      {backgroundImageUrl ? (
        <image
          href={backgroundImageUrl}
          x={0}
          y={0}
          width={VIEW_W}
          height={VIEW_H}
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <ProceduralRoom />
      )}

      {sorted.map((pos) => (
        <AgentSprite
          key={pos.id}
          pos={pos}
          selected={selectedAgentId === pos.id}
          hovered={activeId === pos.id}
          onSelect={() => onSelectAgent(pos.id)}
          onActivate={() => setActiveId(pos.id)}
          onDeactivate={() => setActiveId((cur) => (cur === pos.id ? null : cur))}
        />
      ))}
    </svg>
  );
}

/* ------------------------------- room ------------------------------- */
/* Original-in-our-palette placeholder room: floor diamond + two back walls
 * + a few desks/plants, all placed via isoProject. Swapped for a generated
 * webp once `backgroundImageUrl` is supplied (A7). */

const WALL_HEIGHT = 132;
const GRID_SEAMS = [10, 20, 30];
const DESKS: Array<{ gx: number; gy: number }> = [
  { gx: 14, gy: 26 },
  { gx: 28, gy: 11 },
  { gx: 24, gy: 32 },
];
const PLANTS: Array<{ gx: number; gy: number }> = [
  { gx: 4, gy: 32 },
  { gx: 34, gy: 4 },
];

function ProceduralRoom() {
  const tv = isoProject(0, 0);
  const lv = isoProject(0, GRID_SIZE);
  const rv = isoProject(GRID_SIZE, 0);
  const bv = isoProject(GRID_SIZE, GRID_SIZE);
  const center = isoProject(GRID_SIZE / 2, GRID_SIZE / 2);

  const floor = `${tv.x},${tv.y} ${rv.x},${rv.y} ${bv.x},${bv.y} ${lv.x},${lv.y}`;
  const westWall = `${tv.x},${tv.y} ${lv.x},${lv.y} ${lv.x},${lv.y - WALL_HEIGHT} ${tv.x},${tv.y - WALL_HEIGHT}`;
  const northWall = `${tv.x},${tv.y} ${rv.x},${rv.y} ${rv.x},${rv.y - WALL_HEIGHT} ${tv.x},${tv.y - WALL_HEIGHT}`;

  return (
    <g>
      <polygon points={westWall} fill="#e3e7f1" stroke="#cfd5e6" strokeWidth={1.2} />
      <polygon points={northWall} fill="#f2f4fa" stroke="#dde2ee" strokeWidth={1.2} />

      <polygon points={floor} fill="#e7ebf3" stroke="#d5dae8" strokeWidth={1.2} />
      <g stroke="#d5dae8" strokeWidth={1} opacity={0.6}>
        {GRID_SEAMS.map((g) => {
          const from = isoProject(g, 0);
          const to = isoProject(g, GRID_SIZE);
          return <line key={`gx-${g}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
        })}
        {GRID_SEAMS.map((g) => {
          const from = isoProject(0, g);
          const to = isoProject(GRID_SIZE, g);
          return <line key={`gy-${g}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
        })}
      </g>

      {PLANTS.map((p, i) => (
        <PlantProp key={i} gx={p.gx} gy={p.gy} />
      ))}
      {DESKS.map((d, i) => (
        <DeskProp key={i} gx={d.gx} gy={d.gy} />
      ))}

      <FocusRing cx={center.x} cy={center.y} />
    </g>
  );
}

function DeskProp({ gx, gy }: { gx: number; gy: number }) {
  const { x, y } = isoProject(gx, gy);
  const hw = 12;
  const hh = 7;
  const h = 16;
  const top = `${x},${y - hh} ${x + hw},${y} ${x},${y + hh} ${x - hw},${y}`;
  const left = `${x - hw},${y} ${x},${y + hh} ${x},${y + hh + h} ${x - hw},${y + h}`;
  const right = `${x},${y + hh} ${x + hw},${y} ${x + hw},${y + h} ${x},${y + hh + h}`;
  return (
    <g>
      <polygon points={left} fill="#c7cde0" stroke="#b7bfd8" strokeWidth={1} />
      <polygon points={right} fill="#d5dae8" stroke="#b7bfd8" strokeWidth={1} />
      <polygon points={top} fill="#eef1f6" stroke="#c7cde0" strokeWidth={1} />
    </g>
  );
}

function PlantProp({ gx, gy }: { gx: number; gy: number }) {
  const { x, y } = isoProject(gx, gy);
  return (
    <g>
      <ellipse cx={x} cy={y + 6} rx={9} ry={4.5} fill="#d8bfa0" stroke="#c3a684" strokeWidth={1} />
      <circle cx={x} cy={y - 9} r={10} fill="#bcd9c4" stroke="#9fc4a9" strokeWidth={1} />
      <circle cx={x - 7} cy={y - 3} r={6.5} fill="#bcd9c4" stroke="#9fc4a9" strokeWidth={1} />
      <circle cx={x + 7} cy={y - 3} r={6.5} fill="#bcd9c4" stroke="#9fc4a9" strokeWidth={1} />
    </g>
  );
}

function FocusRing({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={34}
        fill="none"
        stroke="#4f5bd5"
        strokeWidth={2}
        strokeDasharray="5 5"
        opacity={0.65}
      />
      <path d={`M${cx} ${cy - 48} l7 10 h-14 z`} fill="#4f5bd5" opacity={0.7} />
      <path d={`M${cx} ${cy + 48} l7 -10 h-14 z`} fill="#4f5bd5" opacity={0.7} />
      <path d={`M${cx - 62} ${cy} l10 7 v-14 z`} fill="#4f5bd5" opacity={0.7} />
      <path d={`M${cx + 62} ${cy} l-10 7 v-14 z`} fill="#4f5bd5" opacity={0.7} />
    </g>
  );
}

/* ------------------------------ sprite ------------------------------- */

type AgentSpriteProps = {
  pos: OfficeAgentPosition;
  selected: boolean;
  hovered: boolean;
  onSelect: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
};

function AgentSprite({ pos, selected, hovered, onSelect, onActivate, onDeactivate }: AgentSpriteProps) {
  const t = useT();
  const { x, y } = isoProject(pos.gx, pos.gy);
  const initial = pos.name.slice(0, 1).toUpperCase();
  const tagWidth = Math.max(44, pos.name.length * 9 + 26);

  const tooltipLines = [pos.name, pos.role, `${t.office.tooltipOpenChat} →`].filter(
    (l): l is string => Boolean(l),
  );
  const tooltipWidth = Math.max(100, ...tooltipLines.map((l) => l.length * 6 + 24));
  const tooltipHeight = tooltipLines.length * 15 + 10;
  const tooltipBottom = -30;
  const tooltipTop = tooltipBottom - tooltipHeight;

  return (
    <g
      transform={`translate(${x},${y})`}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={pos.role ? `${pos.name} · ${pos.role}` : pos.name}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
    >
      <g className="origin-center animate-agent-bob" style={{ animationDelay: `${isoZIndex(pos.gx, pos.gy) * 0.05}s` }}>
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
        <circle
          r={hovered ? 18.5 : 17}
          cx={0}
          cy={-4}
          fill={pos.color}
          stroke="#fff"
          strokeWidth={3}
          style={{ transition: "r 120ms ease-out" }}
        />
        <text
          x={0}
          y={1}
          textAnchor="middle"
          fontFamily="'Pixelify Sans', ui-monospace, monospace"
          fontSize={15}
          fill="#fff"
        >
          {initial}
        </text>
        <rect
          x={-tagWidth / 2}
          y={18}
          width={tagWidth}
          height={18}
          rx={9}
          fill="#fff"
          stroke={hovered ? "#4f5bd5" : "#e4e8f0"}
          strokeWidth={hovered ? 1.4 : 1}
        />
        <text x={0} y={31} textAnchor="middle" fontSize={11} fontWeight={600} fill="#1a1f36">
          {pos.name}
        </text>

        {hovered && (
          <g pointerEvents="none">
            <rect
              x={-tooltipWidth / 2}
              y={tooltipTop}
              width={tooltipWidth}
              height={tooltipHeight}
              rx={8}
              fill="#ffffff"
              stroke="#e4e8f0"
              strokeWidth={1}
            />
            <polygon
              points={`${-5},${tooltipBottom} 5,${tooltipBottom} 0,${tooltipBottom + 6}`}
              fill="#ffffff"
              stroke="#e4e8f0"
              strokeWidth={1}
            />
            {tooltipLines.map((line, i) => (
              <text
                key={i}
                x={0}
                y={tooltipTop + 15 + i * 15}
                textAnchor="middle"
                fontSize={10.5}
                fontWeight={i === 0 ? 700 : 500}
                fill={i === 0 ? "#1a1f36" : i === tooltipLines.length - 1 ? "#4f5bd5" : "#6b7291"}
              >
                {line}
              </text>
            ))}
          </g>
        )}
      </g>
    </g>
  );
}
