import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { policyCategories, policyDocuments } from "@/talvera/data/policies";

export default function PolicyIntelligence() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState(policyDocuments[0].id);

  const filtered = policyDocuments.filter((doc) => {
    if (category && doc.category !== category) return false;
    if (query && !doc.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const selected = policyDocuments.find((doc) => doc.id === selectedId) ?? filtered[0];

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Policy Intelligence" subtitle="Ask about workforce policy and see the source behind every answer." />

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask about workforce policy..."
          className="h-12 rounded-full bg-card pl-11 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {policyCategories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setCategory(category === cat.name ? null : cat.name)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              category === cat.name
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/30"
            )}
          >
            {cat.name} · {cat.count}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
        <ChartCard title="Results" subtitle={`${filtered.length} matching documents`}>
          <div className="flex flex-col gap-2">
            {filtered.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedId(doc.id)}
                className={cn(
                  "rounded-xl border px-3.5 py-3 text-left transition-colors",
                  selectedId === doc.id
                    ? "border-primary/50 bg-accent"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <p className="text-sm font-semibold text-foreground">{doc.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{doc.category} · {doc.updated}</p>
              </button>
            ))}
          </div>
        </ChartCard>

        <ChartCard title={selected?.title ?? "Select a document"} subtitle={selected?.source}>
          {selected && <p className="text-sm leading-relaxed text-muted-foreground">{selected.snippet}</p>}
        </ChartCard>
      </div>
    </div>
  );
}
