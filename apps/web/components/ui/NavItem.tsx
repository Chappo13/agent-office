import type { LucideIcon } from "lucide-react";

type NavItemProps = {
  icon: LucideIcon;
  label: string;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
};

export function NavItem({ icon: Icon, label, badge, active, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-[11px] rounded-lg border px-[11px] py-[9px] font-display text-[13px] uppercase tracking-wide transition-colors ${
        active
          ? "border-[#dfe3fb] bg-brand-tint font-semibold text-brand-dark"
          : "border-transparent text-ink-muted hover:bg-surface hover:text-ink"
      }`}
    >
      <Icon size={18} className="flex-none" strokeWidth={2} />
      <span>{label}</span>
      {badge && (
        <span
          className={`ml-auto rounded-full px-[7px] py-px text-[11px] tabular-nums ${
            active ? "bg-white text-brand-dark" : "bg-line text-ink-muted"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
