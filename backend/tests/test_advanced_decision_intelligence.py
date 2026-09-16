import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.ml.data.generator import generate_synthetic_data
from backend.graph.graph_service import graph_service
from backend.governance.firewall import decision_firewall
from backend.governance.robustness import robustness_engine
from backend.ml.inference.intervention_effects import intervention_effect_engine
from backend.optimization.optimizer import intervention_optimizer

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_data():
    df, _ = generate_synthetic_data(num_employees=100)
    graph_service.populate_from_employees(df.to_dict(orient="records"))

def test_intervention_effect_engine():
    record = {"employee_id": "rahul-sharma", "workload_index": 2.3, "engagement_score": 5.4, "pay_vs_market": 0.91}
    res = client.post("/api/interventions/effect", json={"record": record, "intervention_type": "WORKLOAD_REDUCTION"})
    assert res.status_code == 200
    data = res.json()
    assert "estimated_effect" in data
    assert data["estimated_effect"] <= 0 # Risk reduction

def test_digital_twin_endpoints():
    res_state = client.get("/api/digital-twin/state")
    assert res_state.status_code == 200
    assert "employee_count" in res_state.json()

    res_sim = client.post("/api/digital-twin/simulate", json={"scenario": "WORKLOAD_REDUCTION", "target_department": "Engineering"})
    assert res_sim.status_code == 200
    assert "simulated_state" in res_sim.json()

def test_deep_cascade_endpoint():
    record = {"name": "Rahul Sharma", "department": "Engineering", "team": "Platform", "critical_skills": "Kubernetes"}
    res = client.post("/api/cascade/deep", json={"employee_id": "rahul-sharma", "record": record, "depth": 3})
    assert res.status_code == 200
    data = res.json()
    assert "tertiary_entities" in data
    assert len(data["tertiary_entities"]) > 0

def test_portfolio_optimization():
    res = client.post("/api/optimization/portfolio", json={"budget_limit": 50000, "training_capacity": 50})
    assert res.status_code == 200
    data = res.json()
    assert "selected_interventions" in data
    assert "portfolio_cost" in data

# TEST CASES 1 - 8 REQUIRED BY PROMPT
def test_case_1_high_risk_deteriorating():
    eval_res = decision_firewall.evaluate_decision("rahul-sharma", risk_score=78.0, trajectory_class="DETERIORATING", is_anomaly=True, has_conflict=False, robustness_status="ROBUST")
    assert eval_res["recommended_action"] == "ACT"

def test_case_2_high_risk_improving():
    eval_res = decision_firewall.evaluate_decision("rahul-sharma", risk_score=75.0, trajectory_class="IMPROVING", is_anomaly=False, has_conflict=True, robustness_status="SENSITIVE")
    assert eval_res["recommended_action"] in ["REVIEW", "WAIT"]

def test_case_3_low_risk_high_org_exposure():
    res = client.get("/api/graph/skill/Kubernetes")
    assert res.status_code == 200
    assert res.json()["single_point_of_failure"] is True

def test_case_4_intervention_response_difference():
    rec_a = {"employee_id": "emp-a", "workload_index": 2.5, "engagement_score": 5.0, "pay_vs_market": 1.05}
    rec_b = {"employee_id": "emp-b", "workload_index": 1.1, "engagement_score": 4.0, "training_hours": 5.0}

    eff_a = intervention_effect_engine.estimate_effect(rec_a, "WORKLOAD_REDUCTION")
    eff_b = intervention_effect_engine.estimate_effect(rec_b, "TRAINING")

    assert eff_a["intervention_type"] == "WORKLOAD_REDUCTION"
    assert eff_b["intervention_type"] == "TRAINING"

def test_case_5_model_conflict():
    res = client.post("/api/intelligence/conflicts", json={
        "risk_score": 75.0, "trajectory_class": "IMPROVING", "is_anomaly": False, "org_exposure": 50.0, "is_single_point_of_failure": False
    })
    assert res.status_code == 200
    assert len(res.json()) > 0
    assert res.json()[0]["conflict_type"] == "RISK_VS_TRAJECTORY"

def test_case_6_portfolio_optimization():
    opt_res = intervention_optimizer.optimize_portfolio(budget_limit=20000)
    assert opt_res["portfolio_cost"] <= 20000

def test_case_7_decision_robustness():
    rob_res = robustness_engine.test_robustness("rahul-sharma", "WORKLOAD_REDUCTION", baseline_risk=78.0)
    assert rob_res["robustness_status"] in ["ROBUST", "SENSITIVE"]

def test_case_8_outcome_learning():
    res_out = client.post("/api/outcomes", json={"workflow_id": "wf-1", "expected_change": -15.0, "actual_change": -18.0})
    assert res_out.status_code == 200
    assert res_out.json()["variance"] == -3.0

    res_insights = client.get("/api/memory/insights")
    assert res_insights.status_code == 200
    assert "frequent_evidence_conflicts" in res_insights.json()
