from typing import Dict, Any, List

class TaskRouter:
    @staticmethod
    def route_intent(question: str) -> str:
        q = question.lower()
        if "leave" in q or "depart" in q or "cascade" in q:
            return "CASCADE_ANALYSIS"
        elif "anomaly" in q or "spike" in q or "unusual" in q:
            return "ANOMALY_INVESTIGATION"
        elif "policy" in q or "allow" in q or "handbook" in q:
            return "POLICY_QUERY"
        elif "optimi" in q or "budget" in q or "portfolio" in q:
            return "INTERVENTION_OPTIMIZATION"
        elif "scenario" in q or "future" in q or "simulat" in q:
            return "SCENARIO_SIMULATION"
        elif "trend" in q or "trajectory" in q or "forecast" in q:
            return "WORKFORCE_TREND"
        elif "why" in q or "cause" in q or "driver" in q:
            return "CAUSE_ANALYSIS"
        elif "risk" in q:
            return "RISK_ANALYSIS"
        else:
            return "GENERAL_WORKFORCE_QUERY"

task_router = TaskRouter()
