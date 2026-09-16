from typing import Dict, Any, List
from backend.app.services.conflict_detector import conflict_detector

class EvidenceFusionEngine:
    @staticmethod
    def fuse_intelligence(
        employee_id: str,
        risk_res: dict,
        anomaly_res: dict,
        trajectory_res: dict,
        graph_res: dict,
        cascade_res: dict,
        shap_res: dict,
        policy_res: dict
    ) -> Dict[str, Any]:
        conflicts = conflict_detector.detect_conflicts(
            risk_score=risk_res.get("risk_score", 0.0),
            trajectory_class=trajectory_res.get("trajectory_class", "STABLE"),
            is_anomaly=anomaly_res.get("is_anomaly", False),
            org_exposure=graph_res.get("org_exposure", 50.0),
            is_single_point_of_failure=cascade_res.get("is_single_point_of_failure", False)
        )

        evidence = [
            {"source": "XGBoost", "type": "PREDICTION", "value": f"Risk Score {risk_res.get('risk_score')}% ({risk_res.get('risk_band')})"},
            {"source": "IsolationForest", "type": "ANOMALY", "value": f"Anomaly Severity: {anomaly_res.get('severity')}"},
            {"source": "TemporalEngine", "type": "FORECAST", "value": f"Trajectory: {trajectory_res.get('trajectory_class')}"},
            {"source": "Neo4jGraph", "type": "GRAPH_EVIDENCE", "value": f"Dependencies: {graph_res.get('dependency_count', 0)} connections"},
            {"source": "CascadeEngine", "type": "SIMULATION", "value": f"Cascade Probability: {cascade_res.get('cascade_probability')}%"},
        ]

        if policy_res and policy_res.get("results"):
            evidence.append({
                "source": "ChromaRAG",
                "type": "POLICY_EVIDENCE",
                "value": f"Matched Policy: {policy_res['results'][0]['title']}"
            })

        # Recommended Next Step based on conflicts and firewall status
        if conflicts:
            recommended_step = conflicts[0]["required_action"]
        elif risk_res.get("risk_score", 0) >= 70:
            recommended_step = "ACT"
        elif risk_res.get("risk_score", 0) >= 50:
            recommended_step = "REVIEW"
        else:
            recommended_step = "WAIT"

        return {
            "employee_id": employee_id,
            "risk": risk_res,
            "anomaly": anomaly_res,
            "trajectory": trajectory_res,
            "organizational_exposure": {
                "exposure_score": graph_res.get("org_exposure", 50.0),
                "dependency_count": graph_res.get("dependency_count", 0),
            },
            "cascade": cascade_res,
            "shap": shap_res,
            "evidence": evidence,
            "conflicts": conflicts,
            "confidence": {
                "xgboost_calibration": "High (ROC-AUC 0.88)",
                "anomaly_score": anomaly_res.get("anomaly_score"),
                "graph_evidence_count": graph_res.get("dependency_count", 0),
            },
            "recommended_next_step": recommended_step,
        }

fusion_engine = EvidenceFusionEngine()
