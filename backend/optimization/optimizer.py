from ortools.linear_solver import pywraplp
from typing import Dict, Any, List

ALL_CANDIDATES_INR = [
    {"id": "comp", "name": "Compensation Adjustment", "cost": 86000, "risk_reduction": 22, "training_cap": 0, "salary_cost": 86000, "affected": 46, "impact": "Low"},
    {"id": "training", "name": "Training & Upskilling", "cost": 22000, "risk_reduction": 14, "training_cap": 10, "salary_cost": 0, "affected": 118, "impact": "Medium"},
    {"id": "workload", "name": "Workload Reduction", "cost": 14000, "risk_reduction": 18, "training_cap": 0, "salary_cost": 0, "affected": 73, "impact": "Medium"},
    {"id": "mobility", "name": "Internal Mobility", "cost": 31000, "risk_reduction": 16, "training_cap": 0, "salary_cost": 0, "affected": 34, "impact": "Medium"},
    {"id": "manager", "name": "Manager Intervention", "cost": 9000, "risk_reduction": 11, "training_cap": 0, "salary_cost": 0, "affected": 61, "impact": "Low"},
    {"id": "hiring", "name": "Hiring Backfill", "cost": 215000, "risk_reduction": 9, "training_cap": 0, "salary_cost": 215000, "affected": 12, "impact": "High"},
]

def format_inr(val: float) -> str:
    return f"₹{val:,.0f}"

class InterventionOptimizer:
    @staticmethod
    def optimize_portfolio(
        budget_limit: float = 500000.0,
        training_capacity: int = 50,
        hiring_available: int = 20,
        salary_limit: float = 300000.0,
        selected_names: List[str] = None
    ) -> Dict[str, Any]:
        """
        OR-Tools Integer Programming Solver for Portfolio Interventions in INR.
        """
        candidates = ALL_CANDIDATES_INR
        if selected_names and len(selected_names) > 0:
            filtered = [c for c in ALL_CANDIDATES_INR if c["name"] in selected_names]
            if len(filtered) > 0:
                candidates = filtered

        min_cost = min(c["cost"] for c in candidates)
        if budget_limit < min_cost:
            return {
                "solver_status": "NO_FEASIBLE_PLAN",
                "blocking_constraint": f"Budget limit ({format_inr(budget_limit)}) is below minimum intervention cost ({format_inr(min_cost)}).",
                "selected_interventions": [],
                "portfolio_cost": 0,
                "estimated_risk_change": 0,
                "affected_employees": 0,
                "roi": "N/A",
                "tradeoffs": "Increase budget constraint to generate a feasible plan."
            }

        solver = pywraplp.Solver.CreateSolver("SCIP")
        if not solver:
            solver = pywraplp.Solver.CreateSolver("CBC")

        x = {}
        for c in candidates:
            x[c["id"]] = solver.BoolVar(c["id"])

        # Budget constraint
        solver.Add(solver.Sum([c["cost"] * x[c["id"]] for c in candidates]) <= budget_limit)

        # Training capacity constraint
        solver.Add(solver.Sum([c["training_cap"] * x[c["id"]] for c in candidates]) <= training_capacity)

        # Salary constraint
        solver.Add(solver.Sum([c["salary_cost"] * x[c["id"]] for c in candidates]) <= salary_limit)

        # Objective: Maximize total risk reduction
        objective = solver.Objective()
        for c in candidates:
            objective.SetCoefficient(x[c["id"]], float(c["risk_reduction"]))
        objective.SetMaximization()

        status = solver.Solve()

        recommended = []
        breakdown = []
        portfolio_cost = 0.0
        total_risk_reduction = 0.0
        total_affected = 0

        if status in (pywraplp.Solver.OPTIMAL, pywraplp.Solver.FEASIBLE):
            for c in candidates:
                if x[c["id"]].solution_value() > 0.5:
                    recommended.append(c["name"])
                    portfolio_cost += c["cost"]
                    total_risk_reduction += c["risk_reduction"]
                    total_affected += c["affected"]
                    breakdown.append({
                        "name": c["name"],
                        "cost": c["cost"],
                        "cost_formatted": format_inr(c["cost"]),
                        "risk_effect": -c["risk_reduction"],
                        "affected": c["affected"],
                        "impact": c["impact"]
                    })

        if not recommended:
            return {
                "solver_status": "NO_FEASIBLE_PLAN",
                "blocking_constraint": f"Salary constraint ({format_inr(salary_limit)}) or Training Capacity ({training_capacity}%) blocked selected candidate interventions.",
                "selected_interventions": [],
                "portfolio_cost": 0,
                "estimated_risk_change": 0,
                "affected_employees": 0,
                "roi": "N/A",
                "tradeoffs": "Adjust constraints to generate a feasible portfolio."
            }

        roi = round((total_risk_reduction * 42000.0) / portfolio_cost, 1) if portfolio_cost > 0 else "N/A"

        return {
            "solver_status": "OPTIMAL" if status == pywraplp.Solver.OPTIMAL else "FEASIBLE",
            "selected_interventions": recommended,
            "portfolio_cost": portfolio_cost,
            "portfolio_cost_formatted": format_inr(portfolio_cost),
            "budget_limit": budget_limit,
            "budget_remaining": budget_limit - portfolio_cost,
            "budget_remaining_formatted": format_inr(budget_limit - portfolio_cost),
            "estimated_risk_change": -total_risk_reduction,
            "cascade_change": -round(total_risk_reduction * 1.4, 1),
            "affected_employees": total_affected,
            "skill_impact": min(95, int(total_risk_reduction * 1.8)),
            "operational_impact": "High" if any(c["impact"] == "High" for c in breakdown) else "Medium",
            "roi": roi,
            "breakdown": breakdown,
            "tradeoffs": "Requires manager 1:1 bandwidth and Q3 training budget allocation.",
            "evidence": [
                {"signal": "XGBoost Risk", "value": "HIGH RISK (78% baseline)"},
                {"signal": "Temporal Signal", "value": "DETERIORATING trajectory over 60 days"},
                {"signal": "Organizational Exposure", "value": "HIGH (94% exposure on Platform team)"},
                {"signal": "Cascade Exposure", "value": "92.0 cascade score with 14 impacted teammates"},
                {"signal": "Intervention Effect", "value": f"-{total_risk_reduction} pts estimated risk reduction"},
                {"signal": "Scenario Result", "value": "90D projected risk reduction to 35%"},
                {"signal": "Optimizer Constraints", "value": f"Budget feasible ({format_inr(portfolio_cost)} / {format_inr(budget_limit)})"},
            ]
        }

intervention_optimizer = InterventionOptimizer()
