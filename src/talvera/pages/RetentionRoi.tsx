import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { MetricCard } from "@/talvera/components/shared/MetricCard";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { StatusPill } from "@/talvera/components/shared/StatusPill";
import { interventions, retentionRoiSummary } from "@/talvera/data/interventions";

export default function RetentionRoi() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Retention ROI" subtitle="Understand the cost and impact of workforce interventions." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard label="Employees at Risk" value={retentionRoiSummary.employeesAtRisk} />
        <MetricCard label="Replacement Cost" value={`$${retentionRoiSummary.replacementCost}M`} />
        <MetricCard label="Intervention Cost" value={`$${retentionRoiSummary.interventionCost}M`} />
        <MetricCard label="Potential Loss Avoided" value={`$${retentionRoiSummary.potentialLossAvoided}M`} />
        <MetricCard label="Retention ROI" value={`${retentionRoiSummary.retentionRoi}x`} />
      </div>

      <ChartCard title="Intervention Comparison" subtitle="Cost, risk reduction, and operational impact by intervention type">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Intervention</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Risk Reduction</TableHead>
              <TableHead>Operational Impact</TableHead>
              <TableHead>ROI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interventions
              .filter((item) => item.name !== "Hiring Backfill")
              .map((item) => (
                <TableRow key={item.name}>
                  <TableCell>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">${item.cost.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-foreground">-{item.riskReduction} pts</TableCell>
                  <TableCell>
                    <StatusPill
                      tone={item.operationalImpact === "Low" ? "green" : item.operationalImpact === "Medium" ? "orange" : "pink"}
                    >
                      {item.operationalImpact}
                    </StatusPill>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-status-teal">{item.roi}x</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </ChartCard>
    </div>
  );
}
