import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { FlowChain } from "@/talvera/components/shared/FlowChain";
import { memoryEntries } from "@/talvera/data/memory";

const timelineStages = ["Prediction", "Recommendation", "Approval", "Execution", "Outcome"];

export default function Memory() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Organizational Memory" subtitle="Every prediction, decision, and outcome — kept in one place." />

      <ChartCard title="Decision Lifecycle" subtitle="How a recommendation moves from prediction to outcome">
        <FlowChain items={timelineStages.map((label) => ({ id: label, label }))} />
      </ChartCard>

      <ChartCard title="Expected vs. Actual" subtitle="Comparing predicted impact against measured outcomes">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Employee</TableHead>
              <TableHead>Prediction</TableHead>
              <TableHead>Recommendation</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead>Actual</TableHead>
              <TableHead>Variance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memoryEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <p className="text-sm font-medium text-foreground">{entry.employee}</p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </TableCell>
                <TableCell className="max-w-[220px] text-xs text-muted-foreground">{entry.prediction}</TableCell>
                <TableCell className="max-w-[200px] text-xs text-muted-foreground">{entry.recommendation}</TableCell>
                <TableCell className="max-w-[220px] text-xs text-muted-foreground">{entry.outcome}</TableCell>
                <TableCell className="text-sm text-foreground">{entry.expected} pts</TableCell>
                <TableCell className="text-sm text-foreground">{entry.actual} pts</TableCell>
                <TableCell className={`text-sm font-semibold ${entry.variance >= 0 ? "text-status-green" : "text-status-pink"}`}>
                  {entry.variance >= 0 ? "+" : ""}{entry.variance} pts
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCard>
    </div>
  );
}
