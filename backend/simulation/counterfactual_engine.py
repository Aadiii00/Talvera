from typing import Dict, Any
from backend.ml.inference.predictor import predictor

class CounterfactualEngine:
    @staticmethod
    def run_counterfactual(employee_record: dict, feature_changes: dict) -> Dict[str, Any]:
        """
        Recompute risk after controlled feature changes using existing XGBoost model.
        """
        # Original prediction
        emp_id = employee_record.get("employee_id", "UNKNOWN")
        orig_res = predictor.predict_single(emp_id, employee_record)
        current_risk = orig_res["risk_score"]
        
        # Modified record
        modified_record = employee_record.copy()
        
        # Apply controlled feature changes
        mutable_features = [
            "workload_index", "engagement_score", "training_hours",
            "pay_vs_market", "overtime_hours", "job_satisfaction"
        ]
        
        applied_changes = {}
        for feat, val in feature_changes.items():
            if feat in mutable_features and feat in modified_record:
                modified_record[feat] = float(val)
                applied_changes[feat] = float(val)
                
        # Re-predict
        sim_res = predictor.predict_single(emp_id, modified_record)
        simulated_risk = sim_res["risk_score"]
        risk_diff = round(simulated_risk - current_risk, 1)
        
        return {
            "employee_id": emp_id,
            "current_risk": current_risk,
            "simulated_risk": simulated_risk,
            "risk_difference": risk_diff,
            "applied_changes": applied_changes,
        }

counterfactual_engine = CounterfactualEngine()
