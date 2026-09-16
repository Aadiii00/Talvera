import os
import chromadb
from typing import Dict, Any, List
from backend.app.models.domain import Policy
from backend.app.database.session import SessionLocal, Base, engine

class PolicyRAGService:
    def __init__(self):
        self.chroma_client = chromadb.Client()
        self.collection = self.chroma_client.get_or_create_collection(name="policies")
        self.seed_documents()

    def seed_documents(self):
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            policies = db.query(Policy).all()
            if not policies:
                default_policies = [
                    Policy(id="pol-1", title="Compensation Band Adjustment Guidelines", category="Compensation", snippet="Managers may request a mid-cycle band adjustment when an employee's total compensation falls more than 8% below the internal market midpoint for their level.", source="Compensation Policy Handbook — Section 4.2"),
                    Policy(id="pol-2", title="Workload & On-Call Rotation Fairness Policy", category="Performance", snippet="On-call rotations should not exceed 1.5x the team average over any rolling 6-week period without manager escalation and workload rebalancing.", source="Workforce Governance Handbook — Section 2.1"),
                    Policy(id="pol-3", title="Internal Mobility & Lateral Transfer Process", category="Mobility", snippet="Employees with 12+ months tenure are eligible to apply for lateral transfers. Managers cannot block a transfer once a candidate has passed the hiring panel.", source="Mobility Policy Handbook — Section 1.4"),
                    Policy(id="pol-4", title="Sponsored Learning Pathway Eligibility", category="Training", snippet="Roles flagged with a critical skill gap by Skill Intelligence are automatically eligible for 100% sponsored learning pathways up to $4,000 annually.", source="Training & Development Policy — Section 3.3"),
                    Policy(id="pol-5", title="Manager Intervention Escalation Protocol", category="Manager Policy", snippet="When 3 or more direct reports show a deteriorating trajectory within 60 days, the manager's skip-level is automatically notified for a coaching review.", source="Manager Policy Handbook — Section 5.0"),
                ]
                for p in default_policies:
                    db.add(p)
                db.commit()
                policies = default_policies

            ids = [p.id for p in policies]
            documents = [f"{p.title}: {p.snippet}" for p in policies]
            metadatas = [{"title": p.title, "category": p.category, "source": p.source} for p in policies]

            if len(ids) > 0 and self.collection.count() == 0:
                self.collection.add(
                    ids=ids,
                    documents=documents,
                    metadatas=metadatas
                )
        except Exception as e:
            print(f"Policy RAG seed warning: {e}")
        finally:
            db.close()

    def search_policies(self, query: str, top_k: int = 3) -> Dict[str, Any]:
        if not query.strip():
            return {"status": "POLICY_EVIDENCE_UNAVAILABLE", "results": []}

        results = self.collection.query(
            query_texts=[query],
            n_results=top_k
        )

        docs = results.get("documents", [[]])[0]
        metas = results.get("metadatas", [[]])[0]

        if not docs:
            return {"status": "POLICY_EVIDENCE_UNAVAILABLE", "results": []}

        matches = []
        for doc, meta in zip(docs, metas):
            matches.append({
                "title": meta.get("title", ""),
                "category": meta.get("category", ""),
                "source": meta.get("source", ""),
                "snippet": doc,
            })

        return {
            "status": "EVIDENCE_RETRIEVED",
            "results": matches
        }

policy_rag = PolicyRAGService()
