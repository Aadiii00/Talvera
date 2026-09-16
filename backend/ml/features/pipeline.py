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

def prepare_features(df: pd.DataFrame) -> pd.DataFrame:
    X = df.copy()
    
    # Transform booleans / categories to numeric
    X["manager_change_recent"] = X["manager_change_recent"].astype(int)
    X["critical_project"] = X["critical_project"].astype(int)
    X["recent_policy_change"] = X["recent_policy_change"].astype(int)
    X["is_critical_skill_scarcity"] = (X["skill_scarcity"] == "Critical").astype(int)
    
    return X[FEATURE_COLUMNS]

def get_feature_schema():
    return {
        "version": FEATURE_SCHEMA_VERSION,
        "feature_count": len(FEATURE_COLUMNS),
        "features": FEATURE_COLUMNS,
    }
