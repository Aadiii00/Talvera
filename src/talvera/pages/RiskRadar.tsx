import { useState } from "react";
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
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { employees } from "@/talvera/data/employees";
import { departments } from "@/talvera/data/departments";
import { toneColor, zoneTone } from "@/talvera/lib/status";

const chartConfig: ChartConfig = {
  risk: { label: "Personal Risk" },
};

const departmentChartConfig: ChartConfig = {
  riskScore: { label: "Risk Score", color: "hsl(var(--status-blue))" },
};

export default function RiskRadar() {
  const [department, setDepartment] = useState("All");
  const filteredEmployees = department === "All" ? employees : employees.filter((e) => e.department === department);

  const scatterData = filteredEmployees.map((employee) => ({
    risk: employee.attritionRisk,
    exposure: employee.orgExposure,
    name: employee.name,
    department: employee.department,
    trajectory: employee.trajectory,
    zone: employee.zone,
    fill: toneColor[zoneTone[employee.zone]],
  }));

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Workforce Risk Radar" subtitle="Where workforce risk is rising." />

      <div className="flex flex-wrap items-center gap-2.5">
        <FilterSelect label="Department" value={department} onChange={setDepartment} options={["All", ...departments.map((d) => d.name)]} />
        <FilterSelect label="Team" value="All" onChange={() => {}} options={["All"]} />
        <FilterSelect label="Manager" value="All" onChange={() => {}} options={["All"]} />
        <FilterSelect label="Trajectory" value="All" onChange={() => {}} options={["All", "Improving", "Stable", "Deteriorating"]} />
      </div>

      <ChartCard
        title="Personal Risk × Organizational Exposure"
        subtitle="Each point represents one employee. Hover for details."
      >
        <ChartContainer config={chartConfig} className="aspect-auto h-[380px] w-full">
          <ScatterChart margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
            <CartesianGrid stroke="hsl(var(--border))" />
            <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill="hsl(var(--status-blue-soft))" fillOpacity={0.5} />
            <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill="hsl(var(--status-purple-soft))" fillOpacity={0.5} />
            <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill="hsl(var(--status-orange-soft))" fillOpacity={0.5} />
            <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="hsl(var(--status-pink-soft))" fillOpacity={0.5} />
            <XAxis
              type="number"
              dataKey="risk"
              name="Personal Risk"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              fontSize={11}
              label={{ value: "Personal Risk", position: "insideBottom", offset: -4, fontSize: 11 }}
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
              label={{ value: "Org. Exposure", angle: -90, position: "insideLeft", fontSize: 11 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(_value, _name, item) => {
                    const point = item.payload as typeof scatterData[number];
                    return (
                      <div className="space-y-0.5">
                        <p className="font-semibold text-foreground">{point.name}</p>
                        <p className="text-muted-foreground">{point.department}</p>
                        <p className="text-muted-foreground">Risk {point.risk}% · Exposure {point.exposure}%</p>
                        <p className="text-muted-foreground">Trajectory: {point.trajectory}</p>
                      </div>
                    );
                  }}
                />
              }
            />
            <Scatter data={scatterData} shape="circle">
              {scatterData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} r={7} />
              ))}
            </Scatter>
          </ScatterChart>
        </ChartContainer>
        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
          <LegendDot color={toneColor.blue} label="Monitor" />
          <LegendDot color={toneColor.orange} label="Support" />
          <LegendDot color={toneColor.purple} label="Protect" />
          <LegendDot color={toneColor.pink} label="Critical" />
        </div>
      </ChartCard>

      <ChartCard title="Risk by Department" subtitle="Average risk score across each department">
        <ChartContainer config={departmentChartConfig} className="aspect-auto h-[260px] w-full">
          <BarChart data={departments} layout="vertical" margin={{ left: 12, right: 24 }}>
            <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
            <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} fontSize={11} />
            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={12} width={90} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="riskScore" radius={[0, 6, 6, 0]} fill="hsl(var(--status-blue))" barSize={16} />
          </BarChart>
        </ChartContainer>
      </ChartCard>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
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
      <SelectTrigger className="h-9 w-auto min-w-[130px] rounded-full bg-card text-xs">
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
