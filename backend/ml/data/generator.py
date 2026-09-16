import os
import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.app.database.session import Base, engine, SessionLocal
from backend.app.models.domain import (
    Employee, Department, Team, Manager, Skill, Project,
    EmployeeSkill, EmployeeProject, WorkforceEvent, RiskSnapshot
)

def generate_synthetic_data(num_employees=3000, seed=42):
    np.random.seed(seed)
    random.seed(seed)
    
    departments_info = [
        {"name": "Engineering", "share": 0.31, "risk_base": 0.28},
        {"name": "Sales", "share": 0.24, "risk_base": 0.24},
        {"name": "Support", "share": 0.18, "risk_base": 0.18},
        {"name": "Finance", "share": 0.09, "risk_base": 0.22},
        {"name": "HR", "share": 0.10, "risk_base": 0.12},
        {"name": "Operations", "share": 0.08, "risk_base": 0.15},
    ]
    
    first_names = ["Rahul", "Vikram", "Ananya", "Priya", "Aarav", "Sneha", "Karan", "Meera", "Farah", "Divya", "Amit", "Neha", "Rohan", "Siddharth", "Tanya", "Pooja", "Arjun", "Kabir", "Nisha", "Ritu"]
    last_names = ["Sharma", "Iyer", "Rao", "Nair", "Mehta", "Kumar", "Bhatia", "Krishnan", "Sheikh", "Menon", "Patel", "Gupta", "Deshmukh", "Verma", "Joshi", "Chawla", "Reddy", "Chopra", "Sengupta", "Malhotra"]
    
    roles_by_dept = {
        "Engineering": ["Senior Backend Engineer", "DevOps Engineer", "Frontend Developer", "Data Engineer", "QA Lead", "Platform Architect"],
        "Sales": ["Enterprise Account Director", "Account Executive", "Sales Engineer", "BDR Lead"],
        "Support": ["Customer Support Lead", "Support Tier 2 Specialist", "CS Escalation Manager"],
        "Finance": ["Lead Risk Auditor", "Financial Analyst", "SOX Control Manager"],
        "HR": ["HR Business Partner", "Talent Acquisition Lead", "People Analytics Specialist"],
        "Operations": ["Operations Manager", "Supply Chain Analyst", "Procurement Lead"],
    }
    
    skills_list = [
        ("Kubernetes", "Infrastructure", "Critical"),
        ("Python", "Engineering", "Low"),
        ("Cloud Security", "Security", "Critical"),
        ("Java", "Engineering", "Medium"),
        ("React", "Engineering", "Low"),
        ("AI / ML", "Data", "Critical"),
        ("DevOps", "Infrastructure", "High"),
    ]
    
    projects_list = [
        ("Core Platform Migration", "Critical"),
        ("Customer Data Vault", "High"),
        ("Payments Gateway 2.0", "Critical"),
        ("Sales Intelligence Suite", "Medium"),
        ("Controls Automation", "High"),
        ("People Analytics Rollout", "Medium"),
    ]

    employees_data = []
    
    for i in range(1, num_employees + 1):
        emp_id = f"EMP-{i:04d}" if i > 6 else ["rahul-sharma", "vikram-iyer", "ananya-rao", "priya-nair", "aarav-mehta", "sneha-kumar"][i-1]
        
        if i <= 6:
            # Deterministic profiles for the main 6 employees
            names = ["Rahul Sharma", "Vikram Iyer", "Ananya Rao", "Priya Nair", "Aarav Mehta", "Sneha Kumar"]
            depts = ["Engineering", "Finance", "Sales", "Support", "Engineering", "HR"]
            roles = ["Senior Backend Engineer", "Lead Risk Auditor", "Enterprise Account Director", "Customer Support Lead", "DevOps Engineer", "HR Business Partner"]
            name = names[i-1]
            dept = depts[i-1]
            role = roles[i-1]
        else:
            fn = random.choice(first_names)
            ln = random.choice(last_names)
            name = f"{fn} {ln}"
            dept_choice = random.choices([d["name"] for d in departments_info], weights=[d["share"] for d in departments_info])[0]
            dept = dept_choice
            role = random.choice(roles_by_dept[dept])
            
        initials = "".join([part[0] for part in name.split()[:2]])
        team = f"{dept} / {role.split()[0]} Team"
        manager = f"Manager of {dept}"
        
        tenure_years = round(float(np.random.gamma(shape=2.5, scale=1.5)), 1)
        performance_score = round(float(np.random.normal(loc=3.4, scale=0.6)), 1)
        performance_score = max(1.0, min(5.0, performance_score))
        performance_trend = random.choice(["Improving", "Stable", "Deteriorating"])
        
        engagement_score = round(float(np.random.normal(loc=6.8, scale=1.5)), 1)
        engagement_score = max(1.0, min(10.0, engagement_score))
        
        workload_index = round(float(np.random.normal(loc=1.1, scale=0.3)), 2)
        workload_index = max(0.5, min(2.5, workload_index))
        
        absenteeism_rate = round(float(np.random.exponential(scale=2.5)), 1)
        absenteeism_rate = min(25.0, absenteeism_rate)
        
        salary = round(float(np.random.normal(loc=120000, scale=30000)), -2)
        pay_vs_market = round(float(np.random.normal(loc=0.98, scale=0.12)), 2)
        
        promotions_last_3_years = random.choices([0, 1, 2], weights=[0.7, 0.25, 0.05])[0]
        training_hours = round(float(np.random.exponential(scale=20)), 1)
        skill_growth_score = round(float(np.random.normal(loc=55, scale=18)), 1)
        skill_growth_score = max(0.0, min(100.0, skill_growth_score))
        
        manager_change_recent = random.random() < 0.25
        manager_relationship_score = round(float(np.random.normal(loc=7.2, scale=1.8)), 1)
        manager_relationship_score = max(1.0, min(10.0, manager_relationship_score))
        
        job_satisfaction = round(float(np.random.normal(loc=6.9, scale=1.6)), 1)
        job_satisfaction = max(1.0, min(10.0, job_satisfaction))
        
        overtime_hours = round(float(max(0.0, (workload_index - 1.0) * 20 + np.random.normal(loc=5, scale=5))), 1)
        remote_work_ratio = random.choice([0.0, 0.2, 0.4, 0.5, 0.8, 1.0])
        
        projects_count = random.randint(1, 5)
        critical_project = random.random() < 0.35
        critical_skills = random.choice(["Kubernetes", "Cloud Security", "AI / ML", "Python", "None"])
        skill_scarcity = "Critical" if critical_skills in ["Kubernetes", "Cloud Security", "AI / ML"] else "Low"
        recent_policy_change = random.random() < 0.15
        
        # Correlated attrition logit
        log_odds = (
            -1.5
            + (workload_index - 1.0) * 1.8
            - (engagement_score - 7.0) * 0.4
            - (job_satisfaction - 7.0) * 0.35
            - (manager_relationship_score - 7.0) * 0.3
            - (pay_vs_market - 1.0) * 2.2
            + (1.0 if manager_change_recent else 0.0) * 0.6
            - (skill_growth_score - 50.0) * 0.02
            + (absenteeism_rate / 10.0) * 0.5
        )
        prob = 1.0 / (1.0 + np.exp(-log_odds))
        attrition = 1 if random.random() < prob else 0
        attrition_risk = round(prob * 100.0, 1)
        
        if attrition_risk >= 70:
            zone = "Critical"
            trajectory = "Deteriorating"
        elif attrition_risk >= 50:
            zone = "Support"
            trajectory = "Deteriorating" if random.random() < 0.6 else "Stable"
        elif attrition_risk >= 35:
            zone = "Protect"
            trajectory = "Stable"
        else:
            zone = "Monitor"
            trajectory = "Improving" if random.random() < 0.4 else "Stable"
            
        org_exposure = round(min(100.0, max(10.0, tenure_years * 12.0 + projects_count * 8.0 + (30.0 if critical_project else 0.0))), 1)
        top_factor = "Workload ↑" if workload_index > 1.3 else ("Comp Below Market" if pay_vs_market < 0.9 else "Skill Stagnation")
        
        employees_data.append({
            "employee_id": emp_id,
            "name": name,
            "initials": initials,
            "department": dept,
            "team": team,
            "role": role,
            "manager": manager,
            "tenure_years": tenure_years,
            "performance_score": performance_score,
            "performance_trend": performance_trend,
            "engagement_score": engagement_score,
            "absenteeism_rate": absenteeism_rate,
            "workload_index": workload_index,
            "salary": salary,
            "pay_vs_market": pay_vs_market,
            "promotions_last_3_years": promotions_last_3_years,
            "training_hours": training_hours,
            "skill_growth_score": skill_growth_score,
            "manager_change_recent": manager_change_recent,
            "manager_relationship_score": manager_relationship_score,
            "job_satisfaction": job_satisfaction,
            "overtime_hours": overtime_hours,
            "remote_work_ratio": remote_work_ratio,
            "projects_count": projects_count,
            "critical_project": critical_project,
            "critical_skills": critical_skills,
            "skill_scarcity": skill_scarcity,
            "recent_policy_change": recent_policy_change,
            "attrition": attrition,
            "attrition_risk": attrition_risk,
            "trajectory": trajectory,
            "org_exposure": org_exposure,
            "confidence": "High" if random.random() > 0.15 else "Medium",
            "top_factor": top_factor,
            "zone": zone,
        })
        
    df = pd.DataFrame(employees_data)
    os.makedirs("backend/ml/data", exist_ok=True)
    csv_path = "backend/ml/data/synthetic_workforce.csv"
    df.to_csv(csv_path, index=False)
    
    # Store into DB
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # Clear existing
        db.query(Employee).delete()
        for emp in employees_data:
            e = Employee(
                id=emp["employee_id"],
                name=emp["name"],
                initials=emp["initials"],
                role=emp["role"],
                department=emp["department"],
                team=emp["team"],
                manager=emp["manager"],
                tenure_years=emp["tenure_years"],
                performance_score=emp["performance_score"],
                performance_trend=emp["performance_trend"],
                engagement_score=emp["engagement_score"],
                absenteeism_rate=emp["absenteeism_rate"],
                workload_index=emp["workload_index"],
                salary=emp["salary"],
                pay_vs_market=emp["pay_vs_market"],
                promotions_last_3_years=emp["promotions_last_3_years"],
                training_hours=emp["training_hours"],
                skill_growth_score=emp["skill_growth_score"],
                manager_change_recent=emp["manager_change_recent"],
                manager_relationship_score=emp["manager_relationship_score"],
                job_satisfaction=emp["job_satisfaction"],
                overtime_hours=emp["overtime_hours"],
                remote_work_ratio=emp["remote_work_ratio"],
                projects_count=emp["projects_count"],
                critical_project=emp["critical_project"],
                critical_skills=emp["critical_skills"],
                skill_scarcity=emp["skill_scarcity"],
                recent_policy_change=emp["recent_policy_change"],
                attrition=emp["attrition"],
                attrition_risk=emp["attrition_risk"],
                trajectory=emp["trajectory"],
                org_exposure=emp["org_exposure"],
                confidence=emp["confidence"],
                top_factor=emp["top_factor"],
                zone=emp["zone"],
            )
            db.add(e)
        db.commit()
    finally:
        db.close()
        
    return df, csv_path

if __name__ == "__main__":
    generate_synthetic_data()
