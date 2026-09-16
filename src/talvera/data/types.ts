// Shared TALVERA mock-data types. All data in src/talvera/data is deterministic
// and consistent across pages (same employees/departments/skills everywhere).

export type Trajectory = "Improving" | "Stable" | "Deteriorating";
export type Confidence = "High" | "Medium" | "Low";
export type RiskZone = "Monitor" | "Support" | "Protect" | "Critical";
export type DecisionAction = "Act" | "Review" | "Simulate" | "Wait" | "Do Not Act";

export interface Driver {
  label: string;
  value: number; // 0-100 severity/contribution
}

export interface EvidenceItem {
  category: "Performance" | "Engagement" | "Attendance" | "Workload" | "Compensation" | "Skills";
  summary: string;
  strength: number; // 0-100
}

export interface RiskPoint {
  day: number; // 0-90
  risk: number; // 0-100
}

export interface Employee {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  team: string;
  manager: string;
  tenureYears: number;
  attritionRisk: number;
  trajectory: Trajectory;
  orgExposure: number;
  confidence: Confidence;
  confidencePct: number;
  topFactor: string;
  zone: RiskZone;
  drivers: Driver[];
  riskHistory: RiskPoint[];
  evidence: EvidenceItem[];
  causeMap: string[];
  decision: DecisionAction;
}

export interface Department {
  name: string;
  headcountShare: number; // %
  riskScore: number; // 0-100 avg risk
  employeeCount: number;
}
