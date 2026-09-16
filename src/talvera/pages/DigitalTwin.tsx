import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { MetricCard } from "@/talvera/components/shared/MetricCard";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { StatusPill } from "@/talvera/components/shared/StatusPill";
import {
  bestAvailableFuture,
  digitalTwinTopMetrics,
  scenarioOptions,
  timeHorizons,
  worldComparison,
} from "@/talvera/data/digitalTwin";

const disruptionTone = { Low: "green", Medium: "orange", High: "pink" } as const;

export default function DigitalTwin() {
  const [scenario, setScenario] = useState(scenarioOptions[2].key);
  const [horizon, setHorizon] = useState<typeof timeHorizons[number]>("90D");

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Workforce Digital Twin" subtitle="Simulate workforce decisions before they become organizational reality." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <MetricCard label="Employees" value={digitalTwinTopMetrics.employees} />
        <MetricCard label="Teams" value={digitalTwinTopMetrics.teams} />
        <MetricCard label="Critical Skills" value={digitalTwinTopMetrics.criticalSkills} />
        <MetricCard label="Projects" value={digitalTwinTopMetrics.projects} />
        <MetricCard label="High Risk" value={digitalTwinTopMetrics.highRisk} />
        <MetricCard label="Cascade Exposure" value={`${digitalTwinTopMetrics.cascadeExposure}%`} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {scenarioOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setScenario(option.key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                scenario === option.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-full border border-border bg-card p-1">
          {timeHorizons.map((option) => (
            <button
              key={option}
              onClick={() => setHorizon(option)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                horizon === option ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <ChartCard title="World Comparison" subtitle={`Projected outcomes over ${horizon}`}>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          {worldComparison.map((world) => (
            <Card key={world.label} className={world.label === "Optimized World" ? "border-status-teal/40 bg-status-teal-soft" : undefined}>
              <CardContent className="space-y-3 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-foreground">{world.label}</p>
                <MetricRow label="Attrition Risk" value={`${world.attritionRisk}%`} />
                <MetricRow label="Team Health" value={`${world.teamHealth}%`} />
                <MetricRow label="Skill Exposure" value={`${world.skillExposure}%`} />
                <MetricRow label="Project Exposure" value={`${world.projectExposure}%`} />
                <MetricRow label="Cost" value={world.cost ? `$${world.cost}K` : "$0"} />
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Disruption</span>
                  <StatusPill tone={disruptionTone[world.operationalDisruption]}>{world.operationalDisruption}</StatusPill>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Best Available Future" subtitle="Talvera's recommended path forward">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow label="Recommendation" value={bestAvailableFuture.recommendation} />
          <InfoRow label="Expected Impact" value={bestAvailableFuture.expectedImpact} />
          <InfoRow label="Cost" value={bestAvailableFuture.cost} />
          <InfoRow label="Tradeoffs" value={bestAvailableFuture.tradeoffs} />
          <InfoRow label="Confidence" value={bestAvailableFuture.confidence} />
        </div>
      </ChartCard>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-foreground">{value}</p>
    </div>
  );
}
