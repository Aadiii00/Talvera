import numpy as np
from typing import Dict, Any

class TemporalIntelligenceService:
    @staticmethod
    def calculate_trajectory(history_points: list) -> Dict[str, Any]:
        """
        history_points: list of dicts with {"day": 0..90, "risk": float, "engagement": float, "workload": float}
        """
        if not history_points:
            return {
                "30d_trend": 0.0,
                "60d_trend": 0.0,
                "90d_trend": 0.0,
                "trajectory_class": "STABLE",
            }
            
        sorted_points = sorted(history_points, key=lambda x: x["day"])
        risks = [p["risk"] for p in sorted_points]
        
        start = risks[0]
        end = risks[-1]
        diff = end - start
        
        # Standard deviation for volatility
        std_dev = float(np.std(risks))
        
        if std_dev > 12.0:
            classification = "VOLATILE"
        elif diff > 5.0:
            classification = "DETERIORATING"
        elif diff < -5.0:
            classification = "IMPROVING"
        else:
            classification = "STABLE"
            
        return {
            "30d_trend": round(diff * 0.33, 1),
            "60d_trend": round(diff * 0.66, 1),
            "90d_trend": round(diff, 1),
            "trajectory_class": classification,
            "volatility_score": round(std_dev, 2),
            "start_risk": start,
            "current_risk": end,
        }

temporal_service = TemporalIntelligenceService()
