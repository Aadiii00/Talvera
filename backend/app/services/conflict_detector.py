from typing import Dict, Any, List

class ModelConflictDetector:
    @staticmethod
    def detect_conflicts(
        risk_score: float,
        trajectory_class: str,
        is_anomaly: bool,
        org_exposure: float,
        is_single_point_of_failure: bool
    ) -> List[Dict[str, Any]]:
        conflicts = []

        # 1. RISK_VS_TRAJECTORY / RISK_VS_TREND
        if risk_score >= 60.0 and trajectory_class == "IMPROVING":
            conflicts.append({
                "conflict_type": "RISK_VS_TRAJECTORY",
                "affected_signals": ["XGBoost Risk (High)", "Temporal Trajectory (Improving)"],
                "severity": "Medium",
                "required_action": "REVIEW",
                "explanation": "High baseline attrition risk contradicts an improving recent trajectory. Review before taking aggressive intervention."
            })

        # 2. RISK_VS_ANOMALY
        if risk_score < 40.0 and is_anomaly:
            conflicts.append({
                "conflict_type": "RISK_VS_ANOMALY",
                "affected_signals": ["XGBoost Risk (Low)", "IsolationForest Anomaly (Detected)"],
                "severity": "Medium",
                "required_action": "SIMULATE",
                "explanation": "Low attrition risk model prediction conflicts with a detected behavioral anomaly spike."
            })

        # 3. MODEL_VS_GRAPH
        if risk_score < 45.0 and is_single_point_of_failure:
            conflicts.append({
                "conflict_type": "MODEL_VS_GRAPH",
                "affected_signals": ["XGBoost Risk (Low)", "Graph Dependency (Single Point of Failure)"],
                "severity": "High",
                "required_action": "REVIEW",
                "explanation": "Low personal attrition risk masks high organizational dependency risk as a single point of failure."
            })

        # 4. INDIVIDUAL_VS_ORGANIZATIONAL
        if risk_score >= 70.0 and org_exposure < 25.0:
            conflicts.append({
                "conflict_type": "INDIVIDUAL_VS_ORGANIZATIONAL",
                "affected_signals": ["Personal Risk (Critical)", "Organizational Exposure (Low)"],
                "severity": "Low",
                "required_action": "WAIT",
                "explanation": "Critical personal attrition risk with low organizational exposure. Focus intervention on higher exposure roles first."
            })

        return conflicts

conflict_detector = ModelConflictDetector()
