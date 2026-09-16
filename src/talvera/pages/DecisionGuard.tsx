import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { FlowChain } from "@/talvera/components/shared/FlowChain";
import { StatusPill } from "@/talvera/components/shared/StatusPill";
import { aiRecommendation, decisionOutcomes, decisionPipeline } from "@/talvera/data/decisionGuard";
import { decisionTone, guardStatusTone } from "@/talvera/lib/status";

export default function DecisionGuard() {
  const [humanNote, setHumanNote] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Decision Guard" subtitle="Every recommendation passes an evidence and fairness pipeline." />

      <ChartCard title="Decision Pipeline" subtitle="Evidence → Data Quality → Uncertainty → Policy → Fairness → Simulation → Human Context → Decision">
        <FlowChain
          items={decisionPipeline.map((stage) => ({
            id: stage.name,
            label: stage.name,
            sublabel: stage.note,
            tone: guardStatusTone[stage.status],
            statusLabel: stage.status,
          }))}
        />
      </ChartCard>

      <ChartCard title="Final Output" subtitle="Recommended action once the pipeline resolves">
        <div className="flex flex-wrap gap-2">
          {decisionOutcomes.map((outcome) => (
            <StatusPill
              key={outcome.action}
              tone={decisionTone[outcome.action]}
              dot={outcome.recommended}
              className={outcome.recommended ? "px-4 py-1.5 text-xs" : "opacity-40"}
            >
              {outcome.action}
            </StatusPill>
          ))}
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="AI Recommendation" subtitle={`Confidence: ${aiRecommendation.confidence}`}>
          <div className="space-y-2">
            <StatusPill tone={decisionTone[aiRecommendation.action]} dot>
              {aiRecommendation.action}
            </StatusPill>
            <p className="text-sm font-semibold text-foreground">{aiRecommendation.title}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{aiRecommendation.rationale}</p>
          </div>
        </ChartCard>

        <ChartCard title="Human Decision" subtitle="Final sign-off before execution">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setHumanNote("Approved by Sarah Jenkins")}>
                Approve
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setHumanNote("Sent back for modification")}>
                Modify
              </Button>
              <Button size="sm" variant="outline" onClick={() => setHumanNote("Rejected")}>
                Reject
              </Button>
              <Button size="sm" variant="outline" onClick={() => setHumanNote("Simulation requested")}>
                Request Simulation
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setHumanNote("Additional context added")}>
                Add Context
              </Button>
            </div>
            {humanNote && (
              <Card>
                <CardContent className="p-3 text-xs font-medium text-foreground">{humanNote}</CardContent>
              </Card>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
