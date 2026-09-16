import {
  Boxes,
  GraduationCap,
  Hexagon,
  LayoutDashboard,
  Network,
  PiggyBank,
  Radar,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  BookOpen,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", to: "/talvera/overview", icon: LayoutDashboard },
  { label: "Employees", to: "/talvera/employees", icon: Users },
  { label: "Risk Radar", to: "/talvera/risk-radar", icon: Radar },
  { label: "Retention ROI", to: "/talvera/retention-roi", icon: PiggyBank },
  { label: "Contagion Radar", to: "/talvera/contagion-radar", icon: Share2 },
  { label: "Skill Mesh", to: "/talvera/skill-mesh", icon: Network },
  { label: "Workflow Center", to: "/talvera/workflow-center", icon: Workflow },
  { label: "Skill Intelligence", to: "/talvera/skill-intelligence", icon: GraduationCap },
  { label: "Interventions", to: "/talvera/interventions", icon: Sparkles },
  { label: "Decision Guard", to: "/talvera/decision-guard", icon: ShieldCheck },
  { label: "Policy Intelligence", to: "/talvera/policy-intelligence", icon: BookOpen },
  { label: "Digital Twin", to: "/talvera/digital-twin", icon: Boxes },
];

export function TalveraBrand() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Hexagon className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-extrabold tracking-tight text-foreground">TALVERA</span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Workforce Intelligence
        </span>
      </div>
    </div>
  );
}

export function TalveraNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5">
      <span className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70">
        Workspace
      </span>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[12.5px] font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-secondary-foreground hover:bg-accent hover:text-foreground"
            )
          }
        >
          <item.icon className="h-[15px] w-[15px] shrink-0" strokeWidth={2} />
          <span className="truncate">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export function TalveraSidebar() {
  return (
    <aside className="hidden h-full w-[184px] shrink-0 flex-col border-r border-border/80 bg-sidebar px-3 py-4 lg:flex">
      <div className="mb-6">
        <TalveraBrand />
      </div>
      <div className="flex-1 overflow-y-auto">
        <TalveraNav />
      </div>
    </aside>
  );
}
