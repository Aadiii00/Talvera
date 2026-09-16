export type WorkflowStatus = "Pending" | "Approved" | "Executing" | "Completed" | "Failed";

export interface WorkflowStep {
  label: string;
  done: boolean;
}

export interface Workflow {
  id: string;
  title: string;
  employee: string;
  description: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
}

export const workflows: Workflow[] = [
  {
    id: "wf-1",
    title: "Retention Intervention",
    employee: "Rahul Sharma",
    description: "Workload redistribution",
    status: "Executing",
    steps: [
      { label: "Created", done: true },
      { label: "Approved", done: true },
      { label: "Manager notified", done: true },
      { label: "Task created", done: false },
      { label: "Follow-up scheduled", done: false },
    ],
  },
  {
    id: "wf-2",
    title: "Compensation Review",
    employee: "Ananya Rao",
    description: "Market band adjustment request",
    status: "Approved",
    steps: [
      { label: "Created", done: true },
      { label: "Approved", done: true },
      { label: "Manager notified", done: false },
      { label: "Task created", done: false },
      { label: "Follow-up scheduled", done: false },
    ],
  },
  {
    id: "wf-3",
    title: "Skill Development Plan",
    employee: "Aarav Mehta",
    description: "Kubernetes certification pathway enrollment",
    status: "Pending",
    steps: [
      { label: "Created", done: true },
      { label: "Approved", done: false },
      { label: "Manager notified", done: false },
      { label: "Task created", done: false },
      { label: "Follow-up scheduled", done: false },
    ],
  },
  {
    id: "wf-4",
    title: "Manager Coaching",
    employee: "Priya Nair",
    description: "1:1 cadence reset, completed successfully",
    status: "Completed",
    steps: [
      { label: "Created", done: true },
      { label: "Approved", done: true },
      { label: "Manager notified", done: true },
      { label: "Task created", done: true },
      { label: "Follow-up scheduled", done: true },
    ],
  },
  {
    id: "wf-5",
    title: "Team Stabilization Protocol",
    employee: "Vikram Iyer",
    description: "Cascade containment dispatch failed — awaiting retry",
    status: "Failed",
    steps: [
      { label: "Created", done: true },
      { label: "Approved", done: true },
      { label: "Manager notified", done: true },
      { label: "Task created", done: false },
      { label: "Follow-up scheduled", done: false },
    ],
  },
];
