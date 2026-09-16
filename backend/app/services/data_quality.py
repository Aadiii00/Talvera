import pandas as pd
from typing import Dict, Any, List

class DataQualityService:
    @staticmethod
    def audit_dataframe(df: pd.DataFrame) -> Dict[str, Any]:
        issues: List[str] = []
        warnings: List[str] = []
        affected_count = 0
        
        # Check missing values
        null_counts = df.isnull().sum()
        for col, count in null_counts.items():
            if count > 0:
                warnings.append(f"Column '{col}' has {count} missing values.")
                affected_count += int(count)
                
        # Check duplicates
        duplicate_rows = int(df.duplicated(subset=["employee_id"]).sum())
        if duplicate_rows > 0:
            issues.append(f"Found {duplicate_rows} duplicate employee IDs.")
            affected_count += duplicate_rows
            
        # Check invalid numerical bounds
        if (df["engagement_score"] < 0).any() or (df["engagement_score"] > 10).any():
            issues.append("Invalid engagement scores found outside range [0, 10].")
            
        if (df["workload_index"] < 0).any():
            issues.append("Negative workload index values detected.")
            
        # Check outliers (e.g. absenteeism > 50%)
        outliers = (df["absenteeism_rate"] > 50).sum()
        if outliers > 0:
            warnings.append(f"Detected {outliers} extreme absenteeism rate outliers (>50%).")
            
        status = "PASSED" if len(issues) == 0 else "FAILED"
        if len(issues) == 0 and len(warnings) > 0:
            status = "WARNINGS"
            
        return {
            "quality_status": status,
            "total_records": len(df),
            "issues": issues,
            "warnings": warnings,
            "affected_records": affected_count,
        }
