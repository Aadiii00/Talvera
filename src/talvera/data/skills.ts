export interface Skill {
  name: string;
  category: string;
  coverage: number; // % of required roles covered
  scarcity: "Low" | "Medium" | "High" | "Critical";
  criticalLevel: number; // 0-100
  employeesWithSkill: number;
  singlePointOfFailure: boolean;
  teams: string[];
  projects: string[];
}

export const skills: Skill[] = [
  { name: "Kubernetes", category: "Infrastructure", coverage: 42, scarcity: "Critical", criticalLevel: 92, employeesWithSkill: 11, singlePointOfFailure: true, teams: ["Platform"], projects: ["Core Platform Migration"] },
  { name: "Python", category: "Engineering", coverage: 78, scarcity: "Low", criticalLevel: 48, employeesWithSkill: 96, singlePointOfFailure: false, teams: ["Platform", "Data"], projects: ["Core Platform Migration", "People Analytics Rollout"] },
  { name: "Cloud Security", category: "Security", coverage: 35, scarcity: "Critical", criticalLevel: 88, employeesWithSkill: 8, singlePointOfFailure: true, teams: ["Platform", "Audit & Controls"], projects: ["Controls Automation"] },
  { name: "Java", category: "Engineering", coverage: 64, scarcity: "Medium", criticalLevel: 55, employeesWithSkill: 58, singlePointOfFailure: false, teams: ["Platform"], projects: ["Payments Gateway 2.0"] },
  { name: "React", category: "Engineering", coverage: 71, scarcity: "Low", criticalLevel: 40, employeesWithSkill: 63, singlePointOfFailure: false, teams: ["Platform"], projects: ["Sales Intelligence Suite"] },
  { name: "AI / ML", category: "Data", coverage: 29, scarcity: "Critical", criticalLevel: 95, employeesWithSkill: 6, singlePointOfFailure: true, teams: ["Data"], projects: ["People Analytics Rollout"] },
  { name: "DevOps", category: "Infrastructure", coverage: 51, scarcity: "High", criticalLevel: 76, employeesWithSkill: 17, singlePointOfFailure: false, teams: ["Platform"], projects: ["Core Platform Migration"] },
];

export const projects = [
  "Core Platform Migration",
  "Customer Data Vault",
  "Payments Gateway 2.0",
  "Sales Intelligence Suite",
  "Controls Automation",
  "People Analytics Rollout",
];

export const teams = [
  "Engineering / Platform",
  "Sales / Enterprise",
  "Support / Tier 2",
  "Finance / Audit & Controls",
  "HR / People",
  "Operations / Central",
];
