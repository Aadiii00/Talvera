export interface CapabilityGap {
  title: string;
  description: string;
  priority: "Critical" | "High" | "Medium";
  affectedStaff: number;
  status: "Open" | "In Progress" | "Monitoring";
}

export const capabilityGaps: CapabilityGap[] = [
  { title: "Predictive Forecasting", description: "Advanced statistical forecasting for headcount and demand planning", priority: "Critical", affectedStaff: 34, status: "Open" },
  { title: "Technical Root Cause Analysis", description: "Systematic diagnosis of production incidents across distributed systems", priority: "Critical", affectedStaff: 28, status: "In Progress" },
  { title: "Retention Modeling", description: "Statistical modeling of attrition drivers at the cohort level", priority: "High", affectedStaff: 19, status: "In Progress" },
  { title: "Risk Assessment", description: "Structured evaluation of organizational and operational risk exposure", priority: "High", affectedStaff: 41, status: "Monitoring" },
  { title: "People Analytics", description: "Translating workforce data into actionable people decisions", priority: "Medium", affectedStaff: 52, status: "Open" },
  { title: "API Debugging", description: "Diagnosing integration failures across internal and partner APIs", priority: "High", affectedStaff: 23, status: "In Progress" },
  { title: "SLA Management", description: "Tracking and enforcing service-level commitments across support tiers", priority: "Medium", affectedStaff: 30, status: "Monitoring" },
  { title: "HubSpot Automation", description: "Building automated lifecycle workflows for sales and marketing ops", priority: "Medium", affectedStaff: 15, status: "Open" },
];

export interface LearningPathway {
  skill: string;
  duration: string;
  employeesScheduled: number;
  completion: number;
  status: "On Track" | "At Risk" | "Completed";
}

export const learningPathways: LearningPathway[] = [
  { skill: "Kubernetes Certification Pathway", duration: "8 weeks", employeesScheduled: 24, completion: 62, status: "On Track" },
  { skill: "AI/ML Foundations Pathway", duration: "12 weeks", employeesScheduled: 18, completion: 34, status: "At Risk" },
  { skill: "Cloud Security Practitioner Pathway", duration: "6 weeks", employeesScheduled: 15, completion: 81, status: "On Track" },
];
