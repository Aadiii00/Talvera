from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from backend.app.database.session import get_db, Base, engine
from backend.app.models.domain import Employee, Decision, Workflow, Outcome
from backend.ml.inference.predictor import predictor
from backend.ml.inference.anomaly_detector import anomaly_detector
from backend.ml.inference.intervention_effects import intervention_effect_engine
from backend.ml.explainability.explainer import explainer
from backend.app.services.temporal import temporal_service
from backend.graph.graph_service import graph_service
from backend.simulation.cascade_engine import cascade_engine
from backend.simulation.counterfactual_engine import counterfactual_engine
from backend.simulation.futures_engine import futures_engine
from backend.simulation.digital_twin import digital_twin_service
from backend.optimization.optimizer import intervention_optimizer
from backend.rag.policy_rag import policy_rag
from backend.agents.qwen_agent import qwen_agent
from backend.governance.firewall import decision_firewall
from backend.governance.robustness import robustness_engine
from backend.app.services.decision_service import decision_service
from backend.workflows.enterpro_adapter import enterpro_adapter
from backend.memory.organizational_memory import organizational_memory
from backend.app.services.model_registry import model_registry
from backend.app.services.orchestrator import intelligence_orchestrator
from backend.app.services.conflict_detector import conflict_detector

router = APIRouter()

# Schemas
class PredictRequest(BaseModel):
    employee_id: str
    record: dict

class AnomalyRequest(BaseModel):
    record: dict

class ExplainRequest(BaseModel):
    record: dict

class CascadeDeepRequest(BaseModel):
    employee_id: str
    record: dict
    depth: Optional[int] = 2

class CounterfactualRequest(BaseModel):
    record: dict
    feature_changes: dict

class ScenarioRequest(BaseModel):
    scenario_key: str
    horizon_days: Optional[int] = 90

class DigitalTwinSimulateRequest(BaseModel):
    scenario: str
    target_department: Optional[str] = None

class PortfolioOptimizationRequest(BaseModel):
    budget_limit: Optional[float] = 50000.0
    training_capacity: Optional[int] = 50
    hiring_available: Optional[int] = 20
    salary_limit: Optional[float] = 30000.0
    selected_interventions: Optional[List[str]] = None

class PolicySearchRequest(BaseModel):
    query: str

class AgentAskRequest(BaseModel):
    question: str
    employee_id: Optional[str] = "rahul-sharma"

class InterventionEffectRequest(BaseModel):
    record: dict
    intervention_type: str

class InterventionCompareRequest(BaseModel):
    record: dict
    intervention_types: Optional[List[str]] = None

class ConflictDetectRequest(BaseModel):
    risk_score: float
    trajectory_class: str
    is_anomaly: bool
    org_exposure: float
    is_single_point_of_failure: bool

class DecisionRobustnessRequest(BaseModel):
    employee_id: str
    recommendation: str
    baseline_risk: float
    evidence_count: Optional[int] = 5
    has_conflict: Optional[bool] = False

class DecisionCreateRequest(BaseModel):
    employee_id: str
    human_context: Optional[str] = None

class OutcomeRecordRequest(BaseModel):
    workflow_id: str
    expected_change: float
    actual_change: float

# Model Registry
@router.get("/models")
def list_models():
    return model_registry.list_models()

@router.get("/models/{model_name}")
def get_model(model_name: str):
    return model_registry.get_model(model_name)

# ML Endpoints
@router.get("/ml/model-info")
def get_model_info():
    return predictor.get_info()

@router.post("/ml/predict")
def predict_attrition(req: PredictRequest):
    return predictor.predict_single(req.employee_id, req.record)

@router.post("/ml/batch-predict")
def batch_predict(records: List[dict]):
    return predictor.predict_batch(records)

@router.post("/ml/explain/{employee_id}")
def explain_employee(employee_id: str, req: ExplainRequest):
    return explainer.explain_employee(req.record)

# Anomaly & Intelligence
@router.post("/intelligence/anomaly")
def detect_anomaly(req: AnomalyRequest):
    return anomaly_detector.detect_employee_anomaly(req.record)

@router.get("/intelligence/employee/{employee_id}")
def get_employee_intelligence(employee_id: str, db: Session = Depends(get_db)):
    return intelligence_orchestrator.orchestrate_employee_intelligence(db, employee_id)

@router.get("/intelligence/workforce")
def get_workforce_intelligence(db: Session = Depends(get_db)):
    return intelligence_orchestrator.orchestrate_workforce_intelligence(db)

@router.post("/intelligence/conflicts")
def detect_model_conflicts(req: ConflictDetectRequest):
    return conflict_detector.detect_conflicts(
        req.risk_score, req.trajectory_class, req.is_anomaly, req.org_exposure, req.is_single_point_of_failure
    )

# Graph Endpoints
@router.get("/graph/employee/{employee_id}")
def get_employee_graph(employee_id: str):
    return graph_service.get_employee_graph(employee_id)

@router.get("/graph/team/{team_id}")
def get_team_graph(team_id: str):
    return graph_service.get_team_graph(team_id)

@router.get("/graph/skill/{skill_id}")
def get_skill_graph(skill_id: str):
    return graph_service.get_skill_graph(skill_id)

# Intervention Effect Engine
@router.post("/interventions/effect")
def estimate_intervention_effect(req: InterventionEffectRequest):
    return intervention_effect_engine.estimate_effect(req.record, req.intervention_type)

@router.post("/interventions/compare")
def compare_interventions(req: InterventionCompareRequest):
    return intervention_effect_engine.compare_interventions(req.record, req.intervention_types)

@router.get("/interventions/effectiveness")
def get_intervention_effectiveness(db: Session = Depends(get_db)):
    return organizational_memory.get_intervention_effectiveness(db)

# Digital Twin
@router.get("/digital-twin/state")
def get_digital_twin_state(db: Session = Depends(get_db)):
    return digital_twin_service.get_current_state(db).get_summary()

@router.post("/digital-twin/simulate")
def simulate_digital_twin(req: DigitalTwinSimulateRequest, db: Session = Depends(get_db)):
    return digital_twin_service.simulate_state_scenario(db, req.scenario, req.target_department)

# Temporal & Propagation
@router.get("/intelligence/trajectory/{employee_id}")
def get_trajectory(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    history = [
        {"day": d, "risk": max(0, min(100, (emp.attrition_risk if emp else 70) + (d/90.0)*5 - 2))}
        for d in range(0, 95, 5)
    ]
    return temporal_service.calculate_trajectory(history)

@router.get("/propagation/{employee_id}")
def get_propagation(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    rec = {"name": emp.name if emp else employee_id, "department": emp.department if emp else "Engineering", "team": emp.team if emp else "Platform", "critical_skills": emp.critical_skills if emp else "Kubernetes"}
    return cascade_engine.simulate_deep_cascade(employee_id, rec, depth=2)

@router.post("/propagation/simulate")
def simulate_propagation(req: CascadeDeepRequest):
    return cascade_engine.simulate_deep_cascade(req.employee_id, req.record, depth=req.depth or 2)

# Deep Cascade Engine
@router.post("/simulation/cascade")
@router.post("/cascade/deep")
def run_deep_cascade(req: CascadeDeepRequest):
    return cascade_engine.simulate_deep_cascade(req.employee_id, req.record, depth=req.depth or 2)

# Simulation & Portfolio Optimization
@router.post("/simulation/counterfactual")
def run_counterfactual(req: CounterfactualRequest):
    return counterfactual_engine.run_counterfactual(req.record, req.feature_changes)

@router.post("/simulation/scenario")
def run_scenario(req: ScenarioRequest):
    return futures_engine.simulate_scenario(req.scenario_key, req.horizon_days)

@router.post("/simulation/compare")
def compare_scenarios(horizon_days: Optional[int] = 90):
    return futures_engine.compare_scenarios(horizon_days)

@router.post("/optimization/interventions")
@router.post("/optimization/portfolio")
def optimize_portfolio(req: PortfolioOptimizationRequest):
    res = intervention_optimizer.optimize_portfolio(
        budget_limit=req.budget_limit,
        training_capacity=req.training_capacity,
        hiring_available=req.hiring_available,
        salary_limit=req.salary_limit,
        selected_names=req.selected_interventions
    )
    res["recommended_interventions"] = res["selected_interventions"]
    return res

# Policy RAG & Qwen Agent
@router.post("/policies/search")
def search_policies(req: PolicySearchRequest):
    return policy_rag.search_policies(req.query)

@router.post("/agent/ask")
def ask_qwen_agent(req: AgentAskRequest):
    return qwen_agent.ask(req.question, req.employee_id)

# Decision Governance & Robustness
@router.post("/decision/robustness")
def test_decision_robustness(req: DecisionRobustnessRequest):
    return robustness_engine.test_robustness(req.employee_id, req.recommendation, req.baseline_risk, req.evidence_count or 5, req.has_conflict or False)

@router.post("/decision/evaluate")
def evaluate_decision_firewall(employee_id: str, risk_score: float, evidence_count: int = 5):
    return decision_firewall.evaluate_decision(employee_id, risk_score, evidence_count, 88.0)

# Decision System & Memory
@router.post("/decisions")
def create_decision(req: DecisionCreateRequest, db: Session = Depends(get_db)):
    return decision_service.create_decision(db, req.employee_id, req.human_context)

@router.get("/decisions")
def list_decisions(db: Session = Depends(get_db)):
    decisions = db.query(Decision).all()
    return [{"id": d.id, "employee_id": d.employee_id, "action": d.action, "status": d.human_status} for d in decisions]

@router.get("/decisions/{id}")
def get_decision(id: str, db: Session = Depends(get_db)):
    d = db.query(Decision).filter(Decision.id == id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Decision not found")
    return {"id": d.id, "employee_id": d.employee_id, "action": d.action, "status": d.human_status, "notes": d.human_notes}

@router.post("/decisions/{id}/approve")
def approve_decision(id: str, approver: str = "Sarah Jenkins", db: Session = Depends(get_db)):
    res = decision_service.approve_decision(db, id, approver)
    d = db.query(Decision).filter(Decision.id == id).first()
    if d:
        wf_res = enterpro_adapter.create_workflow(db, id, f"Retention Workflow - {d.employee_id}", d.employee_id, "Workload redistribution")
        enterpro_adapter.execute_workflow(db, wf_res["workflow_id"])
    return res

@router.get("/memory")
def get_memory(db: Session = Depends(get_db)):
    return organizational_memory.get_memory_entries(db)

@router.get("/memory/insights")
def get_memory_insights(db: Session = Depends(get_db)):
    return organizational_memory.get_memory_insights(db)

@router.get("/memory/{decision_id}")
def get_decision_replay(decision_id: str, db: Session = Depends(get_db)):
    return organizational_memory.get_decision_replay(db, decision_id)

@router.post("/outcomes")
@router.post("/memory/outcome")
def record_outcome(req: OutcomeRecordRequest, db: Session = Depends(get_db)):
    return enterpro_adapter.record_workflow_outcome(db, req.workflow_id, req.expected_change, req.actual_change)
