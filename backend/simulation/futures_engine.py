from typing import Dict, Any, List

class FuturesScenarioEngine:
    SCENARIO_PROFILES = {
        "DO_NOTHING": {"risk_delta": +5, "cost": 0, "disruption": "Medium"},
        "TRAINING": {"risk_delta": -8, "cost": 220, "disruption": "Low"},
        "WORKLOAD_REDUCTION": {"risk_delta": -13, "cost": 140, "disruption": "Medium"},
        "INTERNAL_MOBILITY": {"risk_delta": -10, "cost": 310, "disruption": "Medium"},
        "COMPENSATION": {"risk_delta": -15, "cost": 420, "disruption": "Low"},
        "MANAGER_INTERVENTION": {"risk_delta": -7, "cost": 90, "disruption": "Low"},
        "HIRING": {"risk_delta": -6, "cost": 650, "disruption": "High"},
        "COMBINED": {"risk_delta": -19, "cost": 680, "disruption": "Low"},
    }

    def simulate_scenario(self, scenario_key: str, horizon_days: int = 90) -> Dict[str, Any]:
        profile = self.SCENARIO_PROFILES.get(scenario_key.upper(), self.SCENARIO_PROFILES["DO_NOTHING"])
        
        base_risk = 34.0
        base_team_health = 61.0
        base_skill_exp = 58.0
        base_proj_exp = 52.0
        
        factor = horizon_days / 90.0
        
        sim_risk = max(5.0, min(95.0, round(base_risk + profile["risk_delta"] * factor, 1)))
        sim_health = min(98.0, max(30.0, round(base_team_health - profile["risk_delta"] * 1.2 * factor, 1)))
        sim_skill_exp = max(10.0, round(base_skill_exp + profile["risk_delta"] * 1.1 * factor, 1))
        sim_proj_exp = max(10.0, round(base_proj_exp + profile["risk_delta"] * 1.0 * factor, 1))
        
        return {
            "scenario": scenario_key.upper(),
            "horizon_days": horizon_days,
            "projected_metrics": {
                "attrition_risk": sim_risk,
                "team_health": sim_health,
                "skill_exposure": sim_skill_exp,
                "project_exposure": sim_proj_exp,
                "estimated_cost_k": int(profile["cost"] * factor),
                "operational_disruption": profile["disruption"],
            },
            "disclaimer": "DISCLAIMER: Simulation result based on scenario assumptions and XGBoost feature models. Not a guaranteed outcome."
        }

    def compare_scenarios(self, horizons_days: int = 90) -> List[Dict[str, Any]]:
        comparison = []
        for key in ["DO_NOTHING", "WORKLOAD_REDUCTION", "COMPENSATION", "COMBINED"]:
            res = self.simulate_scenario(key, horizons_days)
            comparison.append({
                "label": key,
                **res["projected_metrics"]
            })
        return comparison

futures_engine = FuturesScenarioEngine()
