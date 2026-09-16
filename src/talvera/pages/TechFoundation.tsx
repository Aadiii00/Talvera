import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { StatusPill } from "@/talvera/components/shared/StatusPill";
import { modelVersions, systemIntegrations } from "@/talvera/data/techFoundation";

const integrationTone = { Connected: "green", Degraded: "pink", Syncing: "orange" } as const;
const modelTone = { Stable: "green", Updating: "orange" } as const;

export default function TechFoundation() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader
        title="Tech Foundation"
        subtitle="Systems, data sources, and model versions powering workforce intelligence."
      />

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">System Integrations</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {systemIntegrations.map((system) => (
            <Card key={system.name}>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{system.name}</p>
                  <StatusPill tone={integrationTone[system.status]} dot>
                    {system.status}
                  </StatusPill>
                </div>
                <p className="text-xs text-muted-foreground">{system.category}</p>
                <p className="text-[11px] text-muted-foreground">Last synced {system.lastSync}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Model Versions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {modelVersions.map((model) => (
            <Card key={model.name}>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{model.name}</p>
                  <StatusPill tone={modelTone[model.status]} dot>
                    {model.status}
                  </StatusPill>
                </div>
                <p className="text-xs text-muted-foreground">{model.version}</p>
                <p className="text-[11px] text-muted-foreground">Updated {model.updated}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
