import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database.session import Base, engine, SessionLocal
from backend.app.models.domain import Employee

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "TALVERA Workforce Intelligence"

def test_db_session():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    count = db.query(Employee).count()
    assert count >= 0
    db.close()
