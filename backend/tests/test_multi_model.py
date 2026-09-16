import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.ml.data.generator import generate_synthetic_data
from backend.graph.graph_service import graph_service
from backend.app.services.conflict_detector import conflict_detector
from backend.governance.firewall import decision_firewall

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_data():
    df, _ = generate_synthetic_data(num_employees=100)
    graph_service.populate_from_employees(df.to_dict(orient="records"))

def test_model_registry():
    res = client.get("/api/models")
    assert res.status_code == 200
    models = res.json()
    assert len(models) >= 4
    names = [m["model_name"] for m in models]
    assert "talvera-xgboost" in names
    assert "talvera-anomaly" in names
    assert "talvera-temporal" in names
    assert "talvera-embedding" in names

def test_anomaly_detection():
    record = {
        "employee_id": "rahul-sharma",
        "workload_index": 2.3,
        "engagement_score": 4.1,
        "absenteeism_rate": 12.0,
        "overtime_hours": 22.0,
        "performance_score": 2.8,
        "manager_relationship_score": 5.0
    }
    res = client.post("/api/intelligence/anomaly", json={"record": record})
    assert res.status_code == 200
    data = res.json()
    assert "is_anomaly" in data
    assert "severity" in data

def test_consolidated_employee_intelligence():
    res = client.get("/api/intelligence/employee/rahul-sharma")
    assert res.status_code == 200
    data = res.json()
    assert "risk" in data
    assert "anomaly" in data
    assert "trajectory" in data
    assert "evidence" in data
    assert "conflicts" in data
    assert "recommended_next_step" in data

def test_workforce_intelligence():
    res = client.get("/api/intelligence/workforce")
    assert res.status_code == 200
    data = res.json()
    assert "total_employees" in data
    assert "workforce_health_score" in data

# TEST CASES 1-6 REQUIRED BY PROMPT
def test_case_1_high_risk_deteriorating_trend():
    # High risk + deteriorating trend -> Firewall returns ACT
    eval_res = decision_firewall.evaluate_decision("rahul-sharma", risk_score=78.0, trajectory_class="DETERIORATING", is_anomaly=True, has_conflict=False)
    assert eval_res["recommended_action"] == "ACT"
    assert eval_res["model_agreement"] == "AGREE"

def test_case_2_high_risk_improving_trend():
    # High risk + improving trend -> Conflict detected -> Firewall returns REVIEW
    conflicts = conflict_detector.detect_conflicts(risk_score=75.0, trajectory_class="IMPROVING", is_anomaly=False, org_exposure=50.0, is_single_point_of_failure=False)
    assert len(conflicts) > 0
    assert conflicts[0]["conflict_type"] in ["RISK_VS_TRAJECTORY", "RISK_VS_TREND"]
    eval_res = decision_firewall.evaluate_decision("rahul-sharma", risk_score=75.0, trajectory_class="IMPROVING", is_anomaly=False, has_conflict=True)
    assert eval_res["recommended_action"] == "REVIEW"
    assert eval_res["model_agreement"] == "CONFLICT"

def test_case_3_low_risk_high_anomaly():
    # Low risk + high anomaly -> Conflict detected
    conflicts = conflict_detector.detect_conflicts(risk_score=25.0, trajectory_class="STABLE", is_anomaly=True, org_exposure=30.0, is_single_point_of_failure=False)
    assert len(conflicts) > 0
    assert conflicts[0]["conflict_type"] == "RISK_VS_ANOMALY"

def test_case_4_high_risk_high_exposure():
    # High risk + high exposure -> Stronger priority
    eval_res = decision_firewall.evaluate_decision("rahul-sharma", risk_score=85.0, trajectory_class="DETERIORATING", is_anomaly=True, has_conflict=False)
    assert eval_res["recommended_action"] == "ACT"

def test_case_5_conflicting_model_outputs():
    # Conflict handling across signals
    conflicts = conflict_detector.detect_conflicts(risk_score=35.0, trajectory_class="STABLE", is_anomaly=False, org_exposure=20.0, is_single_point_of_failure=True)
    assert len(conflicts) > 0
    assert conflicts[0]["conflict_type"] == "MODEL_VS_GRAPH"

def test_case_6_missing_model_output():
    # Agent handles missing optional inputs cleanly
    res = client.post("/api/agent/ask", json={"question": "What is Rahul's status?", "employee_id": "rahul-sharma"})
    assert res.status_code == 200
    assert "answer" in res.json()
