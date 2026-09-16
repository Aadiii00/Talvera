import uuid
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.models.domain import Workflow, Outcome

class EnterProWorkflowAdapter:
    @staticmethod
    def create_workflow(db: Session, decision_id: str, title: str, employee_name: str, description: str) -> Dict[str, Any]:
        existing = db.query(Workflow).filter(Workflow.decision_id == decision_id).first()
        if existing:
            return {
                "workflow_id": existing.id,
                "status": existing.status,
                "reused": True,
                "title": existing.title
            }

        wf_id = f"wf-{uuid.uuid4().hex[:6]}"
        steps = [
            {"label": "Created", "done": True},
            {"label": "Approved", "done": False},
            {"label": "Manager notified", "done": False},
            {"label": "Task created", "done": False},
            {"label": "Follow-up scheduled", "done": False},
        ]

        wf = Workflow(
            id=wf_id,
            decision_id=decision_id,
            title=title,
            employee_name=employee_name,
            description=description,
            status="APPROVED",
            steps=steps
        )
        db.add(wf)
        db.commit()
        db.refresh(wf)

        return {
            "workflow_id": wf_id,
            "status": "APPROVED",
            "title": title,
            "reused": False
        }

    @staticmethod
    def execute_workflow(db: Session, workflow_id: str) -> Dict[str, Any]:
        wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not wf:
            wf = Workflow(
                id=workflow_id,
                title="Default Workflow",
                employee_name="Rahul Sharma",
                description="Workload redistribution",
                status="EXECUTING",
                steps=[{"label": "Created", "done": True}, {"label": "Executing", "done": True}]
            )
            db.add(wf)
            db.commit()

        wf.status = "EXECUTING"
        steps = wf.steps or []
        for s in steps:
            if s["label"] in ["Created", "Approved", "Manager notified"]:
                s["done"] = True
        wf.steps = steps
        db.commit()

        return {
            "workflow_id": workflow_id,
            "status": "EXECUTING",
            "steps": wf.steps
        }

    @staticmethod
    def record_workflow_outcome(db: Session, workflow_id: str, expected_change: float, actual_change: float) -> Dict[str, Any]:
        wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not wf:
            wf = Workflow(
                id=workflow_id,
                title="Outcome Workflow",
                employee_name="Rahul Sharma",
                description="Workload redistribution",
                status="COMPLETED",
                steps=[{"label": "Completed", "done": True}]
            )
            db.add(wf)
            db.commit()

        wf.status = "COMPLETED"
        steps = wf.steps or []
        for s in steps:
            s["done"] = True
        wf.steps = steps

        variance = round(actual_change - expected_change, 1)
        out_id = f"out-{uuid.uuid4().hex[:6]}"
        outcome = Outcome(
            id=out_id,
            workflow_id=workflow_id,
            expected_risk_change=expected_change,
            actual_risk_change=actual_change,
            variance=variance,
            notes="Recorded from EnterPro execution completion."
        )
        db.add(outcome)
        db.commit()

        return {
            "outcome_id": out_id,
            "workflow_id": workflow_id,
            "status": "COMPLETED",
            "expected_change": expected_change,
            "actual_change": actual_change,
            "variance": variance
        }

enterpro_adapter = EnterProWorkflowAdapter()
