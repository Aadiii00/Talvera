export interface Intervention {
  name: string;
  description: string;
  cost: number; // $ per affected employee, annualized
  riskReduction: number; // percentage points
  operationalImpact: "Low" | "Medium" | "High";
  affectedEmployees: number;
  roi: number; // multiple, e.g. 3.4 = 3.4x
  skillImpact: number; // 0-100
}

export const interventions: Intervention[] = [
  { name: "Compensation Adjustment", description: "Bring pay to band midpoint for at-risk roles", cost: 8600, riskReduction: 22, operationalImpact: "Low", affectedEmployees: 46, roi: 4.1, skillImpact: 10 },
  { name: "Training & Upskilling", description: "Sponsored learning pathways for critical skill gaps", cost: 2200, riskReduction: 14, operationalImpact: "Medium", affectedEmployees: 118, roi: 5.6, skillImpact: 62 },
  { name: "Workload Reduction", description: "Redistribute on-call and delivery load across teams", cost: 1400, riskReduction: 18, operationalImpact: "Medium", affectedEmployees: 73, roi: 6.2, skillImpact: 8 },
  { name: "Internal Mobility", description: "Lateral moves into higher-growth roles", cost: 3100, riskReduction: 16, operationalImpact: "Medium", affectedEmployees: 34, roi: 3.8, skillImpact: 28 },
  { name: "Manager Intervention", description: "Coaching and 1:1 cadence reset for flagged managers", cost: 900, riskReduction: 11, operationalImpact: "Low", affectedEmployees: 61, roi: 5.1, skillImpact: 4 },
  { name: "Hiring Backfill", description: "Proactive hiring to relieve single points of failure", cost: 21500, riskReduction: 9, operationalImpact: "High", affectedEmployees: 12, roi: 1.9, skillImpact: 40 },
];

export const retentionRoiSummary = {
  employeesAtRisk: 203,
  replacementCost: 9.8, // $M
  interventionCost: 1.6, // $M
  potentialLossAvoided: 6.4, // $M
  retentionRoi: 4.0, // multiple
};
