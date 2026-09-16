from typing import Dict, Any, List
from backend.ml.inference.predictor import predictor

INTERVENTION_TRANSFORMATIONS = {
    "WORKLOAD_REDUCTION": {"workload_index": lambda w: max(0.8, w * 0.75), "overtime_hours": lambda o: max(0.0, o * 0.5)},
    "TRAINING": {"training_hours": lambda t: t + 20.0, "skill_growth_score": lambda s: min(100.0, s + 25.0)},
    "INTERNAL_MOBILITY": {"job_satisfaction": lambda j: min(10.0, j + 2.5), "manager_change_recent": lambda m: True},
    "COMPENSATION_REVIEW": {"pay_vs_market": lambda p: max(1.0, p + 0.12)},
    "MANAGER_INTERVENTION": {"manager_relationship_score": lambda m: min(10.0, m + 2.5)},
}

class InterventionEffectEngine:
    @staticmethod
    def estimate_effect(
        employee_record: dict,
        intervention_type: str,
        parameters: dict = None
    ) -> Dict[str, Any]:
        emp_id = employee_record.get("employee_id", "UNKNOWN")
        baseline_res = predictor.predict_single(emp_id, employee_record)
        baseline_risk = baseline_res["risk_score"]

        modified_record = employee_record.copy()
        transforms = INTERVENTION_TRANSFORMATIONS.get(intervention_type.upper(), {})

        changed_features = {}
        for feat, transform_fn in transforms.items():
            if feat in modified_record:
                old_val = modified_record[feat]
                new_val = transform_fn(old_val)
                modified_record[feat] = new_val
                changed_features[feat] = {"from": old_val, "to": round(new_val, 2)}

        # Re-score using XGBoost
        scenario_res = predictor.predict_single(emp_id, modified_record)
        scenario_risk = scenario_res["risk_score"]
        estimated_effect = round(scenario_risk - baseline_risk, 1)

        return {
            "employee_id": emp_id,
            "intervention_type": intervention_type.upper(),
            "baseline_risk": baseline_risk,
            "scenario_risk": scenario_risk,
            "estimated_effect": estimated_effect,
            "changed_features": changed_features,
            "assumptions": "ESTIMATED UPLIFT calculated via XGBoost baseline re-scoring with realistic feature bounds.",
            "model_version": baseline_res["model_version"]
        }

    @staticmethod
    def compare_interventions(
        employee_record: dict,
        intervention_types: List[str] = None
    ) -> List[Dict[str, Any]]:
        if not intervention_types:
            intervention_types = ["WORKLOAD_REDUCTION", "TRAINING", "COMPENSATION_REVIEW", "INTERNAL_MOBILITY", "MANAGER_INTERVENTION"]

        comparisons = []
        for itype in intervention_types:
            res = InterventionEffectEngine.estimate_effect(employee_record, itype)
            comparisons.append(res)

        comparisons.sort(key=lambda x: x["estimated_effect"]) # Most negative (largest risk reduction) first
        return comparisons

intervention_effect_engine = InterventionEffectEngine()
