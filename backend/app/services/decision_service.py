import uuid
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.models.domain import Decision, DecisionCheck, Employee
from backend.governance.firewall import decision_firewall

class DecisionService:
    @staticmethod
    def create_decision(db: Session, employee_id: str, human_context: str = None) -> Dict[str, Any]:
        emp = db.query(Employee).filter(Employee.id == employee_id).first()
        risk_score = emp.attrition_risk if emp else 78.0
        confidence = emp.confidence if emp else "High"
        
        eval_res = decision_firewall.evaluate_decision(employee_id, risk_score, evidence_count=5, confidence_pct=88.0)
        action = eval_res["recommended_action"]
        
        decision_id = f"dec-{uuid.uuid4().hex[:8]}"
        
        db_dec = Decision(
            id=decision_id,
            employee_id=employee_id,
            action=action,
            risk_score=risk_score,
            confidence=confidence,
            rationale=f"Evaluated by Decision Firewall for employee {employee_id}.",
            human_status="PENDING",
            human_notes=human_context
        )
        db.add(db_dec)
        
        for chk in eval_res["pipeline_checks"]:
            db_chk = DecisionCheck(
                decision_id=decision_id,
                stage=chk["stage"],
                status=chk["status"],
                note=chk["note"]
            )
            db.add(db_chk)
            
        db.commit()
        db.refresh(db_dec)
        
        return {
            "decision_id": decision_id,
            "employee_id": employee_id,
            "action": action,
            "human_status": "PENDING",
            "pipeline_checks": eval_res["pipeline_checks"]
        }

    @staticmethod
    def approve_decision(db: Session, decision_id: str, approver_name: str) -> Dict[str, Any]:
        dec = db.query(Decision).filter(Decision.id == decision_id).first()
        if not dec:
            return {"error": "Decision not found"}
            
        dec.human_status = "APPROVED"
        dec.human_notes = f"Approved by {approver_name}"
        db.commit()
        
        return {
            "decision_id": decision_id,
            "status": "APPROVED",
            "approver": approver_name
        }

decision_service = DecisionService()
