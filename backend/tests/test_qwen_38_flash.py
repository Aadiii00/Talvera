import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_1_simple_data_question_no_qwen():
    res = client.post("/api/agent/chat", json={"question": "Show Rahul's risk", "employee_id": "rahul-sharma"})
    assert res.status_code == 200
    data = res.json()
    assert "78%" in data["answer"] or "risk score" in data["answer"].lower() or "risk" in data["answer"].lower()
    assert "DIRECT_API_RESPONSE" in data["decision_state"]

def test_2_employee_explanation_one_qwen_call():
    res = client.post("/api/agent/chat", json={"question": "Why is Rahul high risk?", "employee_id": "rahul-sharma"})
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert "key_evidence" in data
    assert "get_risk_prediction" in data["tool_activity"]

def test_3_scenario_question_one_qwen_call():
    res = client.post("/api/agent/chat", json={"question": "What happens if Rahul leaves?", "employee_id": "rahul-sharma"})
    assert res.status_code == 200
    data = res.json()
    assert "get_cascade_risk" in data["tool_activity"]
    assert "answer" in data

def test_4_research_question():
    res = client.post("/api/agent/research", json={"query": "Research workforce digital twins"})
    assert res.status_code == 200
    data = res.json()
    assert "sources" in data
    assert len(data["sources"]) > 0

def test_5_tool_failure_no_fabricated_answer():
    res = client.post("/api/agent/chat", json={"question": "What does policy say about leaves?", "employee_id": "non_existent_id"})
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert "sources" in data
