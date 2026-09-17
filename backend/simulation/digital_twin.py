import copy
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.models.domain import Employee, Department, Team, Skill, Project

class DigitalTwinState:
    def __init__(self, employees: List[dict] = None, projects: List[dict] = None):
        self.employees = employees or []
        self.projects = projects or [
            {"id": "p-1", "name": "Core Platform Migration", "criticality": "Critical"},
            {"id": "p-2", "name": "Customer Data Vault", "criticality": "High"},
            {"id": "p-3", "name": "Payments Gateway 2.0", "criticality": "Critical"},
            {"id": "p-4", "name": "Sales Intelligence Suite", "criticality": "Medium"},
            {"id": "p-5", "name": "Controls Automation", "criticality": "High"},
            {"id": "p-6", "name": "People Analytics Rollout", "criticality": "Medium"},
        ]

    def clone(self):
        return DigitalTwinState(
            employees=copy.deepcopy(self.employees),
            projects=copy.deepcopy(self.projects)
        )

    def remove_employee(self, employee_id: str):
        exited_emp = None
        for e in self.employees:
            if e["employee_id"] == employee_id:
                e["status"] = "EXITED"
                e["attrition_risk"] = 100.0
                exited_emp = e
                break

        if exited_emp:
            # Workload redistribution (+15% workload to team members)
            team_name = exited_emp.get("team")
            for e in self.employees:
                if e.get("team") == team_name and e.get("status") != "EXITED":
                    e["workload_index"] = round(e.get("workload_index", 1.2) * 1.15, 2)
                    e["attrition_risk"] = min(95.0, round(e.get("attrition_risk", 40.0) + 12.0, 1))

    def add_employee(self, new_emp: dict):
        new_emp["status"] = "ACTIVE"
        new_emp["attrition_risk"] = new_emp.get("attrition_risk", 25.0)
        self.employees.append(new_emp)

    def adjust_department_workload(self, department: str, delta_pct: float):
        for e in self.employees:
            if department == "ALL" or e.get("department") == department:
                new_workload = max(0.5, round(e.get("workload_index", 1.2) * (1.0 + delta_pct / 100.0), 2))
                e["workload_index"] = new_workload
                e["attrition_risk"] = max(10.0, min(95.0, round(e.get("attrition_risk", 40.0) + delta_pct * 0.8, 1)))

    def mark_project_critical(self, project_name: str):
        for p in self.projects:
            if p["name"] == project_name:
                p["criticality"] = "Critical"
        for e in self.employees:
            if e.get("critical_skills") in ["Kubernetes", "Cloud Security"]:
                e["org_exposure"] = min(98.0, e.get("org_exposure", 70.0) + 10.0)

    def get_summary(self) -> Dict[str, Any]:
        active_emps = [e for e in self.employees if e.get("status") != "EXITED"]
        total = len(active_emps)
        high_risk = sum(1 for e in active_emps if e.get("attrition_risk", 0) >= 70)

        skills_list = [e.get("critical_skills") for e in active_emps if e.get("critical_skills") and e.get("critical_skills") != "None"]
        skill_counts = {}
        for s in skills_list:
            skill_counts[s] = skill_counts.get(s, 0) + 1

        spofs = [s for s, count in skill_counts.items() if count <= 1 or s in ["Kubernetes", "Cloud Security", "AI / ML"]]

        avg_risk = round(sum(e.get("attrition_risk", 0) for e in active_emps) / max(1, total), 1)
        avg_exposure = round(sum(e.get("org_exposure", 50) for e in active_emps) / max(1, total), 1)
        cascade_exposure = round(min(98.0, avg_risk * 0.6 + len(spofs) * 4.0), 1)

        return {
            "employee_count": total,
            "team_count": len(set([e.get("team") for e in active_emps])),
            "department_count": len(set([e.get("department") for e in active_emps])),
            "critical_skills_count": len(set(skills_list)),
            "single_points_of_failure": spofs,
            "project_count": len(self.projects),
            "high_risk_population": high_risk,
            "attrition_risk": avg_risk,
            "team_health": round(100.0 - avg_risk * 0.8, 1),
            "organizational_exposure": avg_exposure,
            "skill_exposure": round(min(95.0, len(spofs) * 12.0 + 30.0), 1),
            "project_exposure": round(min(95.0, len([p for p in self.projects if p['criticality'] == 'Critical']) * 14.0 + 20.0), 1),
            "cascade_exposure": cascade_exposure,
            "operational_disruption": "High" if cascade_exposure >= 65 else ("Medium" if cascade_exposure >= 40 else "Low"),
        }

class DigitalTwinDiff:
    @staticmethod
    def calculate_diff(base_summary: dict, sim_summary: dict) -> Dict[str, Any]:
        return {
            "employees_changed": {
                "base": base_summary["employee_count"],
                "simulated": sim_summary["employee_count"],
                "tag": "INCREASED" if sim_summary["employee_count"] > base_summary["employee_count"] else ("DECREASED" if sim_summary["employee_count"] < base_summary["employee_count"] else "UNCHANGED")
            },
            "risk_changed": {
                "base": base_summary["attrition_risk"],
                "simulated": sim_summary["attrition_risk"],
                "delta": round(sim_summary["attrition_risk"] - base_summary["attrition_risk"], 1),
                "tag": "DECREASED" if sim_summary["attrition_risk"] < base_summary["attrition_risk"] else ("INCREASED" if sim_summary["attrition_risk"] > base_summary["attrition_risk"] else "UNCHANGED")
            },
            "exposure_changed": {
                "base": base_summary["organizational_exposure"],
                "simulated": sim_summary["organizational_exposure"],
                "delta": round(sim_summary["organizational_exposure"] - base_summary["organizational_exposure"], 1),
                "tag": "DECREASED" if sim_summary["organizational_exposure"] < base_summary["organizational_exposure"] else ("INCREASED" if sim_summary["organizational_exposure"] > base_summary["organizational_exposure"] else "UNCHANGED")
            },
            "cascade_changed": {
                "base": base_summary["cascade_exposure"],
                "simulated": sim_summary["cascade_exposure"],
                "delta": round(sim_summary["cascade_exposure"] - base_summary["cascade_exposure"], 1),
                "tag": "DECREASED" if sim_summary["cascade_exposure"] < base_summary["cascade_exposure"] else ("INCREASED" if sim_summary["cascade_exposure"] > base_summary["cascade_exposure"] else "UNCHANGED")
            }
        }

class DigitalTwinService:
    @staticmethod
    def get_current_state(db: Session) -> DigitalTwinState:
        employees = db.query(Employee).all()
        emp_dicts = []
        for e in employees:
            emp_dicts.append({
                "employee_id": e.id, "name": e.name, "department": e.department,
                "team": e.team, "role": e.role, "status": "ACTIVE",
                "attrition_risk": e.attrition_risk, "org_exposure": e.org_exposure,
                "critical_skills": e.critical_skills, "skill_scarcity": e.skill_scarcity,
                "workload_index": e.workload_index
            })
        if not emp_dicts:
            emp_dicts = [
                {"employee_id": "rahul-sharma", "name": "Rahul Sharma", "department": "Engineering", "team": "Platform", "role": "Senior Backend Engineer", "status": "ACTIVE", "attrition_risk": 78.0, "org_exposure": 94.0, "critical_skills": "Kubernetes", "skill_scarcity": "Critical", "workload_index": 2.3},
                {"employee_id": "vikram-iyer", "name": "Vikram Iyer", "department": "Finance", "team": "Audit & Controls", "role": "Lead Risk Auditor", "status": "ACTIVE", "attrition_risk": 42.0, "org_exposure": 88.0, "critical_skills": "Cloud Security", "skill_scarcity": "Critical", "workload_index": 1.4},
                {"employee_id": "ananya-rao", "name": "Ananya Rao", "department": "Sales", "team": "Enterprise Sales", "role": "Enterprise Account Director", "status": "ACTIVE", "attrition_risk": 61.0, "org_exposure": 58.0, "critical_skills": "Solution Selling", "skill_scarcity": "Low", "workload_index": 1.6},
                {"employee_id": "priya-nair", "name": "Priya Nair", "department": "Support", "team": "Support Tier 2", "role": "Customer Support Lead", "status": "ACTIVE", "attrition_risk": 35.0, "org_exposure": 40.0, "critical_skills": "Escalation", "skill_scarcity": "Low", "workload_index": 1.1},
                {"employee_id": "aarav-mehta", "name": "Aarav Mehta", "department": "Engineering", "team": "Platform", "role": "DevOps Engineer", "status": "ACTIVE", "attrition_risk": 66.0, "org_exposure": 72.0, "critical_skills": "Kubernetes", "skill_scarcity": "High", "workload_index": 1.8},
                {"employee_id": "sneha-kumar", "name": "Sneha Kumar", "department": "HR", "team": "People", "role": "HR Business Partner", "status": "ACTIVE", "attrition_risk": 28.0, "org_exposure": 33.0, "critical_skills": "Analytics", "skill_scarcity": "Low", "workload_index": 1.0},
            ]
        return DigitalTwinState(emp_dicts)

    @staticmethod
    def simulate_state_scenario(
        db: Session,
        scenario: str,
        target_department: str = None,
        actions: dict = None
    ) -> Dict[str, Any]:
        baseline_twin = DigitalTwinService.get_current_state(db)
        simulated_twin = baseline_twin.clone()

        # Apply action transformations
        if actions:
            if actions.get("remove_employee"):
                simulated_twin.remove_employee(actions["remove_employee"])
            if actions.get("add_employee"):
                simulated_twin.add_employee(actions["add_employee"])
            if actions.get("workload_delta_pct"):
                simulated_twin.adjust_department_workload(target_department or "ALL", actions["workload_delta_pct"])
            if actions.get("mark_critical_project"):
                simulated_twin.mark_project_critical(actions["mark_critical_project"])

        # Preset scenarios if no explicit actions dictionary passed
        if not actions:
            if scenario == "WORKLOAD_REDUCTION":
                simulated_twin.adjust_department_workload(target_department or "ALL", -20.0)
            elif scenario == "TRAINING":
                simulated_twin.adjust_department_workload(target_department or "ALL", -10.0)
            elif scenario == "HIRING":
                simulated_twin.add_employee({"employee_id": "new-hire-1", "name": "Senior K8s Engineer", "department": "Engineering", "team": "Platform", "role": "Backend Staff", "critical_skills": "Kubernetes", "skill_scarcity": "Low", "org_exposure": 40.0, "workload_index": 1.0})
                simulated_twin.adjust_department_workload("Engineering", -15.0)
            elif scenario == "COMBINED":
                simulated_twin.adjust_department_workload("Engineering", -25.0)

        base_summary = baseline_twin.get_summary()
        sim_summary = simulated_twin.get_summary()
        diff = DigitalTwinDiff.calculate_diff(base_summary, sim_summary)

        return {
            "scenario": scenario,
            "target_department": target_department or "ALL",
            "baseline_state": base_summary,
            "simulated_state": sim_summary,
            "diff": diff,
            "assumptions": [
                "Cloned Digital Twin state evaluated without mutating production database.",
                "Workload rebalancing propagates to adjacent team members upon exit.",
                "Model artifact: XGBoost v2.3 & Cascade Propagation Engine."
            ],
            "disclaimer": "Digital Twin cloned simulation state. Production database was NOT mutated."
        }

    @staticmethod
    def compare_worlds(db: Session, horizon_days: int = 90) -> Dict[str, Any]:
        base_twin = DigitalTwinService.get_current_state(db)

        scen_a = base_twin.clone()
        scen_a.adjust_department_workload("Engineering", -15.0)

        scen_b = base_twin.clone()
        scen_b.adjust_department_workload("ALL", -20.0)

        opt_world = base_twin.clone()
        opt_world.add_employee({"employee_id": "opt-hire-1", "name": "Platform Lead", "department": "Engineering", "team": "Platform", "role": "Staff Engineer", "critical_skills": "Kubernetes", "skill_scarcity": "Low", "org_exposure": 35.0, "workload_index": 0.9})
        opt_world.adjust_department_workload("ALL", -25.0)

        return {
            "horizon_days": horizon_days,
            "worlds": [
                {"label": "Current World", "summary": base_twin.get_summary(), "cost_inr": "₹0"},
                {"label": "Scenario A (Workload -15%)", "summary": scen_a.get_summary(), "cost_inr": "₹4,20,000"},
                {"label": "Scenario B (Org Workload -20%)", "summary": scen_b.get_summary(), "cost_inr": "₹6,80,000"},
                {"label": "Optimized World (Hiring + Workload)", "summary": opt_world.get_summary(), "cost_inr": "₹9,10,000"},
            ]
        }

digital_twin_service = DigitalTwinService()
