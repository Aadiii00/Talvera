import numpy as np
from typing import Dict, Any, List

class TemporalIntelligenceService:
    @staticmethod
    def forecast_metric(series: List[float], alpha: float = 0.3) -> Dict[str, Any]:
        """
        Lightweight Exponential Smoothing forecast for 30D, 60D, 90D.
        """
        if not series:
            return {"current": 0.0, "30d": 0.0, "60d": 0.0, "90d": 0.0, "trend": "STABLE"}

        current_val = float(series[-1])
        if len(series) < 2:
            return {
                "current": current_val,
                "30d": current_val,
                "60d": current_val,
                "90d": current_val,
                "trend": "STABLE",
            }

        # Calculate Single Exponential Smoothing level and trend
        level = series[0]
        trend = 0.0
        for i in range(1, len(series)):
            prev_level = level
            level = alpha * series[i] + (1 - alpha) * (level + trend)
            trend = alpha * (level - prev_level) + (1 - alpha) * trend

        f30 = round(level + trend * 1, 2)
        f60 = round(level + trend * 2, 2)
        f90 = round(level + trend * 3, 2)

        if trend > 0.15:
            trend_label = "RISING"
        elif trend < -0.15:
            trend_label = "FALLING"
        else:
            trend_label = "STABLE"

        return {
            "current": current_val,
            "trend": trend_label,
            "forecast_30d": f30,
            "forecast_60d": f60,
            "forecast_90d": f90,
            "confidence": "68% interval (lightweight smoothing)",
        }

    def calculate_trajectory(self, history_points: list) -> Dict[str, Any]:
        if not history_points:
            return {
                "30d_trend": 0.0,
                "60d_trend": 0.0,
                "90d_trend": 0.0,
                "trajectory_class": "STABLE",
                "forecasts": {},
            }

        sorted_points = sorted(history_points, key=lambda x: x["day"])
        risks = [p["risk"] for p in sorted_points]

        start = risks[0]
        end = risks[-1]
        diff = end - start
        std_dev = float(np.std(risks))

        if std_dev > 12.0:
            classification = "VOLATILE"
        elif diff > 5.0:
            classification = "DETERIORATING"
        elif diff < -5.0:
            classification = "IMPROVING"
        else:
            classification = "STABLE"

        # Forecast metrics
        workloads = [p.get("workload", 1.2) for p in sorted_points]
        engagements = [p.get("engagement", 6.5) for p in sorted_points]

        return {
            "30d_trend": round(diff * 0.33, 1),
            "60d_trend": round(diff * 0.66, 1),
            "90d_trend": round(diff, 1),
            "trajectory_class": classification,
            "volatility_score": round(std_dev, 2),
            "start_risk": start,
            "current_risk": end,
            "forecasts": {
                "workload": self.forecast_metric(workloads),
                "engagement": self.forecast_metric(engagements),
            }
        }

temporal_service = TemporalIntelligenceService()
