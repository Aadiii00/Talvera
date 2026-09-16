import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toneClasses, type StatusTone } from "@/talvera/lib/status";

interface TrendBadgeProps {
  value: number; // signed or unsigned percentage; sign controls arrow direction unless `direction` is set
  tone?: StatusTone;
  direction?: "up" | "down";
  className?: string;
}

export function TrendBadge({ value, tone = "pink", direction, className }: TrendBadgeProps) {
  const resolvedDirection = direction ?? (value >= 0 ? "up" : "down");
  const Icon = resolvedDirection === "up" ? ArrowUp : ArrowDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        toneClasses[tone],
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(value)}%
    </span>
  );
}
