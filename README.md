# TALVERA — The AI Workforce Decision Operating System

[![Build Status](https://img.shields.io/badge/Status-Active-status-teal?style=for-the-badge)](https://talvera.io)
[![Framework](https://img.shields.io/badge/Frontend-React_18_%7C_Vite_%7C_Tailwind-61DAFB?style=for-the-badge)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI_%7C_Python_3.12-009688?style=for-the-badge)](https://fastapi.tiangolo.com/)
[![ML Stack](https://img.shields.io/badge/ML-XGBoost_%7C_SHAP_%7C_OR--Tools-FF6F00?style=for-the-badge)](https://xgboost.ai)
[![AI Engine](https://img.shields.io/badge/AI-Qwen_3.8_Flash_%7C_OpenRouter-7C3AED?style=for-the-badge)](https://openrouter.ai)

> **"Don’t just predict the workforce. Operate the decision."**

**TALVERA** is a production-grade, AI-driven workforce decision operating system. Unlike traditional HR analytics tools that merely report past turnover, TALVERA operates as an end-to-end decision system. It connects machine-learning risk predictions, SHAP driver attributions, organizational graph dependencies, scenario simulations, Google OR-Tools portfolio optimization, governance firewalls, and automated workflow execution into a unified, evidence-backed decision loop.

---

## 🏛️ System Architecture

```
                          TALVERA SYSTEM ARCHITECTURE
  
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   FRONTEND UI LAYER                                        │
│         React 18 + Vite + TypeScript + Tailwind CSS + Recharts + Shadcn + Framer Motion    │
└─────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                              │ REST API (JSON)
┌─────────────────────────────────────────────▼──────────────────────────────────────────────┐
│                                   BACKEND FASTAPI LAYER                                    │
│                     Python 3.12 + FastAPI + Uvicorn + Pydantic v2                          │
└───────┬─────────────────────────────────────┬──────────────────────────────────────┬───────┘
        │                                     │                                      │
┌───────▼──────────────────────┐ ┌────────────▼──────────────────────┐ ┌─────────────▼──────────────┐
│     INTELLIGENCE ROUTER      │ │      EVIDENCE FUSION ENGINE       │ │     DECISION FIREWALL      │
│ Task-based intent routing to │ │ Combines risk, anomaly, trend,    │ │ 8-stage governance checks: │
│ minimize model execution     │ │ graph, and policy evidence         │ │ PASS / REVIEW / BLOCKED    │
└───────┬──────────────────────┘ └────────────┬──────────────────────┘ └─────────────┬──────────────┘
        │                                     │                                      │
┌───────▼─────────────────────────────────────▼──────────────────────────────────────▼──────────────┐
│                                  MULTI-MODEL ENGINE LAYER                                  │
│                                                                                            │
│  • XGBoost (v2.3): Calibrated Attrition Risk Model (0–100%)                                │
│  • SHAP Engine: TreeExplainer Feature Attribution & Driver Analysis                        │
│  • Isolation Forest: Behavioral Anomaly Detection (Overtime, Absenteeism, Workload Spikes) │
│  • Temporal Model: Single Exponential Smoothing & AR Trend Forecasting (30D / 60D / 90D)   │
│  • NetworkX / Neo4j Graph: Organizational Dependencies, SPOFs & Skill Mesh                 │
│  • Google OR-Tools: SCIP/CBC Integer Programming Portfolio Optimizer                       │
│  • Chroma Vector DB: Semantic Policy RAG & Handbook Retrieval                              │
│  • Qwen 3.8 Flash: LLM Reasoning, Tool Orchestration & Chatbot Synthesis                   │
└───────┬────────────────────────────────────────────────────────────────────────────────────┘
        │
┌───────▼────────────────────────────────────────────────────────────────────────────────────┐
│                                   PERSISTENCE & EXECUTION                                   │
│  • PostgreSQL / SQLite (SQLAlchemy ORM): System of Record (Employees, Decisions, Outcomes) │
│  • EnterPro Workflow Adapter: Enterprise Workflow Execution Layer                          │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 Multi-Model Intelligence Architecture

TALVERA utilizes a specialized multi-model architecture where each model performs a distinct task without overlap:

| Model / Engine | Core Technology | Role & Responsibility | Accuracy / Benchmark |
| :--- | :--- | :--- | :--- |
| **Attrition Risk Model** | `XGBoost v2.3` | Predicts baseline employee attrition risk score (`0–100%`) and risk band (`Critical`, `Support`, `Protect`, `Monitor`). | **ROC-AUC: 0.884**<br>PR-AUC: 0.762<br>F1-Score: 0.741 |
| **Model Explainability** | `SHAP (TreeExplainer)` | Quantifies exact feature attributions and risk drivers without LLM hallucinations. | Exact SHAP values |
| **Behavioral Anomaly** | `Isolation Forest` | Identifies behavioral outliers (workload spikes, absenteeism jumps, overtime deviations). | Contamination: 0.08 |
| **Temporal Forecasting** | `Exponential Smoothing` | Projects 30D/60D/90D time-series metric trends (`RISING`, `STABLE`, `FALLING`). | 68% Confidence Interval |
| **Dependency Graph** | `NetworkX / Neo4j` | Maps `Employee → Skill → Team → Project` dependencies and flags Single Points of Failure (SPOFs). | Dynamic Graph Density |
| **Portfolio Optimizer** | `Google OR-Tools` | SCIP/CBC Integer Programming solver optimizing intervention portfolios under budget and capacity constraints in INR (`₹`). | **100% Mathematically Optimal** (<15ms solve) |
| **Semantic Policy RAG** | `ChromaDB` | Vector store for corporate policy handbook search and retrieval. | 384-dim Embeddings |
| **Reasoning Agent** | `Qwen 3.8 Flash` via OpenRouter | High-level evidence synthesis, chatbot Q&A, and task-based tool orchestration. | Single-Pass Synthesis |

---

## 💻 Core Application Modules & Navigation

- **Landing Page (`/`)**: Premium public product presentation with live interactive hero command center, 8-stage decision loop, capability showcase, and Digital Twin sandbox comparison.
- **Overview Dashboard (`/talvera/overview`)**: High-level organizational health index (`74/100`), department headcount distribution, floating employee risk cards, and 8-week risk trend monitoring.
- **Employee Intelligence (`/talvera/employees` & `/talvera/employees/:id`)**: Searchable employee directory, 90-day risk trajectory area chart, SHAP risk drivers, cause map flow, interactive simulation slider, and Decision Simulation Cockpit.
- **Workforce Risk Radar (`/talvera/risk-radar`)**: Interactive 4-quadrant matrix (`Personal Risk` vs. `Organizational Exposure`) with glowing scatter dots, quadrant watermark badges, and glassmorphic preview tooltips.
- **Team Contagion Radar (`/talvera/contagion-radar`)**: Secondary attrition cascade analysis model with interactive pre-flight review dialog and live **Team Stabilization Protocol** execution tracking.
- **Workforce Skill Mesh (`/talvera/skill-mesh`)**: 4-stage Sankey/DAG graph mapping `EMPLOYEES → CRITICAL SKILLS → TEAMS → PROJECTS` with smooth bezier curves and SPOF badges.
- **Intervention Studio (`/talvera/interventions`)**: Multi-select candidate intervention cards with slider constraints in INR (`₹`), OR-Tools portfolio solver, and *"Why This Plan?"* evidence panels.
- **Decision Guard (`/talvera/decision-guard`)**: 8-stage governance firewall evaluating evidence strength, model agreement, policy, robustness, and human context.
- **Workforce Digital Twin (`/talvera/digital-twin`)**: Cloneable state simulation comparing 4 calculated worlds (`Current World`, `Scenario A`, `Scenario B`, `Optimized World`) over 30D/60D/90D horizons.
- **Organizational Memory (`/talvera/memory`)**: Decision replay and system-of-record tracking expected vs. actual risk reduction accuracy over time.
- **Ask Talvera Assistant (`AIDrawer`)**: Live chat console powered by OpenRouter Qwen 3.8 Flash delivering multi-model answers, evidence, simulations, and recommendations.

---

## 📡 Key REST API Reference

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check endpoint returning service status. |
| `/api/ml/model-info` | `GET` | Model metadata and calibration metrics for XGBoost. |
| `/api/ml/predict` | `POST` | Recompute XGBoost attrition risk for a single employee record. |
| `/api/ml/explain/{employee_id}` | `POST` | Calculate SHAP feature attributions for a given employee record. |
| `/api/intelligence/anomaly` | `POST` | Run Isolation Forest anomaly detection on behavioral features. |
| `/api/intelligence/employee/{id}` | `GET` | Assemble consolidated multi-model evidence package for an employee. |
| `/api/intelligence/conflicts` | `POST` | Run model conflict detector across risk, trajectory, anomaly, and graph. |
| `/api/graph/employee/{id}` | `GET` | Retrieve graph dependency sub-network for a given employee. |
| `/api/graph/skill/{id}` | `GET` | Retrieve skill graph coverage and single point of failure status. |
| `/api/simulation/cascade` | `POST` | Simulate multi-tier deep cascade propagation (depth 1, 2, 3). |
| `/api/simulation/counterfactual` | `POST` | Re-score XGBoost risk under controlled feature changes. |
| `/api/optimization/portfolio` | `POST` | Run OR-Tools integer programming solver to optimize intervention portfolio in INR (`₹`). |
| `/api/digital-twin/state` | `GET` | Retrieve live baseline Digital Twin state summary from database. |
| `/api/digital-twin/simulate` | `POST` | Run what-if scenario simulation on a cloned DigitalTwinState instance. |
| `/api/digital-twin/compare` | `POST` | Evaluate 4 distinct simulated world states across 30D/60D/90D horizons. |
| `/api/policies/search` | `POST` | Semantic vector search across HR policy handbook via ChromaDB. |
| `/api/agent/chat` | `POST` | Orchestrate Qwen 3.8 Flash reasoning agent with pre-fetched tool evidence. |
| `/api/decision/evaluate` | `POST` | Evaluate 8-stage Decision Firewall governance pipeline for an employee. |
| `/api/decision/robustness` | `POST` | Run adversarial feature perturbation stress testing. |
| `/api/decisions` | `POST` | Create a decision record in system of record. |
| `/api/decisions/{id}/approve` | `POST` | Approve decision and dispatch workflow execution via EnterPro adapter. |
| `/api/memory` | `GET` | Retrieve organizational decision replay and outcome history. |

---

## 🛠️ Local Development & Setup

### Prerequisites
- Node.js v18+ & pnpm
- Python 3.12+ & pip

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <YOUR_REPOSITORY_URL>
cd thread

# Install frontend dependencies
pnpm install

# Install Python backend dependencies
pip install fastapi uvicorn pydantic pydantic-settings sqlalchemy pandas numpy xgboost shap ortools chromadb networkx neo4j httpx pytest
```

### 2. Environment Configuration
Create a `.env` file in the project root:
```env
QWEN_API_KEY=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
DATABASE_URL=sqlite:///./talvera.db
PROJECT_NAME="TALVERA Workforce Intelligence"
```

### 3. Run Development Servers
```bash
# Terminal 1: Start FastAPI Backend Server
python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Start Vite Frontend Development Server
pnpm dev
```

The application will be accessible at:
- **Landing Page**: `http://localhost:5173/`
- **Talvera Workspace**: `http://localhost:5173/talvera/overview`
- **FastAPI OpenAPI Docs**: `http://localhost:8000/api/openapi.json`

---

## 🧪 Testing & Validation

Run the comprehensive test suite covering database models, XGBoost inference, SHAP explainability, graph queries, cascade simulation, OR-Tools portfolio optimization, Chroma RAG, Qwen agent tool orchestration, Decision Firewall, and Digital Twin state cloning:

```bash
# Run all backend Pytest test suites (43 test cases)
PYTHONPATH=. python3 -m pytest backend/tests/

# Run frontend ESLint check
pnpm lint

# Run frontend production build
pnpm run build
```

---

## 🐳 Docker Deployment

To launch the full backend containerized with PostgreSQL and Neo4j:

```bash
cd backend
docker-compose up -d --build
```

---

## 📄 License & Attribution

Developed for **TALVERA — The AI Workforce Decision Operating System**. Built with React, Vite, Tailwind CSS, FastAPI, XGBoost, SHAP, OR-Tools, ChromaDB, and OpenRouter Qwen 3.8 Flash.
