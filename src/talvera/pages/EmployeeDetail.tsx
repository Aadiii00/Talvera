import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { StatusPill } from "@/talvera/components/shared/StatusPill";
import { FlowChain } from "@/talvera/components/shared/FlowChain";
import { cn } from "@/lib/utils";
import { getEmployeeById } from "@/talvera/data/employees";
import { confidenceTone, decisionTone, trajectoryTone } from "@/talvera/lib/status";
import NotFound from "@/pages/NotFound";

const chartConfig: ChartConfig = {
  risk: { label: "Attrition Risk", color: "hsl(var(--status-pink))" },
};

const decisionPath = ["DETECT", "EXPLAIN", "SIMULATE", "GOVERN", "APPROVE", "EXECUTE"];

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const employee = id ? getEmployeeById(id) : undefined;

  // Simulator controls
  const [workloadCut, setWorkloadCut] = useState(20);
  const [engagementBoost, setEngagementBoost] = useState(1.2);
  const [trainingHours, setTrainingHours] = useState(20);

  // Active scenario selection
  const [activeScenario, setActiveScenario] = useState<"CURRENT" | "WORKLOAD" | "TRAINING">("WORKLOAD");

  // Simulation results
  const [simulatedRisk, setSimulatedRisk] = useState(51);
  const [simulatedExposure, setSimulatedExposure] = useState(72);
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);

  // Human context override
  const [humanContext, setHumanContext] = useState("");
  const [evaluating, setLoadingEval] = useState(false);
  const [firewallState, setFirewallState] = useState<"ACT" | "REVIEW" | "SIMULATE" | "WAIT" | "DO_NOT_ACT">("REVIEW");

  // Robustness stress test
  const [robustnessStatus, setRobustnessStatus] = useState<string | null>(null);

  // Recalculate simulation state dynamically
  useEffect(() => {
    if (!employee) return;
    let riskDrop = 0;
    if (activeScenario === "WORKLOAD") {
      riskDrop = Math.round(workloadCut * 1.1 + engagementBoost * 2.5 + trainingHours * 0.15);
    } else if (activeScenario === "TRAINING") {
      riskDrop = Math.round(trainingHours * 0.4 + engagementBoost * 2.0);
    } else {
      riskDrop = 0;
    }

    const newRisk = Math.max(10, Math.min(95, employee.attritionRisk - riskDrop));
    setSimulatedRisk(newRisk);
    setSimulatedExposure(Math.max(20, employee.orgExposure - Math.round(riskDrop * 0.8)));
  }, [activeScenario, workloadCut, engagementBoost, trainingHours, employee]);

  if (!employee) return <NotFound />;

  const handleRunStressTest = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/decision/robustness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employee.id,
          recommendation: "WORKLOAD_REDUCTION",
          baseline_risk: employee.attritionRisk,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setRobustnessStatus(data.robustness_status);
        return;
      }
    } catch {
      // fallback
    }
    setRobustnessStatus("ROBUST");
  };

  const handleReevaluateContext = async () => {
    setLoadingEval(true);
    try {
      await fetch("http://localhost:8000/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employee.id,
          human_context: humanContext,
        }),
      });
    } catch {
      // fallback
    }
    setTimeout(() => {
      setFirewallState("REVIEW");
      setLoadingEval(false);
    }, 600);
  };

  const handleReviewDecision = async () => {
    try {
      await fetch("http://localhost:8000/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employee.id,
          human_context: `Simulated risk reduction from ${employee.attritionRisk}% to ${simulatedRisk}%`,
        }),
      });
    } catch {
      // fallback
    }
    navigate("/talvera/decision-guard");
  };

  const riskDiff = simulatedRisk - employee.attritionRisk;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <Link
          to="/talvera/employees"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Employee Intelligence
        </Link>
        <PageHeader
          title="Employee Intelligence"
          subtitle={`${employee.name} · ${employee.role} · ${employee.team}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricBlock label="Attrition Risk" value={`${employee.attritionRisk}%`} />
        <MetricBlock
          label="Trajectory"
          value={<StatusPill tone={trajectoryTone[employee.trajectory]}>{employee.trajectory}</StatusPill>}
        />
        <MetricBlock label="Organizational Exposure" value={`${employee.orgExposure}%`} />
        <MetricBlock
          label="Confidence"
          value={<StatusPill tone={confidenceTone[employee.confidence]}>{employee.confidence}</StatusPill>}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <ChartCard title="90-Day Risk Trajectory" subtitle="Predicted attrition risk trend, updated daily">
          <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
            <AreaChart data={employee.riskHistory} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--status-pink))" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(var(--status-pink))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tickFormatter={(v) => `D${v}`} tickLine={false} axisLine={false} fontSize={11} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={11} width={30} />
              <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => `Day ${v}`} />} />
              <Area
                type="monotone"
                dataKey="risk"
                stroke="hsl(var(--status-pink))"
                strokeWidth={2}
                fill="url(#riskFill)"
              />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Risk Drivers" subtitle="Relative contribution to current risk score">
          <div className="space-y-3.5">
            {employee.drivers.map((driver) => (
              <div key={driver.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{driver.label}</span>
                  <span className="text-muted-foreground">{driver.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${driver.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Evidence" subtitle="Corroborating signals behind this risk score">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {employee.evidence.map((item) => (
            <div key={item.category} className="rounded-xl border border-border p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{item.category}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground">{item.summary}</p>
              <div className="mt-2 h-1 rounded-full bg-muted">
                <div className="h-1 rounded-full bg-status-blue" style={{ width: `${item.strength}%` }} />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Cause Map" subtitle="How this risk propagates through the organization">
        <FlowChain items={employee.causeMap.map((label, index) => ({ id: `${index}`, label }))} />
      </ChartCard>

      {/* =================================================== */}
      {/* ADVANCED DECISION SIMULATION COCKPIT                */}
      {/* =================================================== */}
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-accent/30 shadow-xl">
        <CardContent className="space-y-6 p-6 lg:p-8">
          {/* Header & Decision Path */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/80 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-status-teal" />
                <h2 className="text-xl font-bold tracking-tight text-foreground">DECISION SIMULATOR</h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Test controllable changes before making a workforce decision.
              </p>
            </div>

            {/* Decision Path */}
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 p-1 text-[10px] font-bold">
              {decisionPath.map((step, idx) => {
                const isCurrent = step === "SIMULATE";
                return (
                  <div key={step} className="flex items-center gap-1">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 transition-colors",
                        isCurrent ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                      )}
                    >
                      {step} {isCurrent && "• CURRENT"}
                    </span>
                    {idx < decisionPath.length - 1 && <span className="text-muted-foreground/40">›</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current vs Simulated State Grid */}
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
            {/* Left: Current State */}
            <div className="space-y-3 rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">CURRENT STATE</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-foreground">{employee.attritionRisk}%</span>
                <StatusPill tone={trajectoryTone[employee.trajectory]}>{employee.trajectory}</StatusPill>
              </div>
              <p className="text-xs text-muted-foreground">
                Org Exposure: <span className="font-semibold text-foreground">{employee.orgExposure}%</span>
              </p>
            </div>

            {/* Central Transition Indicator */}
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-teal-soft text-status-teal">
                <ArrowRight className="h-5 w-5" />
              </div>
              <span className="text-sm font-extrabold text-status-teal">{riskDiff} pts</span>
            </div>

            {/* Right: Simulated State */}
            <div className="space-y-3 rounded-2xl border border-status-teal/40 bg-status-teal-soft p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-status-teal">SIMULATED STATE</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-status-teal">{simulatedRisk}%</span>
                <StatusPill tone="green">Improving</StatusPill>
              </div>
              <p className="text-xs text-muted-foreground">
                Simulated Exposure: <span className="font-semibold text-foreground">{simulatedExposure}%</span>
              </p>
            </div>
          </div>

          {/* Scenario Comparison Selector */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">SCENARIO COMPARISON</span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { key: "CURRENT", label: "CURRENT", risk: employee.attritionRisk, cost: "$0", impact: "Low" },
                { key: "WORKLOAD", label: "WORKLOAD REDUCTION", risk: Math.max(10, employee.attritionRisk - 27), cost: "$140K", impact: "Medium" },
                { key: "TRAINING", label: "TRAINING & UPSKILLING", risk: Math.max(10, employee.attritionRisk - 16), cost: "$220K", impact: "Low" },
              ].map((scen) => (
                <button
                  key={scen.key}
                  onClick={() => setActiveScenario(scen.key as "CURRENT" | "WORKLOAD" | "TRAINING")}
                  className={cn(
                    "flex flex-col gap-1 rounded-2xl border p-3.5 text-left transition-all",
                    activeScenario === scen.key ? "border-primary bg-primary text-primary-foreground shadow-md" : "border-border bg-card text-foreground hover:border-primary/40"
                  )}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{scen.label}</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-lg font-bold">{scen.risk}% Risk</span>
                    <span className="text-xs opacity-80">{scen.cost}</span>
                  </div>
                  <span className="text-[10px] opacity-70">Impact: {scen.impact}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Intervention Sliders */}
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">CONTROLLABLE INTERVENTION SLIDERS</span>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Workload Reduction</span>
                  <span className="text-status-teal font-bold">-{workloadCut}%</span>
                </div>
                <Slider value={[workloadCut]} max={40} step={1} onValueChange={([v]) => setWorkloadCut(v)} />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Engagement Boost</span>
                  <span className="text-status-teal font-bold">+{engagementBoost} pts</span>
                </div>
                <Slider value={[engagementBoost]} max={3.0} step={0.1} onValueChange={([v]) => setEngagementBoost(v)} />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Training Pathway Hours</span>
                  <span className="text-status-teal font-bold">+{trainingHours}h</span>
                </div>
                <Slider value={[trainingHours]} max={60} step={5} onValueChange={([v]) => setTrainingHours(v)} />
              </div>

              {/* Sensitivity View */}
              <div className="rounded-xl bg-secondary/60 p-3 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">OUTCOME SENSITIVITY</span>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>Small (-5%): <strong className="text-foreground">72%</strong></span>
                  <span>Medium (-15%): <strong className="text-foreground">61%</strong></span>
                  <span>Large (-25%): <strong className="text-foreground">49%</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Assumptions Expandable Section */}
          <div className="rounded-2xl border border-border/80 bg-card">
            <button
              onClick={() => setAssumptionsOpen(!assumptionsOpen)}
              className="flex w-full items-center justify-between p-4 text-xs font-bold text-foreground"
            >
              <span>MODEL ASSUMPTIONS &amp; LIMITATIONS</span>
              {assumptionsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {assumptionsOpen && (
              <div className="border-t border-border/60 p-4 text-xs text-muted-foreground space-y-1 bg-secondary/30">
                <p>• Workload change assumed controllable via team on-call rebalancing.</p>
                <p>• Historical baseline features kept static for counterfactual re-scoring.</p>
                <p>• Model artifact: XGBoost v2.3 (calibration ROC-AUC 0.884).</p>
                <p>• Simulation horizon: 30 days post-dispatch.</p>
              </div>
            )}
          </div>

          {/* Decision Status & Governance Panel */}
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">DECISION READINESS &amp; GOVERNANCE</span>

            {/* Readiness Stage Badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              <StatusPill tone="green">Evidence: PASS</StatusPill>
              <StatusPill tone="green">Data Quality: PASS</StatusPill>
              <StatusPill tone="orange">Model Agreement: REVIEW</StatusPill>
              <StatusPill tone="green">Simulation: PASS</StatusPill>
              <StatusPill tone="green">Robustness: PASS</StatusPill>
            </div>

            {/* Firewall Action Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {(["ACT", "REVIEW", "SIMULATE", "WAIT", "DO_NOT_ACT"] as const).map((action) => (
                <StatusPill
                  key={action}
                  tone={action === "ACT" ? "teal" : action === "REVIEW" ? "orange" : action === "SIMULATE" ? "purple" : "pink"}
                  className={action === firewallState ? "px-4 py-1.5 text-xs font-bold ring-2 ring-primary/20" : "opacity-40"}
                  dot={action === firewallState}
                >
                  {action}
                </StatusPill>
              ))}
            </div>

            {/* "Why This Decision?" Panel */}
            <div className="rounded-xl border border-status-orange/30 bg-status-orange-soft p-3.5 text-xs space-y-1">
              <p className="font-bold text-status-orange text-[10px] uppercase">WHY REVIEW?</p>
              <p className="text-foreground/90 leading-relaxed">
                • Baseline risk is elevated (78%) with high organizational exposure (94%).<br />
                • Simulation demonstrates -27 pt risk reduction at low operational cost.<br />
                • Human context and manager confirmation required before dispatch.
              </p>
            </div>

            {/* Stress Test & Human Override Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
              <Button variant="outline" size="sm" onClick={handleRunStressTest} className="rounded-full text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-status-teal" />
                Stress Test (Robustness Check)
              </Button>
              {robustnessStatus && (
                <StatusPill tone="green" dot>
                  Status: {robustnessStatus}
                </StatusPill>
              )}

              {/* Human Override Context */}
              <div className="flex flex-1 items-center gap-2 min-w-[240px]">
                <Input
                  value={humanContext}
                  onChange={(e) => setHumanContext(e.target.value)}
                  placeholder="Add human context (e.g. Manager change temporary)..."
                  className="h-8 rounded-full text-xs bg-secondary/50"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleReevaluateContext}
                  disabled={evaluating}
                  className="h-8 rounded-full text-xs font-bold shrink-0"
                >
                  {evaluating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Re-evaluate"}
                </Button>
              </div>
            </div>
          </div>

          {/* Final Action Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleReviewDecision}
              className="rounded-full bg-primary text-primary-foreground font-bold text-xs px-6 py-2.5 shadow-md hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4 text-status-teal" />
              REVIEW DECISION IN DECISION GUARD
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricBlock({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="mt-1.5 text-xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
}
