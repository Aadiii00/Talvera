export type ScenarioKey = "doNothing" | "training" | "workload" | "mobility" | "compensation" | "hiring" | "combined";

export interface ScenarioOption {
  key: ScenarioKey;
  label: string;
}

export const scenarioOptions: ScenarioOption[] = [
  { key: "doNothing", label: "Do Nothing" },
  { key: "training", label: "Training" },
  { key: "workload", label: "Workload Reduction" },
  { key: "mobility", label: "Internal Mobility" },
  { key: "compensation", label: "Compensation" },
  { key: "hiring", label: "Hiring" },
  { key: "combined", label: "Combined" },
];

export const timeHorizons = ["30D", "60D", "90D"] as const;

export interface WorldMetrics {
  label: string;
  attritionRisk: number;
  teamHealth: number;
  skillExposure: number;
  projectExposure: number;
  cost: number; // $K
  operationalDisruption: "Low" | "Medium" | "High";
}

export const worldComparison: WorldMetrics[] = [
  { label: "Current World", attritionRisk: 34, teamHealth: 61, skillExposure: 58, projectExposure: 52, cost: 0, operationalDisruption: "Medium" },
  { label: "Scenario A", attritionRisk: 26, teamHealth: 70, skillExposure: 46, projectExposure: 41, cost: 420, operationalDisruption: "Medium" },
  { label: "Scenario B", attritionRisk: 21, teamHealth: 75, skillExposure: 38, projectExposure: 34, cost: 680, operationalDisruption: "Low" },
  { label: "Optimized World", attritionRisk: 15, teamHealth: 84, skillExposure: 24, projectExposure: 22, cost: 910, operationalDisruption: "Low" },
];

export const digitalTwinTopMetrics = {
  employees: 812,
  teams: 46,
  criticalSkills: 7,
  projects: 28,
  highRisk: 203,
  cascadeExposure: 34,
};

export const bestAvailableFuture = {
  recommendation: "Combine Workload Reduction with Training for Engineering and Finance over the next 90 days.",
  expectedImpact: "Attrition risk down 19pts, team health up 23pts, skill exposure down 34pts",
  cost: "$680K over 90 days",
  tradeoffs: "Slower hiring backfill in Q3; requires manager bandwidth for coaching cadence",
  confidence: "High (86%)",
};
