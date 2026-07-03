type StatusDotProps = {
  status: "on" | "idle";
};

const STATUS_CLASSES: Record<StatusDotProps["status"], string> = {
  on: "bg-success",
  idle: "bg-amber",
};

export function StatusDot({ status }: StatusDotProps) {
  return (
    <span
      className={`absolute -bottom-0.5 -right-0.5 h-[11px] w-[11px] rounded-full border-2 border-panel ${STATUS_CLASSES[status]}`}
    />
  );
}
