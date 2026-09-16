import networkx as nx
from typing import Dict, Any, List

class WorkforceGraphService:
    def __init__(self):
        self.G = nx.DiGraph()
        
    def populate_from_employees(self, df_records: list):
        self.G.clear()
        
        for emp in df_records:
            emp_id = emp["employee_id"]
            name = emp["name"]
            dept = emp["department"]
            team = emp["team"]
            role = emp["role"]
            skill = emp.get("critical_skills", "None")
            
            # Nodes
            self.G.add_node(emp_id, type="Employee", label=name, role=role, risk=emp.get("attrition_risk", 0))
            self.G.add_node(dept, type="Department", label=dept)
            self.G.add_node(team, type="Team", label=team)
            
            # Edges
            self.G.add_edge(emp_id, team, relation="MEMBER_OF")
            self.G.add_edge(team, dept, relation="BELONGS_TO")
            
            if skill and skill != "None":
                self.G.add_node(skill, type="Skill", label=skill)
                self.G.add_edge(emp_id, skill, relation="HAS_SKILL")

    def get_employee_graph(self, employee_id: str) -> Dict[str, Any]:
        if employee_id not in self.G:
            return {"employee_id": employee_id, "nodes": [], "edges": []}
            
        neighbors = list(self.G.neighbors(employee_id)) + list(self.G.predecessors(employee_id))
        sub_nodes = [employee_id] + neighbors
        subG = self.G.subgraph(sub_nodes)
        
        nodes = []
        for n, data in subG.nodes(data=True):
            nodes.append({"id": n, **data})
            
        edges = []
        for u, v, data in subG.edges(data=True):
            edges.append({"source": u, "target": v, **data})
            
        return {
            "employee_id": employee_id,
            "nodes": nodes,
            "edges": edges,
            "dependency_count": len(neighbors),
        }

    def get_team_graph(self, team_id: str) -> Dict[str, Any]:
        members = [n for n, d in self.G.nodes(data=True) if d.get("type") == "Employee" and self.G.has_edge(n, team_id)]
        return {
            "team_id": team_id,
            "member_count": len(members),
            "members": members,
        }

    def get_skill_graph(self, skill_id: str) -> Dict[str, Any]:
        holders = [n for n, d in self.G.nodes(data=True) if d.get("type") == "Employee" and self.G.has_edge(n, skill_id)]
        is_spof = len(holders) <= 1
        return {
            "skill_id": skill_id,
            "employee_count": len(holders),
            "single_point_of_failure": is_spof,
            "holders": holders,
        }

graph_service = WorkforceGraphService()
