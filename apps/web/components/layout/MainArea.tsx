"use client";

import { Folder } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useOfficeStore } from "@/lib/stores/officeStore";
import { OfficePanel } from "@/components/layout/OfficePanel";
import { TaskBoard } from "@/components/layout/TaskBoard";
import { ActivityFeed } from "@/components/layout/ActivityFeed";

/**
 * A6: center-column router. LeftSidebar's nav clicks set `activeTab` in
 * officeStore; this is the only place that reads it to decide what renders
 * there. The right ChatPanel is a sibling in page.tsx and stays mounted
 * regardless of this switch.
 */
export function MainArea() {
  const activeTab = useOfficeStore((s) => s.activeTab);

  if (activeTab === "tasks") return <TaskBoard />;
  if (activeTab === "activity") return <ActivityFeed />;
  if (activeTab === "artifacts") return <ArtifactsPlaceholder />;
  return <OfficePanel />;
}

function ArtifactsPlaceholder() {
  const t = useT();
  return (
    <main className="scroll-thin flex min-w-0 flex-1 flex-col items-center justify-center gap-3 overflow-x-auto bg-canvas px-6 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-[14px] border border-line bg-panel shadow-panel">
        <Folder size={20} className="text-ink-muted" strokeWidth={2} />
      </div>
      <div className="font-display text-lg tracking-wide">{t.artifacts.comingSoonTitle}</div>
      <div className="max-w-[320px] text-sm text-ink-muted">{t.artifacts.comingSoonBody}</div>
    </main>
  );
}
