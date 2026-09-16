import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "./StatusPill";
import { Timeline } from "./Timeline";
import type { Workflow } from "@/talvera/data/workflows";
import { workflowStatusTone } from "@/talvera/lib/status";

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{workflow.title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {workflow.employee} · {workflow.description}
            </p>
          </div>
          <StatusPill tone={workflowStatusTone[workflow.status]} dot>
            {workflow.status}
          </StatusPill>
        </div>
        <Timeline steps={workflow.steps} />
        <Badge variant="secondary" className="rounded-full text-[10px] font-semibold">
          EnterPro
        </Badge>
      </CardContent>
    </Card>
  );
}
