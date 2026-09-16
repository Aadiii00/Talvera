import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from backend.ml.data.generator import generate_synthetic_data

MODEL_DIR = "backend/ml/artifacts"

ANOMALY_FEATURES = [
    "workload_index",
    "engagement_score",
    "absenteeism_rate",
    "overtime_hours",
    "performance_score",
    "manager_relationship_score"
]

def train_and_save_anomaly_model():
    os.makedirs(MODEL_DIR, exist_ok=True)
    csv_path = "backend/ml/data/synthetic_workforce.csv"
    if not os.path.exists(csv_path):
        df, _ = generate_synthetic_data()
    else:
        df = pd.read_csv(csv_path)

    X = df[ANOMALY_FEATURES].copy()

    iso = IsolationForest(
        n_estimators=100,
        contamination=0.08,
        random_state=42
    )
    iso.fit(X)

    model_path = os.path.join(MODEL_DIR, "isolation_forest.joblib")
    joblib.dump(iso, model_path)
    return iso

if __name__ == "__main__":
    train_and_save_anomaly_model()
