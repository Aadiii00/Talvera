import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineStep {
  label: string;
  done: boolean;
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function Timeline({ steps, className }: TimelineProps) {
  return (
    <ol className={cn("flex flex-wrap items-center gap-x-1 gap-y-3", className)}>
      {steps.map((step, index) => (
        <li key={step.label} className="flex items-center gap-1">
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                step.done ? "bg-status-teal text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {step.done ? <Check className="h-3 w-3" /> : index + 1}
            </span>
            <span className={cn("text-xs", step.done ? "font-medium text-foreground" : "text-muted-foreground")}>
              {step.label}
            </span>
          </span>
          {index < steps.length - 1 && <span className="mx-2 h-px w-4 bg-border" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}
