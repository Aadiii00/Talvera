export interface AskTalveraResponse {
  question: string;
  answer: string;
  evidence: string;
  simulation: string;
  recommendation: string;
  decisionStatus: string;
}

export const suggestedQuestions: AskTalveraResponse[] = [
  {
    question: "Why is Engineering risk increasing?",
    answer: "Engineering risk rose 12% this month, driven primarily by sustained on-call overload on the Platform team and a compensation gap for senior individual contributors.",
    evidence: "6 employees show workload evidence strength above 70%; 3 show a compensation gap above 8% of band midpoint.",
    simulation: "Redistributing on-call load org-wide simulates a 24-point risk reduction within 45 days.",
    recommendation: "Dispatch Workload Reduction workflow for the Platform team before the next sprint cycle.",
    decisionStatus: "ACT — passed Decision Guard, awaiting manager confirmation",
  },
  {
    question: "What happens if Vikram leaves?",
    answer: "Vikram Iyer's departure carries a 95% cascade probability, putting 14 teammates in Finance at elevated risk due to workload redistribution and knowledge silo exposure.",
    evidence: "Vikram is the sole owner of 4 proprietary controls repositories with no documented backup.",
    simulation: "Cross-training 2 backup owners reduces cascade probability from 95% to 61%.",
    recommendation: "Dispatch Team Stabilization Protocol immediately.",
    decisionStatus: "ACT — Critical cascade risk, Decision Guard passed",
  },
  {
    question: "Which skills create the highest organizational exposure?",
    answer: "AI/ML, Cloud Security, and Kubernetes are the highest-exposure skills — each has fewer than 12 qualified employees org-wide and at least one single point of failure.",
    evidence: "AI/ML coverage is 29% of required roles, the lowest of any tracked skill.",
    simulation: "Sponsored learning pathways for 15 employees close 60% of the AI/ML gap within 6 months.",
    recommendation: "Prioritize the AI/ML and Cloud Security learning pathways in this quarter's training budget.",
    decisionStatus: "REVIEW — pending Skill Intelligence budget approval",
  },
  {
    question: "What intervention gives the best retention ROI?",
    answer: "Workload Reduction delivers the highest retention ROI at 6.2x, ahead of Manager Intervention (5.1x) and Training (5.6x).",
    evidence: "203 employees are currently flagged at-risk; Workload Reduction addresses 73 of them at low operational cost.",
    simulation: "Combining Workload Reduction with Training compounds risk reduction to 32 points over 90 days.",
    recommendation: "Fund Workload Reduction and Training together for Engineering and Support this quarter.",
    decisionStatus: "ACT — approved in Retention ROI review",
  },
  {
    question: "What changed this month?",
    answer: "Engineering risk increased 12%, 2 new employees entered the Critical zone, and Kubernetes scarcity worsened after 1 certified engineer transferred teams.",
    evidence: "Risk Radar shows 8 more employees in the Protect/Critical zones compared to last month.",
    simulation: "No action simulates risk continuing to rise 6-9 points over the next 30 days.",
    recommendation: "Review the Engineering workload and Kubernetes backfill plan this week.",
    decisionStatus: "REVIEW — flagged for People leadership sync",
  },
];
