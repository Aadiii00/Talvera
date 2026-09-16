import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  sublabel?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}

export function MetricCard({ label, value, sublabel, trailing, className }: MetricCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="flex h-full flex-col justify-between gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
          {trailing}
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {sublabel && <div className="mt-1 text-xs text-muted-foreground">{sublabel}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
