import copy
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.models.domain import Employee, Department, Team, Skill, Project

class DigitalTwinState:
    def __init__(self, employees: List[dict] = None):
        self.employees = employees or []

    def clone(self):
        return DigitalTwinState(employees=copy.deepcopy(self.employees))

    def get_summary(self) -> Dict[str, Any]:
        total = len(self.employees)
        high_risk = sum(1 for e in self.employees if e.get("attrition_risk", 0) >= 70)
        critical_skills = list(set([e.get("critical_skills") for e in self.employees if e.get("skill_scarcity") == "Critical"]))
        
        return {
            "employee_count": total,
            "team_count": len(set([e.get("team") for e in self.employees])),
            "department_count": len(set([e.get("department") for e in self.employees])),
            "high_risk_population": high_risk,
            "critical_skills": [s for s in critical_skills if s and s != "None"],
            "organizational_exposure": round(sum(e.get("org_exposure", 50) for e in self.employees) / max(1, total), 1),
            "active_interventions": 5,
        }

class DigitalTwinService:
    @staticmethod
    def get_current_state(db: Session) -> DigitalTwinState:
        employees = db.query(Employee).all()
        emp_dicts = []
        for e in employees:
            emp_dicts.append({
                "employee_id": e.id, "name": e.name, "department": e.department,
                "team": e.team, "role": e.role, "attrition_risk": e.attrition_risk,
                "org_exposure": e.org_exposure, "critical_skills": e.critical_skills,
                "skill_scarcity": e.skill_scarcity, "workload_index": e.workload_index
            })
        return DigitalTwinState(emp_dicts)

    @staticmethod
    def simulate_state_scenario(
        db: Session,
        scenario: str,
        target_department: str = None,
        parameters: dict = None
    ) -> Dict[str, Any]:
        baseline_twin = DigitalTwinService.get_current_state(db)
        simulated_twin = baseline_twin.clone()

        # Apply simulation transformations without mutating real DB
        affected_count = 0
        for emp in simulated_twin.employees:
            if not target_department or emp.get("department") == target_department:
                affected_count += 1
                if scenario == "WORKLOAD_REDUCTION":
                    emp["workload_index"] = max(0.8, emp.get("workload_index", 1.2) * 0.8)
                    emp["attrition_risk"] = max(10.0, emp.get("attrition_risk", 50.0) - 15.0)
                elif scenario == "TRAINING":
                    emp["attrition_risk"] = max(10.0, emp.get("attrition_risk", 50.0) - 10.0)
                elif scenario == "COMPENSATION":
                    emp["attrition_risk"] = max(10.0, emp.get("attrition_risk", 50.0) - 18.0)

        return {
            "scenario": scenario,
            "target_department": target_department or "ALL",
            "baseline_state": baseline_twin.get_summary(),
            "simulated_state": simulated_twin.get_summary(),
            "affected_entities_count": affected_count,
            "disclaimer": "Digital Twin cloned simulation state. Production database was NOT mutated."
        }

digital_twin_service = DigitalTwinService()
