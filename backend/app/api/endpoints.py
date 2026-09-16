from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from backend.app.database.session import get_db, Base, engine
from backend.app.models.domain import Employee, Decision, Workflow, Outcome
from backend.ml.inference.predictor import predictor
from backend.ml.inference.anomaly_detector import anomaly_detector
from backend.ml.explainability.explainer import explainer
from backend.app.services.temporal import temporal_service
from backend.graph.graph_service import graph_service
from backend.simulation.cascade_engine import cascade_engine
from backend.simulation.counterfactual_engine import counterfactual_engine
from backend.simulation.futures_engine import futures_engine
from backend.optimization.optimizer import intervention_optimizer
from backend.rag.policy_rag import policy_rag
from backend.agents.qwen_agent import qwen_agent
from backend.governance.firewall import decision_firewall
from backend.app.services.decision_service import decision_service
from backend.workflows.enterpro_adapter import enterpro_adapter
from backend.memory.organizational_memory import organizational_memory
from backend.app.services.model_registry import model_registry
from backend.app.services.orchestrator import intelligence_orchestrator

router = APIRouter()

# Schema models
class PredictRequest(BaseModel):
    employee_id: str
    record: dict

class AnomalyRequest(BaseModel):
    record: dict

class ExplainRequest(BaseModel):
    record: dict

class CascadeRequest(BaseModel):
    employee_id: str
    record: dict

class CounterfactualRequest(BaseModel):
    record: dict
    feature_changes: dict

class ScenarioRequest(BaseModel):
    scenario_key: str
    horizon_days: Optional[int] = 90

class OptimizationRequest(BaseModel):
    budget_limit: Optional[float] = 50000.0
    training_capacity: Optional[int] = 50

class PolicySearchRequest(BaseModel):
    query: str

class AgentAskRequest(BaseModel):
    question: str
    employee_id: Optional[str] = "rahul-sharma"

class DecisionCreateRequest(BaseModel):
    employee_id: str
    human_context: Optional[str] = None

class OutcomeRecordRequest(BaseModel):
    workflow_id: str
    expected_change: float
    actual_change: float

# Model Registry Endpoints
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

# Anomaly Endpoint
@router.post("/intelligence/anomaly")
def detect_anomaly(req: AnomalyRequest):
    return anomaly_detector.detect_employee_anomaly(req.record)

# Consolidated Intelligence Endpoints
@router.get("/intelligence/employee/{employee_id}")
def get_employee_intelligence(employee_id: str, db: Session = Depends(get_db)):
    return intelligence_orchestrator.orchestrate_employee_intelligence(db, employee_id)

@router.get("/intelligence/workforce")
def get_workforce_intelligence(db: Session = Depends(get_db)):
    return intelligence_orchestrator.orchestrate_workforce_intelligence(db)

# Intelligence & Trajectory
@router.get("/intelligence/trajectory/{employee_id}")
def get_trajectory(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    history = [
        {"day": d, "risk": max(0, min(100, (emp.attrition_risk if emp else 70) + (d/90.0)*5 - 2))}
        for d in range(0, 95, 5)
    ]
    return temporal_service.calculate_trajectory(history)

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

# Simulation Endpoints
@router.post("/simulation/cascade")
def run_cascade(req: CascadeRequest):
    return cascade_engine.simulate_cascade(req.employee_id, req.record)

@router.post("/simulation/counterfactual")
def run_counterfactual(req: CounterfactualRequest):
    return counterfactual_engine.run_counterfactual(req.record, req.feature_changes)

@router.post("/simulation/scenario")
def run_scenario(req: ScenarioRequest):
    return futures_engine.simulate_scenario(req.scenario_key, req.horizon_days)

@router.post("/simulation/compare")
def compare_scenarios(horizon_days: Optional[int] = 90):
    return futures_engine.compare_scenarios(horizon_days)

# Optimization Endpoint
@router.post("/optimization/interventions")
def optimize_interventions(req: OptimizationRequest):
    return intervention_optimizer.optimize_interventions(req.budget_limit, req.training_capacity)

# Policy RAG Endpoint
@router.post("/policies/search")
def search_policies(req: PolicySearchRequest):
    return policy_rag.search_policies(req.query)

# Agent Endpoint
@router.post("/agent/ask")
def ask_qwen_agent(req: AgentAskRequest):
    return qwen_agent.ask(req.question, req.employee_id)

# Governance Endpoint
@router.post("/decision/evaluate")
def evaluate_decision_firewall(employee_id: str, risk_score: float, evidence_count: int = 5):
    return decision_firewall.evaluate_decision(employee_id, risk_score, evidence_count, 88.0)

# Decision System Endpoints
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

@router.post("/decisions/{id}/reject")
def reject_decision(id: str, db: Session = Depends(get_db)):
    d = db.query(Decision).filter(Decision.id == id).first()
    if d:
        d.human_status = "REJECTED"
        db.commit()
    return {"id": id, "status": "REJECTED"}

# Memory Endpoints
@router.get("/memory")
def get_memory(db: Session = Depends(get_db)):
    return organizational_memory.get_memory_entries(db)

@router.get("/memory/{decision_id}")
def get_decision_replay(decision_id: str, db: Session = Depends(get_db)):
    return organizational_memory.get_decision_replay(db, decision_id)

@router.post("/memory/outcome")
def record_outcome(req: OutcomeRecordRequest, db: Session = Depends(get_db)):
    return enterpro_adapter.record_workflow_outcome(db, req.workflow_id, req.expected_change, req.actual_change)
