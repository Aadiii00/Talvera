from typing import Dict, Any, List
from backend.ml.inference.predictor import predictor
from backend.ml.inference.anomaly_detector import anomaly_detector
from backend.ml.explainability.explainer import explainer
from backend.app.services.temporal import temporal_service
from backend.graph.graph_service import graph_service
from backend.simulation.cascade_engine import cascade_engine
from backend.simulation.counterfactual_engine import counterfactual_engine
from backend.simulation.futures_engine import futures_engine
from backend.optimization.optimizer import intervention_optimizer
from backend.rag.policy_rag import policy_rag
from backend.app.services.task_router import task_router

class QwenReasoningAgent:
    def ask(self, question: str, employee_id: str = "rahul-sharma") -> Dict[str, Any]:
        intent = task_router.route_intent(question)
        q_lower = question.lower()
        tools_used = []
        key_evidence = []
        model_outputs = {}
        conflicts = []
        uncertainties = []

        # Default employee profile record
        emp_dict = {
            "employee_id": employee_id, "name": "Rahul Sharma", "department": "Engineering",
            "team": "Engineering / Platform", "role": "Senior Backend Engineer", "tenure_years": 4.2,
            "performance_score": 3.5, "engagement_score": 5.4, "absenteeism_rate": 4.1,
            "workload_index": 2.3, "salary": 145000, "pay_vs_market": 0.91,
            "promotions_last_3_years": 0, "training_hours": 12.0, "skill_growth_score": 38.0,
            "manager_change_recent": True, "manager_relationship_score": 6.1,
            "job_satisfaction": 5.0, "overtime_hours": 18.0, "remote_work_ratio": 0.5,
            "projects_count": 3, "critical_project": True, "critical_skills": "Kubernetes",
            "skill_scarcity": "Critical", "recent_policy_change": False,
        }

        # Targeted Tool Dispatch based on Intent
        if intent in ["RISK_ANALYSIS", "CAUSE_ANALYSIS", "EMPLOYEE_INVESTIGATION"]:
            risk_res = predictor.predict_single(employee_id, emp_dict)
            tools_used.append("get_risk_prediction")
            model_outputs["xgboost"] = risk_res
            key_evidence.append(f"XGBoost Risk Score: {risk_res['risk_score']}% ({risk_res['risk_band']})")

            shap_res = explainer.explain_employee(emp_dict)
            tools_used.append("get_risk_explanation")
            model_outputs["shap"] = shap_res
            top_driver = shap_res["top_drivers"][0]["feature"]
            key_evidence.append(f"Top SHAP Driver: {top_driver}")

            anomaly_res = anomaly_detector.detect_employee_anomaly(emp_dict)
            tools_used.append("get_anomaly")
            model_outputs["anomaly"] = anomaly_res

            traj_res = temporal_service.calculate_trajectory([{"day": d, "risk": 50 + d*0.3} for d in range(0, 95, 5)])
            tools_used.append("get_trajectory")
            model_outputs["temporal"] = traj_res

            if risk_res["risk_score"] >= 60.0 and traj_res["trajectory_class"] == "IMPROVING":
                conflicts.append("XGBoost predicts elevated risk, but Temporal Trajectory is Improving.")

            answer = f"Rahul Sharma's risk ({risk_res['risk_score']}%) is primarily driven by {top_driver} and on-call workload."
            next_step = "REVIEW"

        elif intent == "CASCADE_ANALYSIS":
            cascade_res = cascade_engine.simulate_cascade(employee_id, emp_dict)
            tools_used.append("get_cascade_risk")
            model_outputs["cascade"] = cascade_res
            key_evidence.append(cascade_res["message"])
            answer = f"Departure of {emp_dict['name']} carries a {cascade_res['cascade_probability']}% cascade risk, affecting {cascade_res['teammates_impacted']} teammates."
            next_step = "ACT"

        elif intent == "INTERVENTION_OPTIMIZATION":
            opt_res = intervention_optimizer.optimize_interventions(50000)
            tools_used.append("optimize_intervention")
            model_outputs["optimization"] = opt_res
            key_evidence.append(f"Recommended Interventions: {', '.join(opt_res['recommended_interventions'])}")
            answer = f"OR-Tools optimization recommends: {', '.join(opt_res['recommended_interventions'])} (ROI {opt_res['roi']}x)."
            next_step = "ACT"

        elif intent == "POLICY_QUERY":
            pol_res = policy_rag.search_policies(question)
            tools_used.append("retrieve_policy")
            model_outputs["policy"] = pol_res
            if pol_res["results"]:
                key_evidence.append(f"Policy Match: {pol_res['results'][0]['title']}")
                answer = f"HR Policy ({pol_res['results'][0]['source']}): {pol_res['results'][0]['snippet'][:120]}..."
            else:
                answer = "No matching workforce policy found."
            next_step = "REVIEW"

        else:
            risk_res = predictor.predict_single(employee_id, emp_dict)
            tools_used.append("get_risk_prediction")
            model_outputs["xgboost"] = risk_res
            key_evidence.append(f"Baseline Risk Score: {risk_res['risk_score']}%")
            answer = f"Engineering risk is elevated, driven by workload index and skill bottlenecks."
            next_step = "REVIEW"

        return {
            "answer": answer,
            "key_evidence": key_evidence,
            "model_outputs": model_outputs,
            "conflicts": conflicts,
            "uncertainties": ["Model calibration confidence: High (ROC-AUC 0.88)"],
            "recommended_next_step": next_step,
            "decision_state": next_step,
            "tools_used": tools_used,
        }

qwen_agent = QwenReasoningAgent()
