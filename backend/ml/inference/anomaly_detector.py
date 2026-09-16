import os
import joblib
import pandas as pd
from backend.ml.training.train_anomaly import MODEL_DIR, ANOMALY_FEATURES, train_and_save_anomaly_model

class AnomalyDetectorService:
    def __init__(self):
        self.model_path = os.path.join(MODEL_DIR, "isolation_forest.joblib")
        if not os.path.exists(self.model_path):
            self.model = train_and_save_anomaly_model()
        else:
            self.model = joblib.load(self.model_path)

    def detect_employee_anomaly(self, record_dict: dict) -> dict:
        df = pd.DataFrame([record_dict])
        for col in ANOMALY_FEATURES:
            if col not in df.columns:
                df[col] = 0.0

        X = df[ANOMALY_FEATURES]
        # predict returns -1 for outlier/anomaly, 1 for normal
        raw_pred = int(self.model.predict(X)[0])
        score = float(self.model.score_samples(X)[0]) # negative anomaly score
        
        is_anomaly = raw_pred == -1
        severity = "High" if score < -0.65 else ("Medium" if is_anomaly else "Low")

        evidence = []
        if record_dict.get("workload_index", 1.0) > 1.8:
            evidence.append("Severe workload index spike (>1.8)")
        if record_dict.get("overtime_hours", 0) > 15:
            evidence.append("Unusual overtime hours (>15h)")
        if record_dict.get("absenteeism_rate", 0) > 10:
            evidence.append("Elevated absenteeism rate anomaly (>10%)")
        if record_dict.get("engagement_score", 7.0) < 5.0:
            evidence.append("Sudden engagement score dip (<5.0)")

        return {
            "employee_id": record_dict.get("employee_id", "UNKNOWN"),
            "is_anomaly": is_anomaly,
            "anomaly_score": round(abs(score), 4),
            "severity": severity,
            "affected_team": record_dict.get("team", "General"),
            "evidence": evidence if evidence else ["Pattern within expected behavioral distribution"],
        }

anomaly_detector = AnomalyDetectorService()
