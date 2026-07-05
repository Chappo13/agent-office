"use client";

import { Activity, Folder, LifeBuoy, ListChecks, Settings, LayoutGrid } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { Avatar } from "@/components/ui/Avatar";
import { NavItem } from "@/components/ui/NavItem";
import { useOfficeStore, type ActiveTab } from "@/lib/stores/officeStore";

export function LeftSidebar() {
  const t = useT();
  // A6: nav highlight + main-area switch both read this — was local
  // `useState` lifted into page.tsx before A6, now lives in officeStore so
  // MainArea can react to it too.
  const activeTab = useOfficeStore((s) => s.activeTab);
  const setActiveTab = useOfficeStore((s) => s.setActiveTab);

  const navItems: { key: ActiveTab; icon: typeof LayoutGrid; label: string; badge?: string }[] = [
    { key: "office", icon: LayoutGrid, label: t.nav.office },
    { key: "tasks", icon: ListChecks, label: t.nav.tasks, badge: t.nav.tasksBadge },
    { key: "activity", icon: Activity, label: t.nav.activity },
    { key: "artifacts", icon: Folder, label: t.nav.artifacts },
  ];

  return (
    <aside className="flex w-64 flex-none flex-col gap-[18px] border-r border-line bg-sidebar px-[14px] py-[18px]">
      <div className="flex items-center gap-[10px] px-[6px] py-0.5">
        <div className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[9px] bg-brand shadow-[0_2px_0_#3f4bc5]">
          <span className="font-display text-xl leading-none text-white">{t.brand.mark}</span>
        </div>
        <div className="font-display text-[21px] tracking-wide">
          {t.brand.prefix} <span className="text-brand">{t.brand.name}</span>
        </div>
      </div>

      <nav className="flex flex-col gap-[3px]">
        {navItems.map((item) => (
          <NavItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            active={activeTab === item.key}
            onClick={() => setActiveTab(item.key)}
          />
        ))}
      </nav>

      <div className="h-px bg-line" />

      <div>
        <div className="px-2 pb-[6px] font-display text-xs uppercase tracking-wide text-ink-muted">
          {t.sidebar.coordinatorLabel}
        </div>
        <div className="flex items-center gap-[11px] rounded-xl border border-line bg-panel p-[11px] shadow-panel">
          <Avatar variant="a" initial={t.brand.mark} status="on" />
          <div className="min-w-0">
            <div className="font-display text-sm tracking-wide">{t.sidebar.coordinatorName}</div>
            <div className="text-xs text-ink-muted">{t.sidebar.coordinatorRole}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[7px]">
        <div className="px-2 pb-[6px] font-display text-xs uppercase tracking-wide text-ink-muted">
          {t.sidebar.teamLabel}
        </div>
        <div className="flex items-center gap-[11px] rounded-lg px-2 py-[7px] hover:bg-surface">
          <Avatar variant="b" size="sm" initial={t.sidebar.bobName.slice(0, 1)} status="idle" />
          <div className="min-w-0">
            <div className="font-display text-sm tracking-wide">{t.sidebar.bobName}</div>
            <div className="text-xs text-ink-muted">{t.sidebar.bobRole}</div>
          </div>
        </div>
        <div className="group flex cursor-pointer items-center gap-[11px] rounded-lg border border-dashed border-line px-2 py-[7px] text-ink-muted hover:border-brand hover:text-brand">
          <Avatar variant="ghost" size="sm" />
          <div className="min-w-0">
            <div className="font-display text-sm tracking-wide">{t.sidebar.hireName}</div>
            <div className="text-xs text-ink-muted group-hover:text-brand">{t.sidebar.hireRole}</div>
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <div className="h-px bg-line" />
        <div className="flex flex-col gap-0.5">
          <div className="flex cursor-pointer items-center gap-[9px] rounded-lg px-[10px] py-[7px] font-display text-xs uppercase tracking-wide text-ink-muted hover:bg-surface hover:text-ink">
            <Settings size={15} strokeWidth={2} />
            {t.sidebar.settings}
          </div>
          <div className="flex cursor-pointer items-center gap-[9px] rounded-lg px-[10px] py-[7px] font-display text-xs uppercase tracking-wide text-ink-muted hover:bg-surface hover:text-ink">
            <LifeBuoy size={15} strokeWidth={2} />
            {t.sidebar.support}
          </div>
        </div>
        <div className="flex items-center gap-[10px] p-[6px]">
          <Avatar variant="user" size="sm" initial={t.sidebar.userName.slice(0, 1)} />
          <div className="min-w-0">
            <div className="font-display text-sm tracking-wide">{t.sidebar.userName}</div>
            <div className="text-xs text-ink-muted">{t.sidebar.userRole}</div>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-line bg-panel px-3 py-[10px]">
          <span className="text-xs text-ink-muted">{t.sidebar.creditsLabel}</span>
          <span className="text-sm font-bold tabular-nums">
            <b className="text-brand">{t.sidebar.creditsValue}</b>
          </span>
        </div>
      </div>
    </aside>
  );
}
