import os
import json
import joblib
import pandas as pd
from datetime import datetime
from backend.ml.features.pipeline import prepare_features
from backend.ml.training.train_xgboost import MODEL_DIR, train_and_save_model

class AttritionPredictor:
    def __init__(self):
        self.model_path = os.path.join(MODEL_DIR, "xgboost_model.joblib")
        self.meta_path = os.path.join(MODEL_DIR, "metadata.json")
        self.load_model()
        
    def load_model(self):
        if not os.path.exists(self.model_path) or not os.path.exists(self.meta_path):
            self.model, self.metadata = train_and_save_model()
        else:
            self.model = joblib.load(self.model_path)
            with open(self.meta_path) as f:
                self.metadata = json.load(f)

    def get_info(self):
        return self.metadata

    def predict_single(self, employee_id: str, record_dict: dict):
        df = pd.DataFrame([record_dict])
        X = prepare_features(df)
        prob = float(self.model.predict_proba(X)[0, 1])
        score = round(prob * 100.0, 1)
        
        if score >= 70:
            band = "Critical"
        elif score >= 50:
            band = "Support"
        elif score >= 35:
            band = "Protect"
        else:
            band = "Monitor"
            
        return {
            "employee_id": employee_id,
            "risk_score": score,
            "risk_band": band,
            "model_version": self.metadata.get("feature_schema_version", "v1.0"),
            "prediction_timestamp": datetime.utcnow().isoformat(),
        }

    def predict_batch(self, records: list):
        results = []
        for rec in records:
            emp_id = rec.get("employee_id", "UNKNOWN")
            res = self.predict_single(emp_id, rec)
            results.append(res)
        return results

predictor = AttritionPredictor()
