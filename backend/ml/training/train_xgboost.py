import os
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    roc_auc_score, average_precision_score, precision_score,
    recall_score, f1_score, brier_score_loss
)
from backend.ml.data.generator import generate_synthetic_data
from backend.ml.features.pipeline import prepare_features, FEATURE_COLUMNS, FEATURE_SCHEMA_VERSION

MODEL_DIR = "backend/ml/artifacts"

def train_and_save_model():
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    csv_path = "backend/ml/data/synthetic_workforce.csv"
    if not os.path.exists(csv_path):
        df, _ = generate_synthetic_data()
    else:
        df = pd.read_csv(csv_path)
        
    X = prepare_features(df)
    y = df["attrition"]
    
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp)
    
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.05,
        random_state=42,
        eval_metric="logloss"
    )
    
    model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
    
    # Evaluate
    y_probs = model.predict_proba(X_test)[:, 1]
    y_preds = (y_probs >= 0.5).astype(int)
    
    metrics = {
        "roc_auc": round(float(roc_auc_score(y_test, y_probs)), 4),
        "pr_auc": round(float(average_precision_score(y_test, y_probs)), 4),
        "precision": round(float(precision_score(y_test, y_preds, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, y_preds, zero_division=0)), 4),
        "f1": round(float(f1_score(y_test, y_preds, zero_division=0)), 4),
        "brier_score": round(float(brier_score_loss(y_test, y_probs)), 4),
    }
    
    model_path = os.path.join(MODEL_DIR, "xgboost_model.joblib")
    meta_path = os.path.join(MODEL_DIR, "metadata.json")
    
    joblib.dump(model, model_path)
    
    metadata = {
        "model_type": "XGBoost",
        "feature_schema_version": FEATURE_SCHEMA_VERSION,
        "features": FEATURE_COLUMNS,
        "metrics": metrics,
        "timestamp": datetime.utcnow().isoformat(),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
    }
    
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)
        
    return model, metadata

if __name__ == "__main__":
    train_and_save_model()
