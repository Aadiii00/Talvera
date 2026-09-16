import { cn } from "@/lib/utils";
import { toneClasses, toneColor, type StatusTone } from "@/talvera/lib/status";

interface StatusPillProps {
  tone: StatusTone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function StatusPill({ tone, children, className, dot }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold",
        toneClasses[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: toneColor[tone] }} />}
      {children}
    </span>
  );
}
