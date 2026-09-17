import { useState, useEffect } from "react";
import { Loader2, Play, RefreshCw, ArrowRight, ShieldCheck, Sparkles, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { MetricCard } from "@/talvera/components/shared/MetricCard";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { StatusPill } from "@/talvera/components/shared/StatusPill";
import { bestAvailableFuture, scenarioOptions, timeHorizons } from "@/talvera/data/digitalTwin";

const disruptionTone = { Low: "green", Medium: "orange", High: "pink" } as const;

interface DigitalTwinStateSummary {
  employee_count: number;
  team_count: number;
  department_count: number;
  critical_skills_count?: number;
  single_points_of_failure?: string[];
  project_count?: number;
  high_risk_population: number;
  attrition_risk?: number;
  team_health?: number;
  organizational_exposure: number;
  skill_exposure?: number;
  project_exposure?: number;
  cascade_exposure?: number;
  operational_disruption?: "Low" | "Medium" | "High";
}

interface WorldComparison {
  label: string;
  summary: DigitalTwinStateSummary;
  cost_inr: string;
}

export default function DigitalTwin() {
  const [scenario, setScenario] = useState("WORKLOAD_REDUCTION");
  const [horizon, setHorizon] = useState<typeof timeHorizons[number]>("90D");

  const [loading, setLoading] = useState(false);
  const [currState, setCurrState] = useState<DigitalTwinStateSummary | null>(null);
  const [simState, setSimState] = useState<DigitalTwinStateSummary | null>(null);
  const [diff, setDiff] = useState<Record<string, { base: number; simulated: number; delta?: number; tag: string }> | null>(null);
  const [worlds, setWorlds] = useState<WorldComparison[]>([]);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  // Load current state on mount
  useEffect(() => {
    fetch("http://localhost:8000/api/digital-twin/state")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setCurrState(data);
      })
      .catch(() => {
        setCurrState({
          employee_count: 812,
          team_count: 46,
          department_count: 6,
          critical_skills_count: 7,
          high_risk_population: 203,
          organizational_exposure: 74.2,
          cascade_exposure: 34.0,
        });
      });
  }, []);

  // Run simulation scenario or compare worlds
  const handleRunSimulation = async (customScenario?: string, customActions?: Record<string, unknown>) => {
    setLoading(true);
    const targetScenario = customScenario || scenario;

    try {
      // 1. Simulate scenario
      const simRes = await fetch("http://localhost:8000/api/digital-twin/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: targetScenario,
          target_department: "Engineering",
          actions: customActions,
        }),
      });

      if (simRes.ok) {
        const simData = await simRes.json();
        setSimState(simData.simulated_state);
        setDiff(simData.diff);
      }

      // 2. Compare worlds
      const compRes = await fetch("http://localhost:8000/api/digital-twin/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          horizon_days: parseInt(horizon) || 90,
        }),
      });

      if (compRes.ok) {
        const compData = await compRes.json();
        setWorlds(compData.worlds || []);
      }
    } catch {
      // Fallback local state if server offline
      setSimState({
        employee_count: customActions?.remove_employee ? 811 : 813,
        team_count: 46,
        department_count: 6,
        high_risk_population: 168,
        attrition_risk: 21.0,
        team_health: 83.2,
        organizational_exposure: 58.4,
        skill_exposure: 32.0,
        project_exposure: 28.0,
        cascade_exposure: 18.0,
        operational_disruption: "Low",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRunSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario, horizon]);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Workforce Digital Twin" subtitle="Simulate workforce decisions on a cloneable organizational sandbox before committing production changes." />

      {/* Top Current State Metrics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <MetricCard label="Employees" value={currState?.employee_count || 812} />
        <MetricCard label="Teams" value={currState?.team_count || 46} />
        <MetricCard label="Critical Skills" value={currState?.critical_skills_count || 7} />
        <MetricCard label="Projects" value={currState?.project_count || 28} />
        <MetricCard label="High Risk" value={currState?.high_risk_population || 203} />
        <MetricCard label="Cascade Exposure" value={`${currState?.cascade_exposure || 34}%`} />
      </div>

      {/* Interactive Simulation Sandbox Actions */}
      <ChartCard title="Interactive Simulation Sandbox" subtitle="Execute 'What-if' organizational actions on a cloned state">
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant={activeAction === "EXIT" ? "default" : "outline"}
            onClick={() => {
              setActiveAction("EXIT");
              handleRunSimulation("WORKLOAD_REDUCTION", { remove_employee: "rahul-sharma" });
            }}
            className="rounded-full text-xs font-semibold"
          >
            <Play className="h-3.5 w-3.5 text-status-pink" />
            What if Rahul Sharma leaves? (Exit Simulation)
          </Button>

          <Button
            variant={activeAction === "PROJECT" ? "default" : "outline"}
            onClick={() => {
              setActiveAction("PROJECT");
              handleRunSimulation("WORKLOAD_REDUCTION", { mark_critical_project: "Core Platform Migration" });
            }}
            className="rounded-full text-xs font-semibold"
          >
            <Play className="h-3.5 w-3.5 text-status-orange" />
            What if Core Platform Migration becomes Critical?
          </Button>

          <Button
            variant={activeAction === "WORKLOAD" ? "default" : "outline"}
            onClick={() => {
              setActiveAction("WORKLOAD");
              handleRunSimulation("WORKLOAD_REDUCTION", { workload_delta_pct: 20 });
            }}
            className="rounded-full text-xs font-semibold"
          >
            <Play className="h-3.5 w-3.5 text-status-purple" />
            What if Engineering workload increases 20%?
          </Button>

          <Button
            variant={activeAction === "HIRING" ? "default" : "outline"}
            onClick={() => {
              setActiveAction("HIRING");
              handleRunSimulation("HIRING");
            }}
            className="rounded-full text-xs font-semibold"
          >
            <Play className="h-3.5 w-3.5 text-status-teal" />
            What if we hire a Senior K8s Engineer?
          </Button>
        </div>

        {/* Live Simulation Diff Box */}
        {diff && (
          <div className="mt-4 rounded-2xl border border-status-teal/40 bg-status-teal-soft p-4 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-status-teal">
              <span className="flex items-center gap-1.5 uppercase text-[10px]">
                <ShieldCheck className="h-4 w-4" />
                Digital Twin Cloned Simulation Diff
              </span>
              <span className="text-[10px] opacity-80">Production DB Unchanged ✓</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-semibold text-foreground">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Employees</p>
                <p>{diff.employees_changed.base} → {diff.employees_changed.simulated} ({diff.employees_changed.tag})</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Avg Attrition Risk</p>
                <p className="text-status-teal">{diff.risk_changed.base}% → {diff.risk_changed.simulated}% ({diff.risk_changed.delta} pts)</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Org Exposure</p>
                <p>{diff.exposure_changed.base}% → {diff.exposure_changed.simulated}% ({diff.exposure_changed.delta} pts)</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Cascade Exposure</p>
                <p className="text-status-purple">{diff.cascade_changed.base}% → {diff.cascade_changed.simulated}% ({diff.cascade_changed.delta} pts)</p>
              </div>
            </div>
          </div>
        )}
      </ChartCard>

      {/* Scenario & Horizon Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {scenarioOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => {
                setScenario(option.key);
                setActiveAction(null);
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                scenario === option.key
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
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
                horizon === option ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* World Comparison Grid */}
      <ChartCard title="World Comparison" subtitle={`4 distinct simulated organization states over ${horizon}`}>
        {loading ? (
          <div className="flex h-32 items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-status-teal" />
            Simulating world states on cloned Digital Twin graph...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {worlds.length > 0 ? (
              worlds.map((world) => (
                <Card
                  key={world.label}
                  className={cn(
                    "transition-all hover:border-primary/40",
                    world.label.includes("Optimized") ? "border-status-teal/50 bg-status-teal-soft shadow-md" : "border-border bg-card"
                  )}
                >
                  <CardContent className="space-y-3 p-4 text-xs">
                    <p className="font-bold uppercase tracking-wide text-foreground text-[11px]">{world.label}</p>
                    <MetricRow label="Employees" value={`${world.summary.employee_count}`} />
                    <MetricRow label="Attrition Risk" value={`${world.summary.attrition_risk || 21}%`} />
                    <MetricRow label="Team Health" value={`${world.summary.team_health || 83}%`} />
                    <MetricRow label="Skill Exposure" value={`${world.summary.skill_exposure || 32}%`} />
                    <MetricRow label="Project Exposure" value={`${world.summary.project_exposure || 28}%`} />
                    <MetricRow label="Cascade Exposure" value={`${world.summary.cascade_exposure || 18}%`} />
                    <MetricRow label="Estimated Cost" value={world.cost_inr} />
                    <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[11px]">
                      <span className="text-muted-foreground">Disruption</span>
                      <StatusPill tone={disruptionTone[world.summary.operational_disruption || "Low"]}>
                        {world.summary.operational_disruption || "Low"}
                      </StatusPill>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              /* Static comparison cards if server offline */
              [
                { label: "Current World", risk: "34%", health: "61%", skill: "58%", cost: "₹0", disruption: "Medium" },
                { label: "Scenario A (Workload -15%)", risk: "26%", health: "70%", skill: "46%", cost: "₹4,20,000", disruption: "Medium" },
                { label: "Scenario B (Org Workload -20%)", risk: "21%", health: "75%", skill: "38%", cost: "₹6,80,000", disruption: "Low" },
                { label: "Optimized World (Hiring + Workload)", risk: "15%", health: "84%", skill: "24%", cost: "₹9,10,000", disruption: "Low" },
              ].map((w) => (
                <Card key={w.label} className={w.label.includes("Optimized") ? "border-status-teal/50 bg-status-teal-soft" : undefined}>
                  <CardContent className="space-y-3 p-4 text-xs">
                    <p className="font-bold uppercase tracking-wide text-foreground text-[11px]">{w.label}</p>
                    <MetricRow label="Attrition Risk" value={w.risk} />
                    <MetricRow label="Team Health" value={w.health} />
                    <MetricRow label="Skill Exposure" value={w.skill} />
                    <MetricRow label="Cost" value={w.cost} />
                    <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[11px]">
                      <span className="text-muted-foreground">Disruption</span>
                      <StatusPill tone={disruptionTone[w.disruption as "Low" | "Medium" | "High"]}>{w.disruption}</StatusPill>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </ChartCard>

      {/* Best Available Future Recommendation */}
      <ChartCard title="Best Available Future" subtitle="Talvera's recommended path forward">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow label="Recommendation" value={bestAvailableFuture.recommendation} />
          <InfoRow label="Expected Impact" value={bestAvailableFuture.expectedImpact} />
          <InfoRow label="Cost" value="₹6,80,000 over 90 days" />
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
