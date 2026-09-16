import { Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { TalveraShell } from "./talvera/components/layout/TalveraShell";
import Overview from "./talvera/pages/Overview";
import Employees from "./talvera/pages/Employees";
import EmployeeDetail from "./talvera/pages/EmployeeDetail";
import RiskRadar from "./talvera/pages/RiskRadar";
import RetentionRoi from "./talvera/pages/RetentionRoi";
import ContagionRadar from "./talvera/pages/ContagionRadar";
import SkillMesh from "./talvera/pages/SkillMesh";
import SkillIntelligence from "./talvera/pages/SkillIntelligence";
import WorkflowCenter from "./talvera/pages/WorkflowCenter";
import DecisionGuard from "./talvera/pages/DecisionGuard";
import PolicyIntelligence from "./talvera/pages/PolicyIntelligence";
import DigitalTwin from "./talvera/pages/DigitalTwin";
import Interventions from "./talvera/pages/Interventions";
import Memory from "./talvera/pages/Memory";
import Settings from "./talvera/pages/Settings";

export const routers = [
  {
    path: "/",
    name: "home",
    element: <Navigate to="/talvera/overview" replace />,
  },
  {
    path: "/talvera",
    name: "talvera",
    element: <TalveraShell />,
    children: [
      { path: "overview", name: "overview", element: <Overview /> },
      { path: "employees", name: "employees", element: <Employees /> },
      { path: "employees/:id", name: "employee-detail", element: <EmployeeDetail /> },
      { path: "risk-radar", name: "risk-radar", element: <RiskRadar /> },
      { path: "retention-roi", name: "retention-roi", element: <RetentionRoi /> },
      { path: "contagion-radar", name: "contagion-radar", element: <ContagionRadar /> },
      { path: "skill-mesh", name: "skill-mesh", element: <SkillMesh /> },
      { path: "skill-intelligence", name: "skill-intelligence", element: <SkillIntelligence /> },
      { path: "workflow-center", name: "workflow-center", element: <WorkflowCenter /> },
      { path: "decision-guard", name: "decision-guard", element: <DecisionGuard /> },
      { path: "policy-intelligence", name: "policy-intelligence", element: <PolicyIntelligence /> },
      { path: "digital-twin", name: "digital-twin", element: <DigitalTwin /> },
      { path: "interventions", name: "interventions", element: <Interventions /> },
      { path: "memory", name: "memory", element: <Memory /> },
      { path: "settings", name: "settings", element: <Settings /> },
    ],
  },
  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  {
    path: "*",
    name: "404",
    element: <NotFound />,
  },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
