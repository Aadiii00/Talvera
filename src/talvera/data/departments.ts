import type { Department } from "./types";

export const departments: Department[] = [
  { name: "Engineering", headcountShare: 31, riskScore: 71, employeeCount: 252 },
  { name: "Sales", headcountShare: 24, riskScore: 54, employeeCount: 195 },
  { name: "Support", headcountShare: 18, riskScore: 46, employeeCount: 146 },
  { name: "Finance", headcountShare: 9, riskScore: 63, employeeCount: 73 },
  { name: "HR", headcountShare: 10, riskScore: 38, employeeCount: 81 },
  { name: "Operations", headcountShare: 8, riskScore: 41, employeeCount: 65 },
];

export const totalHeadcount = departments.reduce((sum, department) => sum + department.employeeCount, 0);
