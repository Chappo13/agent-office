import { Plus } from "lucide-react";
import { StatusDot } from "./StatusDot";

type AvatarVariant = "a" | "b" | "ghost" | "user";
type AvatarSize = "sm" | "md" | "lg";

type AvatarProps = {
  variant: AvatarVariant;
  size?: AvatarSize;
  initial?: string;
  status?: "on" | "idle";
};

const VARIANT_BG: Record<AvatarVariant, string> = {
  a: "bg-brand",
  b: "bg-[#7c3aed]",
  ghost: "bg-[#c9cede]",
  user: "bg-[#c9cede]",
};

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "h-8 w-8 rounded-[9px] text-[13px]",
  md: "h-9 w-9 rounded-[10px] text-[15px]",
  lg: "h-[38px] w-[38px] rounded-[10px] text-[15px]",
};

export function Avatar({ variant, size = "md", initial, status }: AvatarProps) {
  return (
    <div
      className={`relative grid flex-none place-items-center font-display leading-none text-white ${VARIANT_BG[variant]} ${SIZE_CLASSES[size]}`}
    >
      {variant === "ghost" ? <Plus size={16} strokeWidth={2.5} /> : initial}
      {status && <StatusDot status={status} />}
    </div>
  );
}
