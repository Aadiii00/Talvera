import {
  Bell,
  Building2,
  Palette,
  Plug,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/talvera/components/shared/PageHeader";
import { ChartCard } from "@/talvera/components/shared/ChartCard";

const sections = [
  {
    icon: Building2,
    title: "Organization",
    fields: [
      { label: "Organization name", value: "Talvera Inc." },
      { label: "Primary domain", value: "talvera.io" },
    ],
  },
  {
    icon: Users,
    title: "Users",
    fields: [
      { label: "Active users", value: "812" },
      { label: "Pending invites", value: "6" },
    ],
  },
  {
    icon: UserCog,
    title: "Roles",
    fields: [
      { label: "Chief People Officer", value: "Full access" },
      { label: "People Partner", value: "Team scoped" },
    ],
  },
];

const toggles = [
  { icon: Bell, title: "Notifications", description: "Email and in-app alerts for new critical-risk employees", defaultChecked: true },
  { icon: Sparkles, title: "AI Preferences", description: "Allow Talvera to proactively surface recommendations", defaultChecked: true },
  { icon: ShieldCheck, title: "Decision Governance", description: "Require human approval before dispatching workflows", defaultChecked: true },
  { icon: Plug, title: "Integrations", description: "Sync workforce data from connected systems automatically", defaultChecked: false },
  { icon: Palette, title: "Appearance", description: "Use compact density across tables and cards", defaultChecked: true },
];

export default function Settings() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader title="Settings" subtitle="Manage organization, access, and platform preferences." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {sections.map((section) => (
          <ChartCard key={section.title} title={section.title} action={<section.icon className="h-4 w-4 text-muted-foreground" />}>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.label} className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{field.label}</Label>
                  <Input defaultValue={field.value} className="h-9 text-sm" />
                </div>
              ))}
            </div>
          </ChartCard>
        ))}
      </div>

      <ChartCard title="Preferences" subtitle="Notifications, AI behavior, governance, integrations, and appearance">
        <div className="divide-y divide-border">
          {toggles.map((toggle) => (
            <div key={toggle.title} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <toggle.icon className="h-4 w-4 text-muted-foreground" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{toggle.title}</p>
                  <p className="text-xs text-muted-foreground">{toggle.description}</p>
                </div>
              </div>
              <Switch defaultChecked={toggle.defaultChecked} />
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
