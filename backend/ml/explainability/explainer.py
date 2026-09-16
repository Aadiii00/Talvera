import shap
import pandas as pd
from backend.ml.inference.predictor import predictor
from backend.ml.features.pipeline import prepare_features

class ShapExplainerService:
    def __init__(self):
        self.model = predictor.model
        self.explainer = shap.TreeExplainer(self.model)

    def explain_employee(self, record_dict: dict) -> dict:
        df = pd.DataFrame([record_dict])
        X = prepare_features(df)
        shap_values = self.explainer(X)
        
        values = shap_values.values[0]
        feature_names = X.columns.tolist()
        feature_vals = X.iloc[0].to_dict()
        
        drivers = []
        for name, val, val_raw in zip(feature_names, values, feature_vals.values()):
            drivers.append({
                "feature": name,
                "feature_value": float(val_raw),
                "shap_value": round(float(val), 4),
                "direction": "INCREASES_RISK" if val > 0 else "DECREASES_RISK",
                "contribution": round(abs(float(val)), 4)
            })
            
        drivers.sort(key=lambda x: x["contribution"], reverse=True)
        
        return {
            "top_drivers": drivers[:5],
            "all_drivers": drivers,
            "base_value": round(float(shap_values.base_values[0]), 4),
        }

    def get_global_importance(self, df_sample: pd.DataFrame) -> list:
        X = prepare_features(df_sample)
        shap_values = self.explainer(X)
        mean_abs_shap = abs(shap_values.values).mean(axis=0)
        
        feature_names = X.columns.tolist()
        importance = [
            {"feature": name, "importance": round(float(score), 4)}
            for name, score in zip(feature_names, mean_abs_shap)
        ]
        importance.sort(key=lambda x: x["importance"], reverse=True)
        return importance

explainer = ShapExplainerService()
