import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { suggestedQuestions, type AskTalveraResponse } from "@/talvera/data/askTalvera";

interface AIDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fallbackResponse: AskTalveraResponse = {
  question: "",
  answer: "Talvera couldn't find enough corroborating evidence to answer that directly yet. Try one of the suggested questions below, or rephrase with an employee, team, or skill name.",
  evidence: "No evidence sources matched this query.",
  simulation: "No simulation available for this query.",
  recommendation: "Refine your question or select a suggested prompt.",
  decisionStatus: "N/A",
};

export function AIDrawer({ open, onOpenChange }: AIDrawerProps) {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<AskTalveraResponse | null>(null);

  const handleAsk = (question: string) => {
    const match = suggestedQuestions.find((item) => item.question.toLowerCase() === question.toLowerCase());
    setSelected(match ?? fallbackResponse);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    handleAsk(input.trim());
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setSelected(null);
          setInput("");
        }
      }}
    >
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-status-teal" />
            Ask Talvera
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!selected ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Suggested questions
              </p>
              <div className="flex flex-col gap-2">
                {suggestedQuestions.map((item) => (
                  <button
                    key={item.question}
                    onClick={() => handleAsk(item.question)}
                    className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-left text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
                  >
                    {item.question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setSelected(null)}
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                ← Back to suggestions
              </button>
              {selected.question && (
                <p className="text-sm font-semibold text-foreground">{selected.question}</p>
              )}
              <ResponseBlock label="Answer" tone="teal" content={selected.answer} />
              <ResponseBlock label="Evidence" tone="blue" content={selected.evidence} />
              <ResponseBlock label="Simulation" tone="purple" content={selected.simulation} />
              <ResponseBlock label="Recommendation" tone="orange" content={selected.recommendation} />
              <ResponseBlock label="Decision Status" tone="green" content={selected.decisionStatus} />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border px-4 py-3">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask Talvera anything about your workforce..."
            className="h-10 rounded-full border-border bg-secondary/60"
          />
          <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function ResponseBlock({
  label,
  content,
  tone,
}: {
  label: string;
  content: string;
  tone: "teal" | "blue" | "purple" | "orange" | "green";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3.5">
      <p className={`text-[11px] font-bold uppercase tracking-wide text-status-${tone}`}>{label}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-foreground">{content}</p>
    </div>
  );
}
