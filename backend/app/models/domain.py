from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.app.database.session import Base

class Department(Base):
    __tablename__ = "departments"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    headcount_share = Column(Float, default=0.0)
    risk_score = Column(Float, default=0.0)
    employee_count = Column(Integer, default=0)

class Team(Base):
    __tablename__ = "teams"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)

class Manager(Base):
    __tablename__ = "managers"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String)

class Skill(Base):
    __tablename__ = "skills"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    category = Column(String)
    coverage = Column(Float, default=0.0)
    scarcity = Column(String, default="Low")
    critical_level = Column(Float, default=0.0)
    employees_count = Column(Integer, default=0)
    single_point_of_failure = Column(Boolean, default=False)

class Project(Base):
    __tablename__ = "projects"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    criticality = Column(String, default="Medium")

class Employee(Base):
    __tablename__ = "employees"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    initials = Column(String)
    role = Column(String)
    department = Column(String)
    team = Column(String)
    manager = Column(String)
    tenure_years = Column(Float, default=0.0)
    performance_score = Column(Float, default=3.0)
    performance_trend = Column(String, default="Stable")
    engagement_score = Column(Float, default=7.0)
    absenteeism_rate = Column(Float, default=0.0)
    workload_index = Column(Float, default=1.0)
    salary = Column(Float, default=100000.0)
    pay_vs_market = Column(Float, default=1.0)
    promotions_last_3_years = Column(Integer, default=0)
    training_hours = Column(Float, default=0.0)
    skill_growth_score = Column(Float, default=50.0)
    manager_change_recent = Column(Boolean, default=False)
    manager_relationship_score = Column(Float, default=7.0)
    job_satisfaction = Column(Float, default=7.0)
    overtime_hours = Column(Float, default=0.0)
    remote_work_ratio = Column(Float, default=0.5)
    projects_count = Column(Integer, default=1)
    critical_project = Column(Boolean, default=False)
    critical_skills = Column(String)
    skill_scarcity = Column(String, default="Low")
    recent_policy_change = Column(Boolean, default=False)
    attrition = Column(Integer, default=0)
    
    attrition_risk = Column(Float, default=0.0)
    trajectory = Column(String, default="Stable")
    org_exposure = Column(Float, default=0.0)
    confidence = Column(String, default="High")
    top_factor = Column(String)
    zone = Column(String, default="Monitor")

class EmployeeSkill(Base):
    __tablename__ = "employee_skills"
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(String, ForeignKey("employees.id"))
    skill_id = Column(String, ForeignKey("skills.id"))
    proficiency = Column(Float, default=1.0)

class EmployeeProject(Base):
    __tablename__ = "employee_projects"
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(String, ForeignKey("employees.id"))
    project_id = Column(String, ForeignKey("projects.id"))
    role_in_project = Column(String)

class WorkforceEvent(Base):
    __tablename__ = "workforce_events"
    id = Column(String, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.id"))
    event_type = Column(String) # e.g. "PULSE_SURVEY", "PROMOTION", "ON_CALL_SHIFT"
    value = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

class RiskSnapshot(Base):
    __tablename__ = "risk_snapshots"
    id = Column(String, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.id"))
    risk_score = Column(Float)
    trajectory = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Intervention(Base):
    __tablename__ = "interventions"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    cost = Column(Float, default=0.0)
    risk_reduction = Column(Float, default=0.0)
    operational_impact = Column(String, default="Low")
    affected_employees = Column(Integer, default=0)
    roi = Column(Float, default=1.0)
    skill_impact = Column(Float, default=0.0)

class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String)
    assumptions = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class Decision(Base):
    __tablename__ = "decisions"
    id = Column(String, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.id"))
    action = Column(String, default="REVIEW")
    risk_score = Column(Float)
    confidence = Column(String)
    rationale = Column(Text)
    human_status = Column(String, default="PENDING")
    human_notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class DecisionCheck(Base):
    __tablename__ = "decision_checks"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(String, ForeignKey("decisions.id"))
    stage = Column(String)
    status = Column(String) # PASS, REVIEW, BLOCKED
    note = Column(Text)

class Policy(Base):
    __tablename__ = "policies"
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String)
    snippet = Column(Text)
    source = Column(String)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Workflow(Base):
    __tablename__ = "workflows"
    id = Column(String, primary_key=True, index=True)
    decision_id = Column(String, ForeignKey("decisions.id"), nullable=True)
    title = Column(String, nullable=False)
    employee_name = Column(String)
    description = Column(Text)
    status = Column(String, default="DRAFT") # DRAFT, NEEDS_REVIEW, APPROVED, EXECUTING, COMPLETED, FAILED
    steps = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class Outcome(Base):
    __tablename__ = "outcomes"
    id = Column(String, primary_key=True, index=True)
    workflow_id = Column(String, ForeignKey("workflows.id"))
    expected_risk_change = Column(Float)
    actual_risk_change = Column(Float)
    variance = Column(Float)
    notes = Column(Text)
    recorded_at = Column(DateTime, default=datetime.utcnow)

class DecisionReplay(Base):
    __tablename__ = "decision_replays"
    id = Column(String, primary_key=True, index=True)
    decision_id = Column(String, ForeignKey("decisions.id"))
    data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
