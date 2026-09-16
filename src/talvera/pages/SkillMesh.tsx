import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { ChartCard } from "@/talvera/components/shared/ChartCard";
import { StatusPill } from "@/talvera/components/shared/StatusPill";
import { NetworkGraph, type GraphEdge, type GraphNode, type GraphColumn } from "@/talvera/components/shared/NetworkGraph";
import { skills } from "@/talvera/data/skills";

const columns: GraphColumn[] = [
  { label: "EMPLOYEES", x: 12 },
  { label: "CRITICAL SKILLS", x: 37 },
  { label: "TEAMS", x: 62 },
  { label: "PROJECTS", x: 87 },
];

const skillOrder = skills.map((skill) => skill.name);

function buildMeshGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const uniqueTeams = Array.from(new Set(skills.flatMap((s) => s.teams)));
  const uniqueProjects = Array.from(new Set(skills.flatMap((s) => s.projects)));

  // Evenly spaced vertical layout
  skills.forEach((skill, index) => {
    const y = 8 + index * (84 / Math.max(1, skills.length - 1));
    const skillId = `skill-${skill.name}`;
    nodes.push({
      id: skillId,
      label: skill.name,
      sublabel: `${skill.employeesWithSkill} people · ${skill.coverage}% coverage`,
      badge: skill.singlePointOfFailure ? "SPOF" : undefined,
      x: 37,
      y,
      tone: skill.scarcity === "Critical" ? "pink" : skill.scarcity === "High" ? "orange" : "blue",
      emphasis: skill.singlePointOfFailure,
    });

    const empId = `emp-${skill.name}`;
    nodes.push({
      id: empId,
      label: `${skill.employeesWithSkill} Employees`,
      sublabel: skill.category,
      x: 12,
      y,
      tone: "green",
    });
    edges.push({ from: empId, to: skillId });

    skill.teams.forEach((teamName) => {
      const teamId = `team-${teamName}`;
      edges.push({ from: skillId, to: teamId });
    });
    skill.projects.forEach((projectName) => {
      const projectId = `project-${projectName}`;
      edges.push({ from: skillId, to: projectId });
    });
  });

  uniqueTeams.forEach((teamName, index) => {
    const y = 14 + index * (72 / Math.max(1, uniqueTeams.length - 1));
    nodes.push({ id: `team-${teamName}`, label: teamName, sublabel: "Team", x: 62, y, tone: "purple" });
  });

  uniqueProjects.forEach((projectName, index) => {
    const y = 10 + index * (80 / Math.max(1, uniqueProjects.length - 1));
    nodes.push({ id: `project-${projectName}`, label: projectName, sublabel: "Project", x: 87, y, tone: "teal" });
  });

  return { nodes, edges };
}

const { nodes: meshNodes, edges: meshEdges } = buildMeshGraph();

export default function SkillMesh() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Workforce Skill Mesh" subtitle="Map critical skills across people, teams and projects." />

      <ChartCard title="Employee → Skill → Team → Project" subtitle="Hover any node to trace its connections. Single points of failure are highlighted in navy with a SPOF badge.">
        <NetworkGraph nodes={meshNodes} edges={meshEdges} columns={columns} height={540} />
      </ChartCard>

      <ChartCard title="Skill Coverage & Scarcity" subtitle="Critical skills with low coverage create organizational exposure">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skillOrder.map((name) => {
            const skill = skills.find((s) => s.name === name)!;
            return (
              <div key={name} className="rounded-xl border border-border p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{skill.name}</p>
                  <StatusPill
                    tone={skill.scarcity === "Critical" ? "pink" : skill.scarcity === "High" ? "orange" : skill.scarcity === "Medium" ? "blue" : "green"}
                  >
                    {skill.scarcity}
                  </StatusPill>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${skill.coverage}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{skill.coverage}% coverage</span>
                  <span>{skill.employeesWithSkill} people</span>
                </div>
                {skill.singlePointOfFailure && (
                  <p className="mt-2 text-[11px] font-semibold text-status-pink">Single point of failure</p>
                )}
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}
