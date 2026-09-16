from ortools.linear_solver import pywraplp
from typing import Dict, Any, List

class InterventionOptimizer:
    @staticmethod
    def optimize_interventions(
        budget_limit: float = 50000.0,
        training_capacity: int = 50,
        candidates: List[dict] = None
    ) -> Dict[str, Any]:
        """
        OR-Tools Integer Programming Solver for Workforce Interventions.
        """
        if not candidates:
            candidates = [
                {"id": "comp", "name": "Compensation Adjustment", "cost": 8600, "risk_reduction": 22, "capacity_used": 0},
                {"id": "training", "name": "Training & Upskilling", "cost": 2200, "risk_reduction": 14, "capacity_used": 1},
                {"id": "workload", "name": "Workload Reduction", "cost": 1400, "risk_reduction": 18, "capacity_used": 0},
                {"id": "mobility", "name": "Internal Mobility", "cost": 3100, "risk_reduction": 16, "capacity_used": 0},
                {"id": "manager", "name": "Manager Intervention", "cost": 900, "risk_reduction": 11, "capacity_used": 0},
            ]
            
        solver = pywraplp.Solver.CreateSolver("SCIP")
        if not solver:
            solver = pywraplp.Solver.CreateSolver("CBC")
            
        x = {}
        for c in candidates:
            x[c["id"]] = solver.BoolVar(c["id"])
            
        # Budget constraint
        solver.Add(solver.Sum([c["cost"] * x[c["id"]] for c in candidates]) <= budget_limit)
        
        # Capacity constraint
        solver.Add(solver.Sum([c["capacity_used"] * x[c["id"]] for c in candidates]) <= training_capacity)
        
        # Objective: Maximize total risk reduction
        objective = solver.Objective()
        for c in candidates:
            objective.SetCoefficient(x[c["id"]], float(c["risk_reduction"]))
        objective.SetMaximization()
        
        status = solver.Solve()
        
        recommended = []
        total_cost = 0.0
        total_risk_reduction = 0.0
        
        if status in (pywraplp.Solver.OPTIMAL, pywraplp.Solver.FEASIBLE):
            for c in candidates:
                if x[c["id"]].solution_value() > 0.5:
                    recommended.append(c["name"])
                    total_cost += c["cost"]
                    total_risk_reduction += c["risk_reduction"]
                    
        roi = round((total_risk_reduction * 4200.0) / total_cost, 1) if total_cost > 0 else 0.0
        
        return {
            "solver_status": "OPTIMAL" if status == pywraplp.Solver.OPTIMAL else "FEASIBLE",
            "recommended_interventions": recommended,
            "total_cost": total_cost,
            "expected_risk_reduction": total_risk_reduction,
            "roi": roi,
            "budget_limit": budget_limit,
            "budget_remaining": budget_limit - total_cost,
        }

intervention_optimizer = InterventionOptimizer()
