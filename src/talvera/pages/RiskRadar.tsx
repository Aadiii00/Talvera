import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceArea,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { StatusPill } from "@/talvera/components/shared/StatusPill";
import { employees } from "@/talvera/data/employees";
import { departments } from "@/talvera/data/departments";
import { toneColor, zoneTone, trajectoryTone, decisionTone } from "@/talvera/lib/status";
import type { RiskZone, Trajectory } from "@/talvera/data/types";

const zones: { name: RiskZone; label: string; desc: string; tone: "blue" | "purple" | "orange" | "pink" }[] = [
  { name: "Monitor", label: "Monitor Zone", desc: "Low Risk · Low Exposure", tone: "blue" },
  { name: "Support", label: "Support Zone", desc: "High Risk · Low Exposure", tone: "orange" },
  { name: "Protect", label: "Protect Zone", desc: "Low Risk · High Exposure", tone: "purple" },
  { name: "Critical", label: "Critical Zone", desc: "High Risk · High Exposure", tone: "pink" },
];

export default function RiskRadar() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("All");
  const [trajectoryFilter, setTrajectoryFilter] = useState("All");
  const [zoneFilter, setZoneFilter] = useState("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredEmployees = employees.filter((e) => {
    if (department !== "All" && e.department !== department) return false;
    if (trajectoryFilter !== "All" && e.trajectory !== trajectoryFilter) return false;
    if (zoneFilter !== "All" && e.zone !== zoneFilter) return false;
    return true;
  });

  const scatterData = filteredEmployees.map((employee) => ({
    id: employee.id,
    risk: employee.attritionRisk,
    exposure: employee.orgExposure,
    name: employee.name,
    initials: employee.initials,
    role: employee.role,
    department: employee.department,
    team: employee.team,
    trajectory: employee.trajectory,
    topFactor: employee.topFactor,
    decision: employee.decision,
    zone: employee.zone,
    color: toneColor[zoneTone[employee.zone]],
    softColor: `hsl(var(--status-${zoneTone[employee.zone]}-soft))`,
  }));

  const countByZone = (z: RiskZone) => employees.filter((e) => e.zone === z).length;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Workforce Risk Radar" subtitle="Multi-dimensional risk mapping across personal attrition risk and organizational exposure." />

      {/* Top Quadrant Summary Pills */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {zones.map((z) => (
          <div
            key={z.name}
            onClick={() => setZoneFilter(zoneFilter === z.name ? "All" : z.name)}
            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all hover:shadow-sm ${
              zoneFilter === z.name ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
            }`}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{z.label}</p>
              <p className="mt-0.5 text-xs font-semibold">{z.desc}</p>
            </div>
            <StatusPill tone={z.tone} className="text-xs font-bold">
              {countByZone(z.name)}
            </StatusPill>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <FilterSelect label="Department" value={department} onChange={setDepartment} options={["All", ...departments.map((d) => d.name)]} />
        <FilterSelect label="Trajectory" value={trajectoryFilter} onChange={setTrajectoryFilter} options={["All", "Improving", "Stable", "Deteriorating"]} />
        <FilterSelect label="Risk Zone" value={zoneFilter} onChange={setZoneFilter} options={["All", "Monitor", "Support", "Protect", "Critical"]} />
      </div>

      {/* Main Scatter Radar */}
      <ChartCard
        title="Personal Risk × Organizational Exposure"
        subtitle="Hover employee points for full intelligence preview. Click to view complete profile."
      >
        <div className="relative aspect-auto h-[440px] w-full">
          {/* Quadrant Watermark Badges */}
          <div className="pointer-events-none absolute inset-0 z-0 grid grid-cols-2 grid-rows-2 p-8">
            <div className="text-[10px] font-bold uppercase tracking-widest text-status-purple/40">
              PROTECT ZONE
            </div>
            <div className="text-right text-[10px] font-bold uppercase tracking-widest text-status-pink/40">
              CRITICAL ZONE
            </div>
            <div className="flex items-end text-[10px] font-bold uppercase tracking-widest text-status-blue/40">
              MONITOR ZONE
            </div>
            <div className="flex items-end justify-end text-[10px] font-bold uppercase tracking-widest text-status-orange/40">
              SUPPORT ZONE
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ left: 0, right: 20, top: 16, bottom: 20 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill="hsl(var(--status-blue-soft))" fillOpacity={0.35} />
              <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill="hsl(var(--status-purple-soft))" fillOpacity={0.35} />
              <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill="hsl(var(--status-orange-soft))" fillOpacity={0.35} />
              <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="hsl(var(--status-pink-soft))" fillOpacity={0.35} />
              <XAxis
                type="number"
                dataKey="risk"
                name="Personal Risk"
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                fontSize={11}
                label={{ value: "Personal Risk (%) →", position: "insideBottom", offset: -10, fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                type="number"
                dataKey="exposure"
                name="Organizational Exposure"
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                fontSize={11}
                width={36}
                label={{ value: "← Org. Exposure (%)", angle: -90, position: "insideLeft", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />

              <Tooltip
                cursor={{ strokeDasharray: "3 3", stroke: "hsl(var(--muted-foreground))", strokeWidth: 0.8 }}
                content={<IntelligenceTooltip />}
              />

              <Scatter
                data={scatterData}
                onClick={(entry) => navigate(`/talvera/employees/${entry.id}`)}
                onMouseEnter={(entry) => setHoveredId(entry.id)}
                onMouseLeave={() => setHoveredId(null)}
                shape={(props: { cx?: number; cy?: number; payload?: (typeof scatterData)[number] }) => {
                  const { cx = 0, cy = 0, payload } = props;
                  if (!payload) return null;
                  const isHovered = hoveredId === payload.id;
                  const isDimmed = hoveredId !== null && !isHovered;
                  const isCritical = payload.zone === "Critical";

                  return (
                    <g className="cursor-pointer transition-all duration-200">
                      {isHovered && (
                        <circle cx={cx} cy={cy} r={22} fill={payload.color} opacity={0.25} />
                      )}
                      {isCritical && !isHovered && (
                        <circle cx={cx} cy={cy} r={14} fill={payload.color} opacity={0.2} className="animate-ping" />
                      )}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 13 : 10}
                        fill={payload.softColor}
                        stroke={payload.color}
                        strokeWidth={isHovered ? 3 : 2}
                        opacity={isDimmed ? 0.35 : 1}
                      />
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 5 : 4}
                        fill={payload.color}
                        opacity={isDimmed ? 0.35 : 1}
                      />
                    </g>
                  );
                }}
              >
                {scatterData.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
          <div className="flex flex-wrap items-center gap-5">
            <LegendDot color={toneColor.blue} label="Monitor (<50% Risk, <50% Exp)" />
            <LegendDot color={toneColor.orange} label="Support (≥50% Risk, <50% Exp)" />
            <LegendDot color={toneColor.purple} label="Protect (<50% Risk, ≥50% Exp)" />
            <LegendDot color={toneColor.pink} label="Critical (≥50% Risk, ≥50% Exp)" />
          </div>
          <span className="text-xs font-semibold text-foreground">{scatterData.length} Employees Mapped</span>
        </div>
      </ChartCard>

      {/* Department Risk Distribution */}
      <ChartCard title="Department Risk Distribution" subtitle="Average attrition risk score across departments">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departments} layout="vertical" margin={{ left: 12, right: 24, top: 4, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} fontSize={11} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={12} width={90} />
              <Bar dataKey="riskScore" radius={[0, 8, 8, 0]} barSize={18}>
                {departments.map((dept) => (
                  <Cell
                    key={dept.name}
                    fill={
                      dept.riskScore >= 70
                        ? toneColor.pink
                        : dept.riskScore >= 50
                          ? toneColor.orange
                          : toneColor.blue
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}

function IntelligenceTooltip({ active, payload }: { active?: boolean; payload?: { payload: (typeof scatterData)[number] }[] }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  const emp = employees.find((e) => e.id === data.id) || data;

  return (
    <div className="z-50 min-w-[270px] max-w-[300px] rounded-2xl border border-border/90 bg-card/95 p-4 shadow-2xl backdrop-blur-md transition-all duration-150">
      {/* Employee Header */}
      <div className="flex items-center gap-3 border-b border-border/60 pb-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-extrabold text-foreground border border-border">
          {emp.initials || "HR"}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-bold text-foreground">{emp.name}</p>
          <p className="truncate text-xs font-medium text-muted-foreground">{emp.role}</p>
          <p className="truncate text-[10.5px] text-muted-foreground/80">{emp.department} · {emp.team}</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-secondary/60 p-2.5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Personal Risk</p>
          <p className="text-base font-extrabold text-status-pink">{emp.attritionRisk}%</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Org Exposure</p>
          <p className="text-base font-extrabold text-foreground">{emp.orgExposure}%</p>
        </div>
      </div>

      {/* Trajectory & Risk Change */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Trajectory</span>
          <StatusPill tone={trajectoryTone[emp.trajectory as Trajectory] || "blue"}>
            {emp.trajectory}
          </StatusPill>
        </div>
        <span className="text-[11px] font-semibold text-status-pink">+12.4%</span>
      </div>

      {/* Details List */}
      <div className="mt-2.5 space-y-1.5 border-t border-border/50 pt-2.5 text-xs">
        {emp.topFactor && (
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-medium text-muted-foreground">Top Signal</span>
            <span className="font-semibold text-foreground">{emp.topFactor}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-medium text-muted-foreground">Critical Skill</span>
          <span className="font-semibold text-foreground">Kubernetes</span>
        </div>
        {emp.decision && (
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-medium text-muted-foreground">Decision State</span>
            <StatusPill tone={decisionTone[emp.decision] || "teal"}>{emp.decision}</StatusPill>
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-[10px] font-semibold text-muted-foreground/80 italic">
        Click to view full intelligence profile →
      </p>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 font-medium">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-auto min-w-[130px] rounded-full bg-card text-xs font-medium">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option} className="text-xs">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
