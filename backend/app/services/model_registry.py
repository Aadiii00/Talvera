from datetime import datetime
from typing import Dict, Any, List

class ModelRegistryService:
    def __init__(self):
        self.registry = {
            "talvera-xgboost": {
                "model_name": "talvera-xgboost",
                "model_type": "Gradient Boosted Trees (XGBoost)",
                "version": "v2.3",
                "training_date": "2026-09-16",
                "training_dataset": "synthetic_workforce_v1.csv (3000 samples)",
                "feature_schema": "v1.0 (19 features)",
                "metrics": {"roc_auc": 0.884, "pr_auc": 0.762, "f1": 0.741},
                "artifact_path": "backend/ml/artifacts/xgboost_model.joblib",
                "status": "ACTIVE",
            },
            "talvera-anomaly": {
                "model_name": "talvera-anomaly",
                "model_type": "Isolation Forest",
                "version": "v1.0",
                "training_date": "2026-09-16",
                "training_dataset": "synthetic_workforce_v1.csv (3000 samples)",
                "feature_schema": "v1.0 (6 behavioral features)",
                "metrics": {"contamination_rate": 0.08},
                "artifact_path": "backend/ml/artifacts/isolation_forest.joblib",
                "status": "ACTIVE",
            },
            "talvera-temporal": {
                "model_name": "talvera-temporal",
                "model_type": "Single Exponential Smoothing & AR Trend",
                "version": "v1.2",
                "training_date": "Dynamic",
                "training_dataset": "Workforce event historical series",
                "feature_schema": "v1.0 (time series risk/workload/engagement)",
                "metrics": {"smoothing_alpha": 0.3},
                "artifact_path": "In-Memory Service",
                "status": "ACTIVE",
            },
            "talvera-embedding": {
                "model_name": "talvera-embedding",
                "model_type": "Chroma Vector DB / Sentence Transformer",
                "version": "v1.0",
                "training_date": "2026-09-16",
                "training_dataset": "Talvera Policy Handbook Collection",
                "feature_schema": "384-dim semantic embeddings",
                "metrics": {"vector_collection": "policies"},
                "artifact_path": "ChromaDB Persistent Store",
                "status": "ACTIVE",
            },
        }

    def list_models(self) -> List[Dict[str, Any]]:
        return list(self.registry.values())

    def get_model(self, model_name: str) -> Dict[str, Any]:
        return self.registry.get(model_name, {"error": "Model not found in registry"})

model_registry = ModelRegistryService()
