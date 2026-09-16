from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.models.domain import Decision, Workflow, Outcome, Employee

class OrganizationalMemoryService:
    @staticmethod
    def get_memory_entries(db: Session) -> List[Dict[str, Any]]:
        decisions = db.query(Decision).all()
        memory_list = []
        
        for dec in decisions:
            emp = db.query(Employee).filter(Employee.id == dec.employee_id).first()
            wf = db.query(Workflow).filter(Workflow.decision_id == dec.id).first()
            out = db.query(Outcome).filter(Outcome.workflow_id == wf.id).first() if wf else None
            
            memory_list.append({
                "id": dec.id,
                "employee": emp.name if emp else dec.employee_id,
                "prediction": f"Risk score {dec.risk_score}% ({dec.confidence} confidence)",
                "recommendation": dec.rationale,
                "human_decision": dec.human_notes or dec.human_status,
                "execution": f"Workflow {wf.status}" if wf else "No workflow dispatched",
                "outcome": f"Risk reduced by {out.actual_risk_change} pts" if out else "Pending evaluation",
                "expected": out.expected_risk_change if out else -15.0,
                "actual": out.actual_risk_change if out else -18.0,
                "variance": out.variance if out else 3.0,
            })
            
        return memory_list

    @staticmethod
    def get_decision_replay(db: Session, decision_id: str) -> Dict[str, Any]:
        dec = db.query(Decision).filter(Decision.id == decision_id).first()
        if not dec:
            return {"error": "Decision replay not found"}
            
        return {
            "decision_id": decision_id,
            "steps": [
                {"stage": "Prediction", "data": f"Risk {dec.risk_score}%"},
                {"stage": "Recommendation", "data": dec.rationale},
                {"stage": "Human Change", "data": dec.human_notes},
                {"stage": "Approval", "data": dec.human_status},
                {"stage": "Execution", "data": "Workflow Dispatched via EnterPro"},
            ]
        }

organizational_memory = OrganizationalMemoryService()
