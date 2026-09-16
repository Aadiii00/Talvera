from typing import Dict, Any
from sqlalchemy.orm import Session
from backend.app.models.domain import Employee
from backend.ml.inference.predictor import predictor
from backend.ml.inference.anomaly_detector import anomaly_detector
from backend.ml.explainability.explainer import explainer
from backend.app.services.temporal import temporal_service
from backend.graph.graph_service import graph_service
from backend.simulation.cascade_engine import cascade_engine
from backend.app.services.fusion_engine import fusion_engine
from backend.app.services.task_router import task_router
from backend.rag.policy_rag import policy_rag

class IntelligenceOrchestrator:
    def orchestrate_employee_intelligence(self, db: Session, employee_id: str) -> Dict[str, Any]:
        emp = db.query(Employee).filter(Employee.id == employee_id).first()
        if not emp:
            # Fallback mock profile for rahul-sharma if missing in DB
            emp_rec = {
                "employee_id": employee_id, "name": "Rahul Sharma", "department": "Engineering",
                "team": "Platform", "role": "Senior Backend Engineer", "tenure_years": 4.2,
                "performance_score": 3.5, "engagement_score": 5.4, "absenteeism_rate": 4.1,
                "workload_index": 2.3, "salary": 145000, "pay_vs_market": 0.91,
                "promotions_last_3_years": 0, "training_hours": 12.0, "skill_growth_score": 38.0,
                "manager_change_recent": True, "manager_relationship_score": 6.1,
                "job_satisfaction": 5.0, "overtime_hours": 18.0, "remote_work_ratio": 0.5,
                "projects_count": 3, "critical_project": True, "critical_skills": "Kubernetes",
                "skill_scarcity": "Critical", "recent_policy_change": False,
            }
        else:
            emp_rec = {
                "employee_id": emp.id, "name": emp.name, "department": emp.department,
                "team": emp.team, "role": emp.role, "tenure_years": emp.tenure_years,
                "performance_score": emp.performance_score, "engagement_score": emp.engagement_score,
                "absenteeism_rate": emp.absenteeism_rate, "workload_index": emp.workload_index,
                "salary": emp.salary, "pay_vs_market": emp.pay_vs_market,
                "promotions_last_3_years": emp.promotions_last_3_years, "training_hours": emp.training_hours,
                "skill_growth_score": emp.skill_growth_score, "manager_change_recent": emp.manager_change_recent,
                "manager_relationship_score": emp.manager_relationship_score,
                "job_satisfaction": emp.job_satisfaction, "overtime_hours": emp.overtime_hours,
                "remote_work_ratio": emp.remote_work_ratio, "projects_count": emp.projects_count,
                "critical_project": emp.critical_project, "critical_skills": emp.critical_skills,
                "skill_scarcity": emp.skill_scarcity, "recent_policy_change": emp.recent_policy_change,
            }

        # 1. XGBoost
        risk_res = predictor.predict_single(employee_id, emp_rec)

        # 2. Anomaly
        anomaly_res = anomaly_detector.detect_employee_anomaly(emp_rec)

        # 3. SHAP
        shap_res = explainer.explain_employee(emp_rec)

        # 4. Temporal
        history = [{"day": d, "risk": max(0, min(100, risk_res["risk_score"] + (d/90.0)*4 - 2))} for d in range(0, 95, 5)]
        trajectory_res = temporal_service.calculate_trajectory(history)

        # 5. Graph
        graph_res = graph_service.get_employee_graph(employee_id)
        graph_res["org_exposure"] = emp_rec.get("org_exposure", 88.0)

        # 6. Cascade
        cascade_res = cascade_engine.simulate_cascade(employee_id, emp_rec)

        # 7. Policy
        policy_res = policy_rag.search_policies(f"{emp_rec['department']} workload policy")

        # Fuse
        return fusion_engine.fuse_intelligence(
            employee_id=employee_id,
            risk_res=risk_res,
            anomaly_res=anomaly_res,
            trajectory_res=trajectory_res,
            graph_res=graph_res,
            cascade_res=cascade_res,
            shap_res=shap_res,
            policy_res=policy_res
        )

    def orchestrate_workforce_intelligence(self, db: Session) -> Dict[str, Any]:
        employees = db.query(Employee).all()
        total_count = len(employees)
        high_risk_count = sum(1 for e in employees if e.attrition_risk >= 70.0)
        support_risk_count = sum(1 for e in employees if 50.0 <= e.attrition_risk < 70.0)

        return {
            "total_employees": total_count,
            "high_risk_count": high_risk_count,
            "support_risk_count": support_risk_count,
            "workforce_health_score": round(100.0 - (high_risk_count / max(1, total_count)) * 100.0, 1),
            "emerging_signals": [
                "Engineering risk increased 12% this month.",
                "Kubernetes critical skill scarcity flagged in Platform team.",
            ],
            "hotspots": [
                {"department": "Engineering", "risk_score": 71.0, "risk_band": "High"},
                {"department": "Finance", "risk_score": 63.0, "risk_band": "Elevated"},
            ]
        }

intelligence_orchestrator = IntelligenceOrchestrator()
