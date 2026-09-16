import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusPill } from "./StatusPill";
import type { StatusTone } from "@/talvera/lib/status";

export interface FlowChainItem {
  id: string;
  label: string;
  sublabel?: string;
  tone?: StatusTone;
  statusLabel?: string;
}

interface FlowChainProps {
  items: FlowChainItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function FlowChain({ items, selectedId, onSelect, orientation = "horizontal", className }: FlowChainProps) {
  const isVertical = orientation === "vertical";
  return (
    <div className={cn("flex", isVertical ? "flex-col items-start gap-2" : "flex-wrap items-center gap-2", className)}>
      {items.map((item, index) => (
        <div key={item.id} className={cn("flex items-center", isVertical && "flex-col items-start")}>
          <button
            type="button"
            onClick={() => onSelect?.(item.id)}
            className={cn(
              "flex min-w-[140px] flex-col gap-1 rounded-xl border px-3.5 py-2.5 text-left transition-colors",
              selectedId === item.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/40 hover:bg-accent"
            )}
          >
            <span className="text-xs font-semibold">{item.label}</span>
            {item.sublabel && (
              <span className={cn("text-[11px]", selectedId === item.id ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {item.sublabel}
              </span>
            )}
            {item.statusLabel && item.tone && (
              <StatusPill tone={item.tone} className="mt-1 w-fit">
                {item.statusLabel}
              </StatusPill>
            )}
          </button>
          {index < items.length - 1 && (
            <ArrowRight
              className={cn(
                "shrink-0 text-muted-foreground/60",
                isVertical ? "my-1.5 h-4 w-4 rotate-90" : "mx-1.5 h-4 w-4"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
