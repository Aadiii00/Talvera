import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.ml.data.generator import generate_synthetic_data
from backend.graph.graph_service import graph_service

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_data():
    df, _ = generate_synthetic_data(num_employees=100)
    graph_service.populate_from_employees(df.to_dict(orient="records"))

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_model_info():
    res = client.get("/api/ml/model-info")
    assert res.status_code == 200
    assert "metrics" in res.json()

def test_prediction():
    record = {
        "tenure_years": 4.2,
        "performance_score": 3.5,
        "engagement_score": 5.4,
        "absenteeism_rate": 4.1,
        "workload_index": 2.3,
        "salary": 145000,
        "pay_vs_market": 0.91,
        "promotions_last_3_years": 0,
        "training_hours": 12.0,
        "skill_growth_score": 38.0,
        "manager_change_recent": True,
        "manager_relationship_score": 6.1,
        "job_satisfaction": 5.0,
        "overtime_hours": 18.0,
        "remote_work_ratio": 0.5,
        "projects_count": 3,
        "critical_project": True,
        "critical_skills": "Kubernetes",
        "skill_scarcity": "Critical",
        "recent_policy_change": False,
    }
    res = client.post("/api/ml/predict", json={"employee_id": "rahul-sharma", "record": record})
    assert res.status_code == 200
    data = res.json()
    assert "risk_score" in data
    assert "risk_band" in data

def test_explainability():
    record = {
        "tenure_years": 4.2,
        "performance_score": 3.5,
        "engagement_score": 5.4,
        "absenteeism_rate": 4.1,
        "workload_index": 2.3,
        "salary": 145000,
        "pay_vs_market": 0.91,
        "promotions_last_3_years": 0,
        "training_hours": 12.0,
        "skill_growth_score": 38.0,
        "manager_change_recent": True,
        "manager_relationship_score": 6.1,
        "job_satisfaction": 5.0,
        "overtime_hours": 18.0,
        "remote_work_ratio": 0.5,
        "projects_count": 3,
        "critical_project": True,
        "critical_skills": "Kubernetes",
        "skill_scarcity": "Critical",
        "recent_policy_change": False,
    }
    res = client.post("/api/ml/explain/rahul-sharma", json={"record": record})
    assert res.status_code == 200
    data = res.json()
    assert "top_drivers" in data

def test_trajectory():
    res = client.get("/api/intelligence/trajectory/rahul-sharma")
    assert res.status_code == 200
    assert "trajectory_class" in res.json()

def test_graph():
    res = client.get("/api/graph/employee/rahul-sharma")
    assert res.status_code == 200
    assert "nodes" in res.json()

def test_cascade():
    record = {"name": "Rahul Sharma", "department": "Engineering", "team": "Platform", "critical_skills": "Kubernetes"}
    res = client.post("/api/simulation/cascade", json={"employee_id": "rahul-sharma", "record": record})
    assert res.status_code == 200
    assert "cascade_score" in res.json()

def test_counterfactual():
    record = {
        "tenure_years": 4.2,
        "performance_score": 3.5,
        "engagement_score": 5.4,
        "absenteeism_rate": 4.1,
        "workload_index": 2.3,
        "salary": 145000,
        "pay_vs_market": 0.91,
        "promotions_last_3_years": 0,
        "training_hours": 12.0,
        "skill_growth_score": 38.0,
        "manager_change_recent": True,
        "manager_relationship_score": 6.1,
        "job_satisfaction": 5.0,
        "overtime_hours": 18.0,
        "remote_work_ratio": 0.5,
        "projects_count": 3,
        "critical_project": True,
        "critical_skills": "Kubernetes",
        "skill_scarcity": "Critical",
        "recent_policy_change": False,
    }
    res = client.post("/api/simulation/counterfactual", json={"record": record, "feature_changes": {"workload_index": 1.1}})
    assert res.status_code == 200
    assert "simulated_risk" in res.json()

def test_scenario():
    res = client.post("/api/simulation/scenario", json={"scenario_key": "WORKLOAD_REDUCTION", "horizon_days": 90})
    assert res.status_code == 200
    assert "projected_metrics" in res.json()

def test_optimization():
    res = client.post("/api/optimization/interventions", json={"budget_limit": 50000})
    assert res.status_code == 200
    assert "recommended_interventions" in res.json()

def test_policy_rag():
    res = client.post("/api/policies/search", json={"query": "on-call workload policy"})
    assert res.status_code == 200
    assert "results" in res.json()

def test_qwen_agent():
    res = client.post("/api/agent/ask", json={"question": "Why is Engineering risk increasing?", "employee_id": "rahul-sharma"})
    assert res.status_code == 200
    assert "answer" in res.json()

def test_decision_system():
    res = client.post("/api/decisions", json={"employee_id": "rahul-sharma", "human_context": "Review requested"})
    assert res.status_code == 200
    dec_id = res.json()["decision_id"]
    
    app_res = client.post(f"/api/decisions/{dec_id}/approve")
    assert app_res.status_code == 200
    assert app_res.json()["status"] == "APPROVED"

def test_memory():
    res = client.get("/api/memory")
    assert res.status_code == 200
    assert isinstance(res.json(), list)
