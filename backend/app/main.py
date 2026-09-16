from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.database.session import Base, engine, SessionLocal
from backend.app.models.domain import Employee
from backend.app.api.endpoints import router as api_router
from backend.graph.graph_service import graph_service

# Create tables
Base.metadata.create_all(bind=engine)

# Populate graph service on startup
db = SessionLocal()
try:
    employees = db.query(Employee).all()
    if not employees:
        from backend.ml.data.generator import generate_synthetic_data
        df, _ = generate_synthetic_data(num_employees=200)
        employees = db.query(Employee).all()
    graph_service.populate_from_employees([{
        "employee_id": e.id, "name": e.name, "department": e.department,
        "team": e.team, "role": e.role, "attrition_risk": e.attrition_risk,
        "critical_skills": e.critical_skills
    } for e in employees])
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
