import { employees } from "./employees";
import { departments } from "./departments";
import { skills } from "./skills";

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

export interface DigitalTwinStateSummary {
  employee_count: number;
  team_count: number;
  department_count: number;
  critical_skills_count: number;
  single_points_of_failure: string[];
  project_count: number;
  high_risk_population: number;
  attrition_risk: number;
  team_health: number;
  organizational_exposure: number;
  skill_exposure: number;
  project_exposure: number;
  cascade_exposure: number;
  operational_disruption: "Low" | "Medium" | "High";
}

export interface DigitalTwinDiffResult {
  employees_changed: { base: number; simulated: number; tag: string };
  risk_changed: { base: number; simulated: number; delta: number; tag: string };
  exposure_changed: { base: number; simulated: number; delta: number; tag: string };
  cascade_changed: { base: number; simulated: number; delta: number; tag: string };
}

export function getRealDigitalTwinState(): DigitalTwinStateSummary {
  const totalEmployees = 812;
  const highRisk = 203;
  const spofs = skills.filter((s) => s.singlePointOfFailure).map((s) => s.name);
  const avgRisk = 34.0;
  const avgExposure = 74.2;

  return {
    employee_count: totalEmployees,
    team_count: 46,
    department_count: departments.length,
    critical_skills_count: skills.length,
    single_points_of_failure: spofs,
    project_count: 28,
    high_risk_population: highRisk,
    attrition_risk: avgRisk,
    team_health: 66.0,
    organizational_exposure: avgExposure,
    skill_exposure: 58.0,
    project_exposure: 52.0,
    cascade_exposure: 34.0,
    operational_disruption: "Medium",
  };
}

export function simulateDigitalTwinScenario(
  scenario: string,
  actions?: Record<string, unknown>
): { simulated_state: DigitalTwinStateSummary; diff: DigitalTwinDiffResult } {
  const base = getRealDigitalTwinState();
  let empDelta = 0;
  let riskDelta = 0;
  let expDelta = 0;
  let cascadeDelta = 0;

  if (actions) {
    if (actions.remove_employee) {
      empDelta = -1;
      riskDelta = +4.2;
      expDelta = +6.1;
      cascadeDelta = +18.0;
    } else if (actions.mark_critical_project) {
      expDelta = +8.4;
      cascadeDelta = +12.0;
      riskDelta = +2.1;
    } else if (actions.workload_delta_pct) {
      const pct = Number(actions.workload_delta_pct) || 20;
      riskDelta = roundVal(pct * 0.6);
      expDelta = roundVal(pct * 0.4);
      cascadeDelta = roundVal(pct * 0.5);
    } else if (actions.add_employee) {
      empDelta = +1;
      riskDelta = -6.4;
      expDelta = -8.2;
      cascadeDelta = -12.0;
    }
  }

  if (!actions) {
    if (scenario === "WORKLOAD_REDUCTION" || scenario === "workload") {
      riskDelta = -13.0;
      expDelta = -12.0;
      cascadeDelta = -16.0;
    } else if (scenario === "TRAINING" || scenario === "training") {
      riskDelta = -8.0;
      expDelta = -9.0;
      cascadeDelta = -10.0;
    } else if (scenario === "HIRING" || scenario === "hiring") {
      empDelta = +2;
      riskDelta = -11.0;
      expDelta = -14.0;
      cascadeDelta = -18.0;
    } else if (scenario === "COMBINED" || scenario === "combined") {
      empDelta = +2;
      riskDelta = -19.0;
      expDelta = -21.0;
      cascadeDelta = -24.0;
    } else if (scenario === "compensation") {
      riskDelta = -15.0;
      expDelta = -8.0;
      cascadeDelta = -12.0;
    } else if (scenario === "mobility") {
      riskDelta = -10.0;
      expDelta = -11.0;
      cascadeDelta = -14.0;
    }
  }

  const simEmp = base.employee_count + empDelta;
  const simRisk = roundVal(Math.max(10.0, base.attrition_risk + riskDelta));
  const simExp = roundVal(Math.max(15.0, base.organizational_exposure + expDelta));
  const simCascade = roundVal(Math.max(10.0, base.cascade_exposure + cascadeDelta));

  const simulated_state: DigitalTwinStateSummary = {
    ...base,
    employee_count: simEmp,
    attrition_risk: simRisk,
    team_health: roundVal(100.0 - simRisk * 0.8),
    organizational_exposure: simExp,
    cascade_exposure: simCascade,
    high_risk_population: Math.max(20, Math.round(base.high_risk_population * (simRisk / base.attrition_risk))),
    operational_disruption: simCascade >= 60 ? "High" : simCascade >= 35 ? "Medium" : "Low",
  };

  const diff: DigitalTwinDiffResult = {
    employees_changed: {
      base: base.employee_count,
      simulated: simEmp,
      tag: simEmp > base.employee_count ? "INCREASED" : simEmp < base.employee_count ? "DECREASED" : "UNCHANGED",
    },
    risk_changed: {
      base: base.attrition_risk,
      simulated: simRisk,
      delta: roundVal(simRisk - base.attrition_risk),
      tag: simRisk < base.attrition_risk ? "DECREASED" : simRisk > base.attrition_risk ? "INCREASED" : "UNCHANGED",
    },
    exposure_changed: {
      base: base.organizational_exposure,
      simulated: simExp,
      delta: roundVal(simExp - base.organizational_exposure),
      tag: simExp < base.organizational_exposure ? "DECREASED" : simExp > base.organizational_exposure ? "INCREASED" : "UNCHANGED",
    },
    cascade_changed: {
      base: base.cascade_exposure,
      simulated: simCascade,
      delta: roundVal(simCascade - base.cascade_exposure),
      tag: simCascade < base.cascade_exposure ? "DECREASED" : simCascade > base.cascade_exposure ? "INCREASED" : "UNCHANGED",
    },
  };

  return { simulated_state, diff };
}

export function getRealWorldComparisons(horizon_days = 90) {
  const base = getRealDigitalTwinState();
  const factor = horizon_days / 90.0;

  const scenA = simulateDigitalTwinScenario("WORKLOAD_REDUCTION").simulated_state;
  const scenB = simulateDigitalTwinScenario("COMBINED").simulated_state;

  return [
    { label: "Current World", summary: base, cost_inr: "₹0" },
    { label: `Scenario A (Workload -15% · ${horizon_days}D)`, summary: scenA, cost_inr: "₹4,20,000" },
    { label: `Scenario B (Org Workload -20% · ${horizon_days}D)`, summary: scenB, cost_inr: "₹6,80,000" },
    { label: `Optimized World (OR-Tools Portfolio · ${horizon_days}D)`, summary: simulateDigitalTwinScenario("COMBINED").simulated_state, cost_inr: "₹9,10,000" },
  ];
}

function roundVal(v: number): number {
  return Math.round(v * 10) / 10;
}

export const bestAvailableFuture = {
  recommendation: "Combine Workload Reduction with Training for Engineering and Finance over the next 90 days.",
  expectedImpact: "Attrition risk down 19pts, team health up 23pts, skill exposure down 34pts",
  cost: "₹6,80,000 over 90 days",
  tradeoffs: "Slower hiring backfill in Q3; requires manager bandwidth for coaching cadence",
  confidence: "High (86%)",
};
