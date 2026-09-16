import { useParams, Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { StatusPill } from "@/talvera/components/shared/StatusPill";
import { FlowChain } from "@/talvera/components/shared/FlowChain";
import { getEmployeeById } from "@/talvera/data/employees";
import { confidenceTone, decisionTone, trajectoryTone } from "@/talvera/lib/status";
import { useState } from "react";
import NotFound from "@/pages/NotFound";

const chartConfig: ChartConfig = {
  risk: { label: "Attrition Risk", color: "hsl(var(--status-pink))" },
};

export default function EmployeeDetail() {
  const { id } = useParams();
  const employee = id ? getEmployeeById(id) : undefined;
  const [workloadCut, setWorkloadCut] = useState(15);

  if (!employee) return <NotFound />;

  const simulatedRisk = Math.max(
    0,
    Math.round(employee.attritionRisk - workloadCut * 1.6)
  );

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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.3fr]">
        <ChartCard title="What Could Change?" subtitle="Simulation">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Current</p>
                <p className="text-2xl font-bold text-foreground">{employee.attritionRisk}%</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Simulated</p>
                <p className="text-2xl font-bold text-status-teal">{simulatedRisk}%</p>
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Scenario: Workload -{workloadCut}%</span>
                <span className="text-muted-foreground">Engagement +1.1</span>
              </div>
              <Slider value={[workloadCut]} onValueChange={([v]) => setWorkloadCut(v)} max={40} step={1} />
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Decision" subtitle="Recommended course of action">
          <div className="flex flex-wrap gap-2">
            {(["Act", "Review", "Simulate", "Wait", "Do Not Act"] as const).map((action) => (
              <StatusPill
                key={action}
                tone={decisionTone[action]}
                className={action === employee.decision ? "px-4 py-1.5 text-xs" : "opacity-40"}
                dot={action === employee.decision}
              >
                {action}
              </StatusPill>
            ))}
          </div>
        </ChartCard>
      </div>
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
