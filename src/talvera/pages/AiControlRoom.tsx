import { Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { StatusPill } from "@/talvera/components/shared/StatusPill";
import { currentTask, toolActivities } from "@/talvera/data/aiControlRoom";

const statusTone = { Active: "teal", Complete: "green", Idle: "blue" } as const;

export default function AiControlRoom() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="AI Control Room" subtitle="Live status of the Talvera workforce intelligence agent." />

      <Card className="border-primary/10 bg-primary text-primary-foreground">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Qwen Workforce Agent</p>
              <p className="text-xs text-primary-foreground/70">Current task: {currentTask}</p>
            </div>
          </div>
          <StatusPill tone="green" dot className="bg-white/10 text-white">
            Online
          </StatusPill>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Tool Activity</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {toolActivities.map((tool) => (
            <Card key={tool.name}>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{tool.name}</p>
                  <StatusPill tone={statusTone[tool.status]} dot>
                    {tool.status}
                  </StatusPill>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{tool.output}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
