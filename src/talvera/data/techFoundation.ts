export interface SystemIntegration {
  name: string;
  category: string;
  status: "Connected" | "Degraded" | "Syncing";
  lastSync: string;
}

export interface ModelVersion {
  name: string;
  version: string;
  status: "Stable" | "Updating";
  updated: string;
}

export const systemIntegrations: SystemIntegration[] = [
  { name: "Workday HRIS", category: "Core HR Data", status: "Connected", lastSync: "4 minutes ago" },
  { name: "Greenhouse ATS", category: "Hiring Pipeline", status: "Connected", lastSync: "12 minutes ago" },
  { name: "Okta SSO", category: "Identity", status: "Connected", lastSync: "1 minute ago" },
  { name: "Snowflake Warehouse", category: "Analytics Data", status: "Syncing", lastSync: "syncing now" },
  { name: "Slack", category: "Collaboration Signals", status: "Connected", lastSync: "8 minutes ago" },
  { name: "Jira", category: "Delivery Signals", status: "Degraded", lastSync: "3 hours ago" },
];

export const modelVersions: ModelVersion[] = [
  { name: "Risk Engine", version: "v2.3", status: "Stable", updated: "2 weeks ago" },
  { name: "SHAP Explainability", version: "v1.8", status: "Stable", updated: "1 month ago" },
  { name: "Skill Graph", version: "v3.0", status: "Updating", updated: "rolling out now" },
  { name: "Policy Retrieval", version: "v1.2", status: "Stable", updated: "3 weeks ago" },
];
