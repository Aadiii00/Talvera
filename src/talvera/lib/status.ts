import type { Confidence, RiskZone, Trajectory } from "@/talvera/data/types";
import type { GuardStatus } from "@/talvera/data/decisionGuard";
import type { WorkflowStatus } from "@/talvera/data/workflows";

export type StatusTone = "teal" | "pink" | "orange" | "green" | "blue" | "purple";

// Tailwind class pairs (soft bg + solid text) built from the status.* design tokens.
export const toneClasses: Record<StatusTone, string> = {
  teal: "bg-status-teal-soft text-status-teal",
  pink: "bg-status-pink-soft text-status-pink",
  orange: "bg-status-orange-soft text-status-orange",
  green: "bg-status-green-soft text-status-green",
  blue: "bg-status-blue-soft text-status-blue",
  purple: "bg-status-purple-soft text-status-purple",
};

// Raw CSS-variable colors for use inside SVG/recharts props (fill/stroke).
export const toneColor: Record<StatusTone, string> = {
  teal: "hsl(var(--status-teal))",
  pink: "hsl(var(--status-pink))",
  orange: "hsl(var(--status-orange))",
  green: "hsl(var(--status-green))",
  blue: "hsl(var(--status-blue))",
  purple: "hsl(var(--status-purple))",
};

export const zoneTone: Record<RiskZone, StatusTone> = {
  Monitor: "blue",
  Support: "orange",
  Protect: "purple",
  Critical: "pink",
};

export const trajectoryTone: Record<Trajectory, StatusTone> = {
  Improving: "green",
  Stable: "blue",
  Deteriorating: "pink",
};

export const confidenceTone: Record<Confidence, StatusTone> = {
  High: "green",
  Medium: "orange",
  Low: "pink",
};

export const guardStatusTone: Record<GuardStatus, StatusTone> = {
  PASS: "green",
  REVIEW: "orange",
  BLOCKED: "pink",
};

export const workflowStatusTone: Record<WorkflowStatus, StatusTone> = {
  Pending: "orange",
  Approved: "blue",
  Executing: "teal",
  Completed: "green",
  Failed: "pink",
};

export const decisionTone: Record<string, StatusTone> = {
  Act: "teal",
  ACT: "teal",
  Review: "blue",
  REVIEW: "blue",
  Simulate: "purple",
  SIMULATE: "purple",
  Wait: "orange",
  WAIT: "orange",
  "Do Not Act": "pink",
  "DO NOT ACT": "pink",
};
