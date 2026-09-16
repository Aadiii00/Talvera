export type GuardStatus = "PASS" | "REVIEW" | "BLOCKED";
export type GuardAction = "ACT" | "REVIEW" | "SIMULATE" | "WAIT" | "DO NOT ACT";

export interface GuardStage {
  name: string;
  status: GuardStatus;
  note: string;
}

export const decisionPipeline: GuardStage[] = [
  { name: "Evidence", status: "PASS", note: "6 corroborating evidence sources, high strength" },
  { name: "Data Quality", status: "PASS", note: "No missing fields, last synced 4 hours ago" },
  { name: "Uncertainty", status: "PASS", note: "Confidence 88%, above 75% action threshold" },
  { name: "Policy", status: "PASS", note: "Matches Workload & On-Call Fairness Policy §2.1" },
  { name: "Fairness", status: "REVIEW", note: "Comparable cohort variance slightly elevated" },
  { name: "Simulation", status: "PASS", note: "Simulated risk reduction of 24pts at low cost" },
  { name: "Human Context", status: "REVIEW", note: "Awaiting manager confirmation of on-call swap" },
  { name: "Decision", status: "PASS", note: "Recommended action passed to Human Decision panel" },
];

export const decisionOutcomes: { action: GuardAction; recommended: boolean }[] = [
  { action: "ACT", recommended: true },
  { action: "REVIEW", recommended: false },
  { action: "SIMULATE", recommended: false },
  { action: "WAIT", recommended: false },
  { action: "DO NOT ACT", recommended: false },
];

export const aiRecommendation = {
  action: "ACT" as GuardAction,
  title: "Redistribute on-call load for Rahul Sharma within 5 business days",
  rationale: "Workload evidence strength 91%, simulation shows a 24-point risk reduction at low operational cost with no fairness violation.",
  confidence: "High (88%)",
};
