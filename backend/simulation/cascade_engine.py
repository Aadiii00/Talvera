from typing import Dict, Any, List
from backend.graph.graph_service import graph_service

class WorkforceCascadeEngine:
    @staticmethod
    def simulate_cascade(trigger_employee_id: str, employee_record: dict) -> Dict[str, Any]:
        """
        Deterministic scenario-based risk propagation.
        Labeled: SCENARIO-BASED RISK PROPAGATION
        """
        emp_name = employee_record.get("name", trigger_employee_id)
        dept = employee_record.get("department", "Engineering")
        team = employee_record.get("team", "Platform")
        critical_skill = employee_record.get("critical_skills", "None")
        tenure = employee_record.get("tenure_years", 3.0)
        
        # Determine team size & affected count based on skill scarcity / role
        skill_graph = graph_service.get_skill_graph(critical_skill) if critical_skill != "None" else {"employee_count": 5}
        holders_count = skill_graph.get("employee_count", 5)
        
        is_spof = holders_count <= 1 or critical_skill in ["Kubernetes", "Cloud Security", "AI / ML", "SOX Control"]
        
        if is_spof:
            cascade_score = 92.0
            teammates_impacted = 14
            cascade_prob = 95
        else:
            cascade_score = 45.0
            teammates_impacted = 4
            cascade_prob = 42
            
        affected_entities = [
            {"entity": team, "type": "Team", "workload_shock": "+28% surge"},
            {"entity": f"{dept} Controls/Repo", "type": "KnowledgeSilo", "risk": "High Exposure"},
        ]
        
        return {
            "trigger_employee_id": trigger_employee_id,
            "trigger_employee_name": emp_name,
            "department": dept,
            "cascade_score": cascade_score,
            "cascade_probability": cascade_prob,
            "teammates_impacted": teammates_impacted,
            "is_single_point_of_failure": is_spof,
            "affected_entities": affected_entities,
            "message": f"If {emp_name} departs, {teammates_impacted} teammates are at elevated risk.",
            "label": "SCENARIO-BASED RISK PROPAGATION",
        }

cascade_engine = WorkforceCascadeEngine()
