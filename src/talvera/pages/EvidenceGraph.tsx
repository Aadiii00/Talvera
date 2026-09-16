import { useState } from "react";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { FlowChain } from "@/talvera/components/shared/FlowChain";
import { evidenceGraphChain } from "@/talvera/data/evidenceGraph";

export default function EvidenceGraph() {
  const [selectedId, setSelectedId] = useState(evidenceGraphChain[0].id);
  const selected = evidenceGraphChain.find((node) => node.id === selectedId)!;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Evidence Graph" subtitle="Trace how evidence connects to an eventual decision." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <ChartCard title="Evidence Chain" subtitle="Select a node to inspect its detail">
          <FlowChain
            orientation="vertical"
            items={evidenceGraphChain.map((node) => ({ id: node.id, label: node.layer, sublabel: node.label }))}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </ChartCard>

        <ChartCard title={selected.layer} subtitle="Node detail">
          <div className="space-y-2">
            <p className="text-base font-semibold text-foreground">{selected.label}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{selected.detail}</p>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
