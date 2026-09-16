import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { StatusPill } from "@/talvera/components/shared/StatusPill";
import { employees } from "@/talvera/data/employees";
import { departments } from "@/talvera/data/departments";
import { teams } from "@/talvera/data/skills";
import { trajectoryTone, zoneTone } from "@/talvera/lib/status";

const riskBuckets = ["All", "Critical (70+)", "Elevated (50-69)", "Watch (<50)"] as const;

export default function Employees() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [team, setTeam] = useState("All");
  const [risk, setRisk] = useState<typeof riskBuckets[number]>("All");
  const [trajectory, setTrajectory] = useState("All");

  const filtered = useMemo(() => {
    return employees.filter((employee) => {
      if (search && !employee.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (department !== "All" && employee.department !== department) return false;
      if (team !== "All" && employee.team !== team) return false;
      if (trajectory !== "All" && employee.trajectory !== trajectory) return false;
      if (risk === "Critical (70+)" && employee.attritionRisk < 70) return false;
      if (risk === "Elevated (50-69)" && (employee.attritionRisk < 50 || employee.attritionRisk >= 70)) return false;
      if (risk === "Watch (<50)" && employee.attritionRisk >= 50) return false;
      return true;
    });
  }, [search, department, team, risk, trajectory]);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Employee Intelligence" subtitle="Understand employee risk in organizational context." />

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search employees"
            className="rounded-full bg-card pl-9"
          />
        </div>
        <FilterSelect label="Department" value={department} onChange={setDepartment} options={["All", ...departments.map((d) => d.name)]} />
        <FilterSelect label="Team" value={team} onChange={setTeam} options={["All", ...teams]} />
        <FilterSelect label="Risk" value={risk} onChange={(v) => setRisk(v as typeof riskBuckets[number])} options={[...riskBuckets]} />
        <FilterSelect label="Trajectory" value={trajectory} onChange={setTrajectory} options={["All", "Improving", "Stable", "Deteriorating"]} />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Trajectory</TableHead>
              <TableHead>Exposure</TableHead>
              <TableHead>Top Factor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((employee) => (
              <TableRow
                key={employee.id}
                className="cursor-pointer"
                onClick={() => navigate(`/talvera/employees/${employee.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-secondary text-[11px] font-semibold text-secondary-foreground">
                        {employee.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <p className="text-sm font-medium text-foreground">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.role}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{employee.department}</TableCell>
                <TableCell className="text-sm font-semibold text-foreground">{employee.attritionRisk}%</TableCell>
                <TableCell>
                  <StatusPill tone={trajectoryTone[employee.trajectory]}>{employee.trajectory}</StatusPill>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{employee.orgExposure}%</TableCell>
                <TableCell className="text-sm text-muted-foreground">{employee.topFactor}</TableCell>
                <TableCell>
                  <StatusPill tone={zoneTone[employee.zone]} dot>
                    {employee.zone}
                  </StatusPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
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
