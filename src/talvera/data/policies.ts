export interface PolicyCategory {
  name: string;
  count: number;
}

export interface PolicyDocument {
  id: string;
  title: string;
  category: string;
  snippet: string;
  source: string;
  updated: string;
}

export const policyCategories: PolicyCategory[] = [
  { name: "Compensation", count: 12 },
  { name: "Leave", count: 8 },
  { name: "Mobility", count: 6 },
  { name: "Training", count: 9 },
  { name: "Performance", count: 11 },
  { name: "Manager Policy", count: 7 },
  { name: "Workforce Governance", count: 5 },
];

export const policyDocuments: PolicyDocument[] = [
  {
    id: "pol-1",
    title: "Compensation Band Adjustment Guidelines",
    category: "Compensation",
    snippet: "Managers may request a mid-cycle band adjustment when an employee's total compensation falls more than 8% below the internal market midpoint for their level...",
    source: "Compensation Policy Handbook — Section 4.2",
    updated: "Updated 3 weeks ago",
  },
  {
    id: "pol-2",
    title: "Workload & On-Call Rotation Fairness Policy",
    category: "Performance",
    snippet: "On-call rotations should not exceed 1.5x the team average over any rolling 6-week period without manager escalation and workload rebalancing...",
    source: "Workforce Governance Handbook — Section 2.1",
    updated: "Updated 1 month ago",
  },
  {
    id: "pol-3",
    title: "Internal Mobility & Lateral Transfer Process",
    category: "Mobility",
    snippet: "Employees with 12+ months tenure are eligible to apply for lateral transfers. Managers cannot block a transfer once a candidate has passed the hiring panel...",
    source: "Mobility Policy Handbook — Section 1.4",
    updated: "Updated 2 months ago",
  },
  {
    id: "pol-4",
    title: "Sponsored Learning Pathway Eligibility",
    category: "Training",
    snippet: "Roles flagged with a critical skill gap by Skill Intelligence are automatically eligible for 100% sponsored learning pathways up to $4,000 annually...",
    source: "Training & Development Policy — Section 3.3",
    updated: "Updated 2 weeks ago",
  },
  {
    id: "pol-5",
    title: "Manager Intervention Escalation Protocol",
    category: "Manager Policy",
    snippet: "When 3 or more direct reports show a deteriorating trajectory within 60 days, the manager's skip-level is automatically notified for a coaching review...",
    source: "Manager Policy Handbook — Section 5.0",
    updated: "Updated 5 days ago",
  },
];
