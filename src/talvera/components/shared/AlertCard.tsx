import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toneColor, type StatusTone } from "@/talvera/lib/status";

interface AlertCardProps {
  title: string;
  description: string;
  tone?: StatusTone;
  icon?: React.ReactNode;
  className?: string;
}

export function AlertCard({ title, description, tone = "pink", icon, className }: AlertCardProps) {
  return (
    <div
      className={cn("flex items-start gap-3 rounded-xl border border-border/70 bg-background/60 p-4", className)}
      style={{ borderLeftColor: toneColor[tone], borderLeftWidth: 3 }}
    >
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `hsl(var(--status-${tone}-soft))`, color: toneColor[tone] }}
      >
        {icon ?? <AlertTriangle className="h-3.5 w-3.5" />}
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
