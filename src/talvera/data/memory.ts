export interface MemoryEntry {
  id: string;
  employee: string;
  prediction: string;
  recommendation: string;
  humanDecision: string;
  execution: string;
  outcome: string;
  expected: number;
  actual: number;
  variance: number;
  date: string;
}

export const memoryEntries: MemoryEntry[] = [
  {
    id: "mem-1",
    employee: "Priya Nair",
    prediction: "Risk to rise to 52% within 60 days without intervention",
    recommendation: "Manager coaching + 1:1 cadence reset",
    humanDecision: "Approved by Farah Sheikh",
    execution: "Coaching program completed in 18 days",
    outcome: "Risk fell to 35%, trajectory improving",
    expected: -12,
    actual: -17,
    variance: 5,
    date: "62 days ago",
  },
  {
    id: "mem-2",
    employee: "Aarav Mehta",
    prediction: "Skill stagnation risk to compound with workload by day 45",
    recommendation: "Kubernetes certification pathway enrollment",
    humanDecision: "Approved by Meera Krishnan",
    execution: "Enrollment pending — awaiting Q3 training budget",
    outcome: "Risk continued to rise, currently 66%",
    expected: -14,
    actual: 4,
    variance: -18,
    date: "21 days ago",
  },
  {
    id: "mem-3",
    employee: "Ananya Rao",
    prediction: "Compensation gap to drive risk above 60% within 90 days",
    recommendation: "Compensation band adjustment",
    humanDecision: "Under review by Karan Bhatia",
    execution: "Not yet started",
    outcome: "Pending — risk currently 61%",
    expected: -18,
    actual: 0,
    variance: -18,
    date: "6 days ago",
  },
];
