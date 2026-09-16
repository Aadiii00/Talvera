import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertOctagon, CheckCircle2, Clock, Send, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { NetworkGraph } from "@/talvera/components/shared/NetworkGraph";
import { StatusPill } from "@/talvera/components/shared/StatusPill";
import { contagionProfiles, contagionTriggerIds } from "@/talvera/data/contagion";
import { getEmployeeById } from "@/talvera/data/employees";

const proposedActions = [
  "Reassign critical workload across team members",
  "Identify and assign backup owners for proprietary repos",
  "Schedule 1:1 career conversations with affected teammates",
  "Enable 30-day team stability monitoring",
];

export default function ContagionRadar() {
  const navigate = useNavigate();
  const [triggerId, setTriggerId] = useState("vikram-iyer");
  const [preflightOpen, setPreflightOpen] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState<"IDLE" | "EXECUTING" | "COMPLETED">("IDLE");
  const [workflowId, setWorkflowId] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const profile = contagionProfiles[triggerId];

  // Auto-advance simulated steps during EXECUTING state
  useEffect(() => {
    if (workflowStatus === "EXECUTING") {
      const timer = setInterval(() => {
        setActiveStep((prev) => {
          if (prev < 4) return prev + 1;
          setWorkflowStatus("COMPLETED");
          clearInterval(timer);
          return 4;
        });
      }, 1200);
      return () => clearInterval(timer);
    }
  }, [workflowStatus]);

  const handleApproveAndDispatch = () => {
    setPreflightOpen(false);
    setWorkflowId(`wf-stab-${Math.random().toString(36).substring(2, 8)}`);
    setActiveStep(1);
    setWorkflowStatus("EXECUTING");
  };

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
          <Select
            value={triggerId}
            onValueChange={(val) => {
              setTriggerId(val);
              setWorkflowStatus("IDLE");
              setActiveStep(0);
            }}
          >
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

      {/* Main Alert & Dispatch Banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-critical text-white shadow-xl">
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1.6fr_1fr] lg:p-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-status-pink">
              <AlertOctagon className="h-3.5 w-3.5" />
              Critical Cascade Risk
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{profile.department}</p>
            <h2 className="max-w-xl text-2xl font-bold leading-snug">{profile.message}</h2>
            <p className="max-w-lg text-sm leading-relaxed text-white/70">{profile.supportingText}</p>

            {/* Action State Switcher */}
            {workflowStatus === "IDLE" ? (
              <Button
                onClick={() => setPreflightOpen(true)}
                className="mt-2 rounded-full bg-white text-primary hover:bg-white/90 font-bold"
              >
                <Send className="h-4 w-4" />
                Dispatch Team Stabilization Protocol
              </Button>
            ) : workflowStatus === "EXECUTING" ? (
              <div className="mt-3 space-y-3 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-status-teal">
                    <Clock className="h-4 w-4 animate-spin" />
                    Team Stabilization: Executing
                  </span>
                  <span className="text-[11px] text-white/60">ID: {workflowId}</span>
                </div>
                <ProgressSteps activeStep={activeStep} />
              </div>
            ) : (
              <div className="mt-3 space-y-3 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-status-green">
                    <CheckCircle2 className="h-4 w-4 text-status-green" />
                    Team Stabilization: Completed
                  </span>
                  <span className="text-[11px] text-white/60">ID: {workflowId}</span>
                </div>
                <ProgressSteps activeStep={4} />
                <Button
                  onClick={() => navigate("/talvera/memory")}
                  className="mt-2 rounded-full bg-status-green text-white hover:bg-status-green/90 font-bold text-xs"
                >
                  View Outcome in Organizational Memory
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            <p className="text-[11px] text-white/50">
              Decision Guard: Automatic cross-department contagion propagation analysis active
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 rounded-2xl bg-white/5 p-5 border border-white/10">
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

      {/* Pre-Flight Review Modal */}
      <Dialog open={preflightOpen} onOpenChange={setPreflightOpen}>
        <DialogContent className="max-w-xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <ShieldCheck className="h-5 w-5 text-status-teal" />
              Team Stabilization Protocol
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Pre-flight decision review &amp; Decision Firewall evaluation for {profile.department}.
            </DialogDescription>
          </DialogHeader>

          {/* Live Context */}
          <div className="grid grid-cols-3 gap-2.5 rounded-xl bg-secondary/60 p-3 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Department</p>
              <p className="font-bold text-foreground">{profile.department}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Teammates At Risk</p>
              <p className="font-bold text-status-pink">{profile.teammatesImpacted} teammates</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Cascade Risk</p>
              <p className="font-bold text-foreground">{profile.cascadeProbability}%</p>
            </div>
          </div>

          {/* Proposed Actions */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Proposed Actions</p>
            <div className="space-y-1.5 rounded-xl border border-border bg-card p-3 text-xs">
              {proposedActions.map((action, idx) => (
                <div key={idx} className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-status-teal" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Guard Check */}
          <div className="flex items-center justify-between rounded-xl bg-status-teal-soft p-3 text-xs text-status-teal">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="font-bold">Decision Guard Status: PASS</span>
            </div>
            <StatusPill tone="teal" dot>
              88% Confidence
            </StatusPill>
          </div>

          <DialogFooter className="flex items-center justify-between gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setPreflightOpen(false);
                navigate("/talvera/digital-twin");
              }}
              className="rounded-full text-xs"
            >
              Review Simulation
            </Button>
            <Button onClick={handleApproveAndDispatch} className="rounded-full bg-primary text-primary-foreground font-bold text-xs">
              <Send className="h-3.5 w-3.5" />
              Approve &amp; Dispatch Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProgressSteps({ activeStep }: { activeStep: number }) {
  const steps = [
    "Risk assessment completed",
    "Workload redistribution task created",
    "Manager notification sent",
    "HR follow-up tasks scheduled",
    "30-day stability monitoring active",
  ];

  return (
    <div className="space-y-1.5 text-xs text-white/90">
      {steps.map((label, idx) => {
        const isDone = idx < activeStep;
        const isCurrent = idx === activeStep;
        return (
          <div key={label} className="flex items-center gap-2">
            {isDone ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-status-green" />
            ) : isCurrent ? (
              <Clock className="h-3.5 w-3.5 text-status-teal animate-spin" />
            ) : (
              <span className="h-3.5 w-3.5 rounded-full border border-white/30" />
            )}
            <span className={isDone ? "opacity-90 font-medium" : isCurrent ? "font-bold text-white" : "opacity-50"}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
