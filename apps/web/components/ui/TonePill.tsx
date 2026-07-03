type TonePillProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export function TonePill({ label, active, onClick }: TonePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-[11px] py-[5px] text-xs transition-colors ${
        active
          ? "border-[#dfe3fb] bg-brand-tint font-semibold text-brand-dark"
          : "border-line bg-panel text-ink-muted hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
