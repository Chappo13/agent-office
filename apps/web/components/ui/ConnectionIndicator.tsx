"use client";

import { useT } from "@/lib/i18n/LanguageProvider";
import type { ConnectionStatus } from "@/lib/stores/officeStore";

const DOT_CLASSES: Record<ConnectionStatus, string> = {
  online: "bg-success",
  offline: "bg-ink-muted",
  connecting: "bg-amber animate-connection-pulse",
};

export function ConnectionIndicator({ status }: { status: ConnectionStatus }) {
  const t = useT();
  const label =
    status === "online"
      ? t.topbar.connOnline
      : status === "offline"
        ? t.topbar.connOffline
        : t.topbar.connConnecting;

  return (
    <span className="flex items-center gap-[6px] rounded-full bg-surface px-[10px] py-1 text-xs font-semibold text-ink-muted">
      <span className={`h-[7px] w-[7px] rounded-full ${DOT_CLASSES[status]}`} />
      {label}
    </span>
  );
}
