export interface ToolActivity {
  name: string;
  status: "Active" | "Idle" | "Complete";
  output: string;
}

export const toolActivities: ToolActivity[] = [
  { name: "Risk Engine", status: "Active", output: "Scoring 812 employees, Engineering batch in progress" },
  { name: "SHAP", status: "Active", output: "Explaining top 5 drivers for 34 flagged employees" },
  { name: "Skill Graph", status: "Complete", output: "Refreshed critical-skill scarcity index" },
  { name: "Policy Retrieval", status: "Idle", output: "Awaiting next Decision Guard request" },
  { name: "Simulation", status: "Complete", output: "Workload Reduction scenario simulated for Rahul Sharma" },
  { name: "Decision Guard", status: "Active", output: "Evaluating Fairness stage for 2 pending decisions" },
];

export const currentTask = "Analyzing Engineering retention risk";
