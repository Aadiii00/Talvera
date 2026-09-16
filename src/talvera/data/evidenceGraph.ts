export interface EvidenceGraphNode {
  id: string;
  layer: string;
  label: string;
  detail: string;
}

export const evidenceGraphChain: EvidenceGraphNode[] = [
  { id: "employee", layer: "Employee", label: "Rahul Sharma", detail: "Senior Backend Engineer · Engineering / Platform · 4.2 years tenure" },
  { id: "risk", layer: "Risk", label: "78% Attrition Risk", detail: "Deteriorating trajectory over the last 45 days, confidence High (88%)" },
  { id: "evidence", layer: "Evidence", label: "Workload Overload", detail: "On-call load 2.3x team average for 6 consecutive weeks" },
  { id: "skill", layer: "Skill", label: "Kubernetes", detail: "Critical scarcity skill, only 11 employees org-wide, single point of failure" },
  { id: "project", layer: "Project", label: "Core Platform Migration", detail: "3 downstream services depend on Rahul's ownership" },
  { id: "policy", layer: "Policy", label: "Workload & On-Call Fairness Policy §2.1", detail: "Rotation exceeding 1.5x average requires escalation" },
  { id: "decision", layer: "Decision", label: "ACT — Redistribute Workload", detail: "Decision Guard passed with High confidence, Fairness under review" },
  { id: "intervention", layer: "Intervention", label: "Workload Reduction Workflow", detail: "Dispatched to Workflow Center, currently Executing" },
];
