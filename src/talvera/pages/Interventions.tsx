import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { interventions } from "@/talvera/data/interventions";

export default function Interventions() {
  const [selected, setSelected] = useState<string[]>(["Training & Upskilling", "Workload Reduction"]);
  const [budget, setBudget] = useState(500);
  const [trainingCapacity, setTrainingCapacity] = useState(60);
  const [hiringAvailability, setHiringAvailability] = useState(30);
  const [salaryConstraint, setSalaryConstraint] = useState(40);

  const toggle = (name: string) =>
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  const chosen = interventions.filter((item) => selected.includes(item.name));
  const totals = chosen.reduce(
    (acc, item) => ({
      cost: acc.cost + item.cost,
      riskReduction: acc.riskReduction + item.riskReduction,
      affected: acc.affected + item.affectedEmployees,
      skillImpact: Math.max(acc.skillImpact, item.skillImpact),
    }),
    { cost: 0, riskReduction: 0, affected: 0, skillImpact: 0 }
  );
  const roi = totals.cost > 0 ? (totals.riskReduction * 4200) / totals.cost : 0;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Intervention Studio" subtitle="Build and compare workforce interventions before committing budget." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {interventions.map((item) => (
          <button key={item.name} onClick={() => toggle(item.name)} className="text-left">
            <Card
              className={cn(
                "h-full transition-colors",
                selected.includes(item.name) && "border-primary/50 bg-accent"
              )}
            >
              <CardContent className="space-y-1.5 p-4">
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <ChartCard title="Constraints" subtitle="Adjust available resources for this intervention plan">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ConstraintSlider label="Budget" value={budget} max={2000} suffix="K" onValue={setBudget} />
          <ConstraintSlider label="Training Capacity" value={trainingCapacity} max={100} suffix="%" onValue={setTrainingCapacity} />
          <ConstraintSlider label="Hiring Availability" value={hiringAvailability} max={100} suffix="%" onValue={setHiringAvailability} />
          <ConstraintSlider label="Salary Constraint" value={salaryConstraint} max={100} suffix="%" onValue={setSalaryConstraint} />
        </div>
      </ChartCard>

      <ChartCard title="Plan Summary" subtitle={`${chosen.length} interventions selected`}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <SummaryStat label="Cost" value={`$${totals.cost.toLocaleString()}`} />
          <SummaryStat label="Risk Reduction" value={`-${totals.riskReduction} pts`} />
          <SummaryStat label="Skill Impact" value={`${totals.skillImpact}%`} />
          <SummaryStat label="Operational Impact" value={chosen.some((c) => c.operationalImpact === "High") ? "High" : "Medium"} />
          <SummaryStat label="Affected Employees" value={totals.affected} />
          <SummaryStat label="ROI" value={`${roi.toFixed(1)}x`} />
        </div>
        <Button className="mt-5 rounded-full">
          <Sparkles className="h-4 w-4" />
          Build Intervention Plan
        </Button>
      </ChartCard>
    </div>
  );
}

function ConstraintSlider({
  label,
  value,
  max,
  suffix,
  onValue,
}: {
  label: string;
  value: number;
  max: number;
  suffix: string;
  onValue: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <Slider value={[value]} max={max} step={5} onValueChange={([v]) => onValue(v)} />
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
