import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { WorkflowCard } from "@/talvera/components/shared/WorkflowCard";
import { StatusPill } from "@/talvera/components/shared/StatusPill";
import { workflows, type WorkflowStatus } from "@/talvera/data/workflows";
import { workflowStatusTone } from "@/talvera/lib/status";

const statuses: WorkflowStatus[] = ["Pending", "Approved", "Executing", "Completed", "Failed"];

export default function WorkflowCenter() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Workflow Center" subtitle="Track intervention workflows from creation to outcome." />

      <div className="flex flex-wrap gap-2.5">
        {statuses.map((status) => (
          <StatusPill key={status} tone={workflowStatusTone[status]} dot>
            {status} · {workflows.filter((w) => w.status === status).length}
          </StatusPill>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {workflows.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </div>
    </div>
  );
}
