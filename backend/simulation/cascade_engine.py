from typing import Dict, Any, List
from backend.graph.graph_service import graph_service

class WorkforceCascadeEngine:
    @staticmethod
    def simulate_cascade(trigger_employee_id: str, employee_record: dict) -> Dict[str, Any]:
        return WorkforceCascadeEngine.simulate_deep_cascade(trigger_employee_id, employee_record, depth=2)

    @staticmethod
    def simulate_deep_cascade(
        trigger_employee_id: str,
        employee_record: dict,
        depth: int = 2
    ) -> Dict[str, Any]:
        """
        Deep Cascade Propagation with configurable depth (1, 2, or 3).
        Labeled: SCENARIO-BASED PROPAGATION
        """
        emp_name = employee_record.get("name", trigger_employee_id)
        dept = employee_record.get("department", "Engineering")
        team = employee_record.get("team", "Platform")
        critical_skill = employee_record.get("critical_skills", "Kubernetes")

        skill_graph = graph_service.get_skill_graph(critical_skill) if critical_skill != "None" else {"employee_count": 5}
        holders_count = skill_graph.get("employee_count", 5)
        is_spof = holders_count <= 1 or critical_skill in ["Kubernetes", "Cloud Security", "AI / ML", "SOX Control"]

        # Primary (depth 1): Immediate team
        primary = [{"entity": team, "type": "Team", "depth": 1, "workload_shock": "+28% surge"}]

        # Secondary (depth 2): Dependent projects and skills
        secondary = []
        if depth >= 2:
            secondary.append({"entity": f"{dept} Controls Repository", "type": "KnowledgeSilo", "depth": 2, "impact": "High Exposure"})
            secondary.append({"entity": f"{critical_skill} Delivery Track", "type": "SkillGap", "depth": 2, "impact": "Single Point Failure"})

        # Tertiary (depth 3): Downstream services and cross-department workflows
        tertiary = []
        if depth >= 3:
            tertiary.append({"entity": "Core Platform Migration", "type": "Project", "depth": 3, "impact": "2 Sprint Delay"})
            tertiary.append({"entity": "Adjacent Finance Audit Workflow", "type": "CrossDept", "depth": 3, "impact": "SOX Compliance Delay"})

        impacted_count = 14 if is_spof else 4
        cascade_score = 92.0 if is_spof else 45.0

        return {
            "trigger_employee_id": trigger_employee_id,
            "trigger_employee_name": emp_name,
            "department": dept,
            "depth": depth,
            "cascade_score": cascade_score,
            "cascade_probability": 95 if is_spof else 42,
            "teammates_impacted": impacted_count,
            "is_single_point_of_failure": is_spof,
            "primary_entities": primary,
            "secondary_entities": secondary,
            "tertiary_entities": tertiary,
            "critical_path": [emp_name, critical_skill, team, f"{dept} Delivery Track"],
            "message": f"If {emp_name} departs, {impacted_count} teammates are at elevated risk (depth={depth}).",
            "label": "SCENARIO-BASED PROPAGATION",
        }

cascade_engine = WorkforceCascadeEngine()
