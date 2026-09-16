import pandas as pd
import numpy as np
from typing import Tuple, List

FEATURE_SCHEMA_VERSION = "v1.0"

FEATURE_COLUMNS: List[str] = [
    "tenure_years",
    "performance_score",
    "engagement_score",
    "absenteeism_rate",
    "workload_index",
    "salary",
    "pay_vs_market",
    "promotions_last_3_years",
    "training_hours",
    "skill_growth_score",
    "manager_change_recent",
    "manager_relationship_score",
    "job_satisfaction",
    "overtime_hours",
    "remote_work_ratio",
    "projects_count",
    "critical_project",
    "is_critical_skill_scarcity",
    "recent_policy_change",
]

DEFAULT_FEATURE_VALUES = {
    "tenure_years": 3.0,
    "performance_score": 3.5,
    "engagement_score": 6.5,
    "absenteeism_rate": 2.0,
    "workload_index": 1.2,
    "salary": 120000.0,
    "pay_vs_market": 1.0,
    "promotions_last_3_years": 0,
    "training_hours": 15.0,
    "skill_growth_score": 50.0,
    "manager_change_recent": 0,
    "manager_relationship_score": 7.0,
    "job_satisfaction": 7.0,
    "overtime_hours": 5.0,
    "remote_work_ratio": 0.5,
    "projects_count": 2,
    "critical_project": 0,
    "is_critical_skill_scarcity": 0,
    "recent_policy_change": 0,
}

def prepare_features(df: pd.DataFrame) -> pd.DataFrame:
    X = df.copy()

    for col in FEATURE_COLUMNS:
        if col not in X.columns:
            if col == "is_critical_skill_scarcity":
                X["is_critical_skill_scarcity"] = (X.get("skill_scarcity", "Low") == "Critical").astype(int) if "skill_scarcity" in X.columns else 0
            else:
                X[col] = DEFAULT_FEATURE_VALUES.get(col, 0)

    # Convert booleans to int
    X["manager_change_recent"] = X["manager_change_recent"].astype(int)
    X["critical_project"] = X["critical_project"].astype(int)
    X["recent_policy_change"] = X["recent_policy_change"].astype(int)
    if "is_critical_skill_scarcity" in X.columns:
        X["is_critical_skill_scarcity"] = X["is_critical_skill_scarcity"].astype(int)

    return X[FEATURE_COLUMNS]

def get_feature_schema():
    return {
        "version": FEATURE_SCHEMA_VERSION,
        "feature_count": len(FEATURE_COLUMNS),
        "features": FEATURE_COLUMNS,
    }
