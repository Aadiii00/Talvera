export interface ContagionAmplifier {
  label: string;
  value: string;
  severity: "low" | "medium" | "high";
}

export interface ContagionNode {
  id: string;
  label: string;
  sublabel: string;
  x: number; // % position within graph canvas
  y: number;
  tone: "pink" | "teal" | "orange";
  emphasis?: boolean;
}

export interface ContagionEdge {
  from: string;
  to: string;
}

export interface ContagionProfile {
  employeeId: string;
  name: string;
  department: string;
  role: string;
  currentRisk: number;
  cascadeProbability: number;
  teammatesImpacted: number;
  teammatesTotal: number;
  message: string;
  supportingText: string;
  centerLabel: string;
  centerText: string;
  amplifiers: ContagionAmplifier[];
  nodes: ContagionNode[];
  edges: ContagionEdge[];
}

export const contagionTriggerIds = ["vikram-iyer", "rahul-sharma", "ananya-rao", "priya-nair"];

export const contagionProfiles: Record<string, ContagionProfile> = {
  "vikram-iyer": {
    employeeId: "vikram-iyer",
    name: "Vikram Iyer",
    department: "Finance",
    role: "Lead",
    currentRisk: 42,
    cascadeProbability: 95,
    teammatesImpacted: 14,
    teammatesTotal: 148,
    message: "If Vikram Iyer departs, 14 teammates are at elevated risk.",
    supportingText: "Immediate team stabilization protocol. Reassign critical workload, schedule 1-on-1 career conversations across the team.",
    centerLabel: "Workload & Social Vector",
    centerText: "Departing loads leave critical knowledge vacuums and redistribute ~40% unallocated workload.",
    amplifiers: [
      { label: "Avg Workload Overload Shock", value: "+28% surge", severity: "high" },
      { label: "Morale Depletion Probability", value: "High (72%)", severity: "high" },
      { label: "Knowledge Silo Exposure", value: "4 proprietary repos", severity: "medium" },
    ],
    nodes: [
      { id: "trigger", label: "Vikram Iyer", sublabel: "Risk Auditor · Lead", x: 14, y: 50, tone: "pink" },
      { id: "center", label: "Workload & Social Vector", sublabel: "Cascade core", x: 50, y: 50, tone: "teal", emphasis: true },
      { id: "t1", label: "Audit & Controls", sublabel: "6 teammates", x: 84, y: 18, tone: "orange" },
      { id: "t2", label: "Regulatory Reporting", sublabel: "4 teammates", x: 84, y: 50, tone: "orange" },
      { id: "t3", label: "Controls Automation", sublabel: "3 teammates", x: 84, y: 82, tone: "orange" },
      { id: "t4", label: "Adjacent Finance Teams", sublabel: "1 teammate", x: 50, y: 88, tone: "orange" },
    ],
    edges: [
      { from: "trigger", to: "center" },
      { from: "center", to: "t1" },
      { from: "center", to: "t2" },
      { from: "center", to: "t3" },
      { from: "center", to: "t4" },
    ],
  },
  "rahul-sharma": {
    employeeId: "rahul-sharma",
    name: "Rahul Sharma",
    department: "Engineering",
    role: "Senior Backend Engineer",
    currentRisk: 78,
    cascadeProbability: 88,
    teammatesImpacted: 9,
    teammatesTotal: 132,
    message: "If Rahul Sharma departs, 9 teammates are at elevated risk.",
    supportingText: "Redistribute on-call ownership before knowledge transfer window closes. Prioritize pairing sessions on Core Platform Migration.",
    centerLabel: "Workload & Knowledge Vector",
    centerText: "Sole owner of 3 downstream services; departure forces an unplanned on-call redistribution.",
    amplifiers: [
      { label: "Avg Workload Overload Shock", value: "+34% surge", severity: "high" },
      { label: "Morale Depletion Probability", value: "Medium (58%)", severity: "medium" },
      { label: "Knowledge Silo Exposure", value: "3 downstream services", severity: "high" },
    ],
    nodes: [
      { id: "trigger", label: "Rahul Sharma", sublabel: "Senior Backend Engineer", x: 14, y: 50, tone: "pink" },
      { id: "center", label: "Workload & Knowledge Vector", sublabel: "Cascade core", x: 50, y: 50, tone: "teal", emphasis: true },
      { id: "t1", label: "Platform Team", sublabel: "5 teammates", x: 84, y: 20, tone: "orange" },
      { id: "t2", label: "Core Platform Migration", sublabel: "3 teammates", x: 84, y: 50, tone: "orange" },
      { id: "t3", label: "Downstream Services", sublabel: "1 teammate", x: 84, y: 80, tone: "orange" },
    ],
    edges: [
      { from: "trigger", to: "center" },
      { from: "center", to: "t1" },
      { from: "center", to: "t2" },
      { from: "center", to: "t3" },
    ],
  },
  "ananya-rao": {
    employeeId: "ananya-rao",
    name: "Ananya Rao",
    department: "Sales",
    role: "Enterprise Account Director",
    currentRisk: 61,
    cascadeProbability: 64,
    teammatesImpacted: 5,
    teammatesTotal: 96,
    message: "If Ananya Rao departs, 5 teammates are at elevated risk.",
    supportingText: "Protect named-account relationships with a transition plan before any exit conversation begins.",
    centerLabel: "Relationship Vector",
    centerText: "Named-account relationships are concentrated in one owner; a departure risks 2 renewal cycles.",
    amplifiers: [
      { label: "Avg Workload Overload Shock", value: "+16% surge", severity: "medium" },
      { label: "Morale Depletion Probability", value: "Medium (49%)", severity: "medium" },
      { label: "Knowledge Silo Exposure", value: "2 named accounts", severity: "medium" },
    ],
    nodes: [
      { id: "trigger", label: "Ananya Rao", sublabel: "Enterprise Account Director", x: 14, y: 50, tone: "pink" },
      { id: "center", label: "Relationship Vector", sublabel: "Cascade core", x: 50, y: 50, tone: "teal", emphasis: true },
      { id: "t1", label: "Enterprise Sales Team", sublabel: "3 teammates", x: 84, y: 30, tone: "orange" },
      { id: "t2", label: "Named Accounts", sublabel: "2 teammates", x: 84, y: 70, tone: "orange" },
    ],
    edges: [
      { from: "trigger", to: "center" },
      { from: "center", to: "t1" },
      { from: "center", to: "t2" },
    ],
  },
  "priya-nair": {
    employeeId: "priya-nair",
    name: "Priya Nair",
    department: "Support",
    role: "Customer Support Lead",
    currentRisk: 35,
    cascadeProbability: 22,
    teammatesImpacted: 2,
    teammatesTotal: 58,
    message: "If Priya Nair departs, 2 teammates are at elevated risk.",
    supportingText: "Low cascade exposure. Continue current coaching program; no immediate stabilization action required.",
    centerLabel: "Team Continuity Vector",
    centerText: "Support Tier 2 has healthy backup coverage; exposure is limited to direct reports only.",
    amplifiers: [
      { label: "Avg Workload Overload Shock", value: "+6% surge", severity: "low" },
      { label: "Morale Depletion Probability", value: "Low (24%)", severity: "low" },
      { label: "Knowledge Silo Exposure", value: "0 proprietary systems", severity: "low" },
    ],
    nodes: [
      { id: "trigger", label: "Priya Nair", sublabel: "Customer Support Lead", x: 14, y: 50, tone: "pink" },
      { id: "center", label: "Team Continuity Vector", sublabel: "Cascade core", x: 50, y: 50, tone: "teal", emphasis: true },
      { id: "t1", label: "Support Tier 2", sublabel: "2 teammates", x: 84, y: 50, tone: "orange" },
    ],
    edges: [
      { from: "trigger", to: "center" },
      { from: "center", to: "t1" },
    ],
  },
};
