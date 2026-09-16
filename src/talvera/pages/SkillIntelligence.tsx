import { GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { StatusPill } from "@/talvera/components/shared/StatusPill";
import { capabilityGaps, learningPathways } from "@/talvera/data/skillIntelligence";

const priorityTone = { Critical: "pink", High: "orange", Medium: "blue" } as const;
const statusTone = { Open: "pink", "In Progress": "blue", Monitoring: "orange" } as const;
const pathwayTone = { "On Track": "green", "At Risk": "pink", Completed: "blue" } as const;

export default function SkillIntelligence() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader
        title="Skill Intelligence & Gap Matrix"
        subtitle="Where capability is falling behind future workforce requirements."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {capabilityGaps.map((gap) => (
          <Card key={gap.title}>
            <CardContent className="flex h-full flex-col gap-3 p-4">
              <div className="flex items-center justify-between">
                <StatusPill tone={priorityTone[gap.priority]}>{gap.priority}</StatusPill>
                <StatusPill tone={statusTone[gap.status]}>{gap.status}</StatusPill>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{gap.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{gap.description}</p>
              </div>
              <p className="mt-auto text-[11px] font-medium text-muted-foreground">
                Affected Staff: <span className="font-semibold text-foreground">{gap.affectedStaff}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-status-teal" />
          <h2 className="text-sm font-semibold text-foreground">100% Sponsored Retention Learning Pathways</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {learningPathways.map((pathway) => (
            <Card key={pathway.skill}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{pathway.skill}</h3>
                  <StatusPill tone={pathwayTone[pathway.status]}>{pathway.status}</StatusPill>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{pathway.duration}</span>
                  <span>{pathway.employeesScheduled} employees scheduled</span>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Completion</span>
                    <span>{pathway.completion}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted">
                    <div className="h-1.5 rounded-full bg-status-teal" style={{ width: `${pathway.completion}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
