import { useState } from "react";
import { AlertOctagon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { NetworkGraph } from "@/talvera/components/shared/NetworkGraph";
import { contagionProfiles, contagionTriggerIds } from "@/talvera/data/contagion";
import { getEmployeeById } from "@/talvera/data/employees";

export default function ContagionRadar() {
  const [triggerId, setTriggerId] = useState("vikram-iyer");
  const profile = contagionProfiles[triggerId];

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Organizational Network Dynamics
          </span>
          <p className="text-xs font-medium text-status-teal">Cascade Risk Model 2.0</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Team Contagion &amp; Cascade Analysis</h1>
          <p className="text-sm text-muted-foreground">
            Predict secondary workforce attrition if a key team member exits.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Trigger Employee
          </span>
          <Select value={triggerId} onValueChange={setTriggerId}>
            <SelectTrigger className="h-9 w-[180px] rounded-full bg-card text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {contagionTriggerIds.map((id) => (
                <SelectItem key={id} value={id}>
                  {getEmployeeById(id)?.name.split(" ")[0]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-gradient-critical text-white">
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1.6fr_1fr] lg:p-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-status-pink">
              <AlertOctagon className="h-3.5 w-3.5" />
              Critical Cascade Risk
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{profile.department}</p>
            <h2 className="max-w-xl text-2xl font-bold leading-snug">{profile.message}</h2>
            <p className="max-w-lg text-sm leading-relaxed text-white/70">{profile.supportingText}</p>
            <Button className="mt-2 rounded-full bg-white text-primary hover:bg-white/90">
              <Send className="h-4 w-4" />
              Dispatch Team Stabilization Protocol
            </Button>
            <p className="text-[11px] text-white/50">
              Decision Guard: Automatic cross-department contagion propagation analysis active
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 rounded-2xl bg-white/5 p-5">
            <div>
              <p className="text-4xl font-extrabold">{profile.cascadeProbability}%</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/60">Cascade Probability</p>
            </div>
            <div className="h-px bg-white/10" />
            <div>
              <p className="text-3xl font-extrabold">
                {profile.teammatesImpacted} <span className="text-lg text-white/50">/ {profile.teammatesTotal}</span>
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/60">Teammates Impacted</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <ChartCard
          title="Cascade Propagation Network"
          subtitle="Visual mapping of exit trigger and secondary attrition vectors."
        >
          <NetworkGraph nodes={profile.nodes} edges={profile.edges} height={340} />
          <p className="mt-2 rounded-xl bg-secondary/60 p-3 text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">{profile.centerLabel}: </span>
            {profile.centerText}
          </p>
        </ChartCard>

        <ChartCard title="Cascade Amplifiers" subtitle="Factors accelerating secondary attrition">
          <div className="space-y-3">
            {profile.amplifiers.map((amplifier) => (
              <div key={amplifier.label} className="rounded-xl border border-border p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {amplifier.label}
                </p>
                <p
                  className={`mt-1 text-sm font-bold ${
                    amplifier.severity === "high"
                      ? "text-status-pink"
                      : amplifier.severity === "medium"
                        ? "text-status-orange"
                        : "text-status-green"
                  }`}
                >
                  {amplifier.value}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
