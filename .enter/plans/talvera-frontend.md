# TALVERA — Workforce Intelligence Website (Frontend Only)

## Context
The project is currently the default Enter template (single `Index` hero page, shadcn/ui, Tailwind, react-router, recharts, framer-motion already installed). We are replacing it with **TALVERA**, a full multi-page enterprise workforce-intelligence website: fixed sidebar + top header shell, 17 route pages, shared UI primitives, and deterministic mock data. No backend, database, auth, AI calls, or Enter Cloud work — everything is static/local-state mock data, built and delivered as a website (not framed as an "app").

Reference screenshots were not attached; the very detailed text spec in the user's request is the visual/content source of truth.

## Design System (index.css / tailwind.config.ts)
- Add Plus Jakarta Sans via a `@import` in `index.css` (Google Fonts), set as `fontFamily.sans` in `tailwind.config.ts`.
- Replace `:root` HSL tokens in `src/index.css` to match the spec exactly (converted to HSL): `--background #F4F5F7`, `--card/--popover #FFFFFF`, `--foreground/--primary #111827`, `--secondary-foreground #667085` (muted), `--muted-foreground #98A2B3`, `--border/--input #E7E9ED`, `--radius 0.9rem` (14–18px cards).
- Add new **status tokens** (teal/pink/orange/green/blue/purple + soft backgrounds) as CSS variables (`--status-teal`, `--status-teal-soft`, `--status-pink`, `--status-pink-soft`, `--status-orange`, `--status-orange-soft`, `--status-green`, `--status-green-soft`, `--status-blue`, `--status-blue-soft`, `--status-purple`) using the exact hex values from the spec, converted to HSL.
- Extend `tailwind.config.ts` `colors` with a `status.{teal,pink,orange,green,blue,purple}` and `status.{...}-soft` scale mapped to the new tokens (semantic, not raw hex in components).
- Keep `--sidebar-*` tokens but restyle: light sidebar background (near-white), navy active-item background (`--primary`), gray inactive text.
- Do not touch dark-mode block beyond keeping it consistent (product is a light enterprise UI; dark mode not part of this scope).

## Folder Structure (new)
```
src/talvera/
  data/            deterministic mock data + TS types (one entity per file)
    types.ts
    employees.ts        Rahul Sharma, Vikram Iyer, Ananya Rao, Priya Nair, Aarav Mehta, Sneha Kumar
    departments.ts       Engineering/Sales/Support/Finance/HR/Operations distribution + risk %
    skills.ts             Kubernetes, Python, Cloud Security, Java, React, AI/ML, DevOps
    interventions.ts     Compensation/Training/Workload/Mobility/Manager
    workflows.ts
    policies.ts
    contagion.ts          trigger employee -> impacted teammates graph
    digitalTwin.ts
    decisionGuard.ts
    memory.ts
    evidenceGraph.ts
    techFoundation.ts
  components/
    layout/TalveraSidebar.tsx, TalveraTopBar.tsx, TalveraShell.tsx (Outlet host, handles mobile Sheet drawer)
    shared/MetricCard.tsx, StatusPill.tsx, TrendBadge.tsx, RiskCard.tsx, ChartCard.tsx,
           GraphCard.tsx, EvidenceCard.tsx, DecisionCard.tsx, ScenarioCard.tsx,
           WorkflowCard.tsx, Timeline.tsx, AlertCard.tsx, EmployeeRow.tsx, SearchBar.tsx
    command/CommandPalette.tsx  (built on existing src/components/ui/command.tsx, ⌘K shortcut)
    ai/FloatingAIButton.tsx, AIDrawer.tsx (built on existing Sheet component, canned Q&A)
  pages/
    Overview.tsx, Employees.tsx, EmployeeDetail.tsx, RiskRadar.tsx, RetentionRoi.tsx,
    ContagionRadar.tsx, SkillMesh.tsx, SkillIntelligence.tsx, WorkflowCenter.tsx,
    AiControlRoom.tsx, TechFoundation.tsx, EvidenceGraph.tsx, DecisionGuard.tsx,
    PolicyIntelligence.tsx, DigitalTwin.tsx, Interventions.tsx, Memory.tsx, Settings.tsx
```

## Routing (`src/router.tsx`)
- `/` → `<Navigate to="/talvera/overview" replace />`.
- `/talvera` → element `<TalveraShell />` (renders sidebar+header+`<Outlet/>`+`FloatingAIButton`), with children for every page above at paths matching the spec (`overview`, `employees`, `employees/:id`, `risk-radar`, `retention-roi`, `contagion-radar`, `skill-mesh`, `skill-intelligence`, `workflow-center`, `ai-control-room`, `tech-foundation`, `evidence-graph`, `decision-guard`, `policy-intelligence`, `digital-twin`, `interventions`, `memory`, `settings`).
- Keep the existing `*` → `NotFound` catch-all at the end.
- Delete `src/pages/Index.tsx` (superseded, no longer routed) — no other file imports it besides the router.

## Shared Components (reused across pages)
- **TalveraSidebar**: ~180px wide, logo block, `WORKSPACE` label, 15 nav items (icons from lucide-react), active item = navy pill (`bg-primary text-primary-foreground rounded-[10px]`), inactive = muted gray text with subtle hover bg. Collapses into a `Sheet` drawer (reusing existing `sheet.tsx`) below `lg`, triggered by a hamburger button in TopBar, driven by `useIsMobile`.
- **TalveraTopBar**: 56px sticky header — logo+wordmark, centered rounded `SearchBar` (opens `CommandPalette` on click/⌘K), right side "AI Online" pill (green dot) + avatar/name/role block.
- **CommandPalette**: `CommandDialog` (existing `command.tsx`) searching employees/skills/policies mock lists, navigates via `useNavigate`.
- **MetricCard / RiskCard / StatusPill / TrendBadge**: small reusable primitives for numeric stats, risk %, colored status pills (uses `status.*` tokens), up/down trend badges.
- **ChartCard**: white card wrapper (title + subtitle + recharts chart) used by Overview, Risk Radar, Employee Detail.
- **GraphCard**: lightweight custom SVG/absolute-div network-graph primitive (nodes + curved connector lines), reused by Contagion Radar, Skill Mesh, Evidence Graph, Employee Detail "Cause Map", Decision Guard pipeline — no new dependency, since recharts has no network-graph chart type.
- **WorkflowCard / Timeline / AlertCard / EvidenceCard / DecisionCard / ScenarioCard / EmployeeRow**: page-specific list/row primitives per spec sections 8–24.
- **FloatingAIButton + AIDrawer**: fixed bottom-right dark pill, opens right `Sheet` with input + 5 suggested questions; clicking a suggestion fills canned static Answer/Evidence/Simulation/Recommendation/Decision-Status blocks from `data/` mocks (local state only, no chain-of-thought shown).
- Motion: a small `PageTransition` wrapper (framer-motion `motion.div`, fade+slide-up, respects `useReducedMotion`) used at the top of every page component; cards use a staggered reveal variant.

## Page-by-Page Implementation Notes
Each page below implements exactly the structure/content described in the corresponding numbered section of the user's request (headers, subtitles, metrics, tables, charts) using the shared components and mock data — no additional scope:
1. **Overview** (`/talvera/overview`) — spec §7: teal pill, hero heading, workforce-health card, pale-green "TALVERA CORE" hero with overlapping mini windows (dept split + Rahul Sharma floating risk card + assessment pills), pale-peach risk card with mini rising-risk bar chart + emerging-signal alert.
2. **Employees** (`/talvera/employees`) — spec §8: filter row (search/department/team/risk/trajectory/exposure) + white table with the 6 named employees.
3. **Employee Detail** (`/talvera/employees/:id`) — spec §9: header metrics row, 90-day line chart (recharts) + risk-drivers panel, Evidence grid, Cause Map (GraphCard), "What could change?" simulation slider comparing current vs. simulated %, Decision pill row (Act/Review/Simulate/Wait/Do Not Act).
4. **Risk Radar** (`/talvera/risk-radar`) — spec §10: recharts `ScatterChart` (Personal Risk × Org Exposure) with 4 quadrant zones via `ReferenceArea`, tooltip, filter panel, horizontal bar chart "Risk by Department".
5. **Retention ROI** (`/talvera/retention-roi`) — spec §11: top metric row + intervention comparison table.
6. **Contagion Radar** (`/talvera/contagion-radar`) — spec §12: trigger-employee selector, dark burgundy/navy CRITICAL alert card with cascade %/teammates-impacted metrics + dispatch button, GraphCard cascade-propagation network, "Cascade Amplifiers" side panel.
7. **Skill Mesh** (`/talvera/skill-mesh`) — spec §13: GraphCard Employee→Skill→Team→Project map, coverage/scarcity/gap indicators.
8. **Skill Intelligence** (`/talvera/skill-intelligence`) — spec §14: 2×4 capability-gap card grid + sponsored learning-pathway cards.
9. **Workflow Center** (`/talvera/workflow-center`) — spec §15: status columns (Pending/Approved/Executing/Completed/Failed) + workflow cards with `Timeline` + "EnterPro" badge.
10. **AI Control Room** (`/talvera/ai-control-room`) — spec §16: agent status header, current-task line, tool-activity list with per-tool status pills (no chain-of-thought).
11. **Tech Foundation** (`/talvera/tech-foundation`) — infra/tech-readiness overview (per clarified scope): systems/data-source cards, integration-health status pills, model-version list, styled consistently with other status-grid pages.
12. **Evidence Graph** (`/talvera/evidence-graph`) — spec §17: vertical GraphCard chain Employee→Risk→Evidence→Skill→Project→Policy→Decision→Intervention; clicking a node opens a right-side detail panel (local state).
13. **Decision Guard** (`/talvera/decision-guard`) — spec §18: pipeline stages (Evidence→...→Decision) with PASS/REVIEW/BLOCKED pills, final-output pill row, AI Recommendation panel + Human Decision panel with Approve/Modify/Reject/Request Simulation/Add Context buttons (local state only).
14. **Policy Intelligence** (`/talvera/policy-intelligence`) — spec §19: search bar, category chips, mock document result list + source preview panel.
15. **Digital Twin** (`/talvera/digital-twin`) — spec §20: top metric row, scenario selector, time selector (30/60/90D), 4-column world comparison grid, "Best Available Future" recommendation card.
16. **Interventions** (`/talvera/interventions`) — spec §21: intervention type cards, budget/capacity/hiring/salary controls (sliders/inputs), cost/impact/ROI summary, "Build Intervention Plan" button.
17. **Memory** (`/talvera/memory`) — spec §22: Prediction→Recommendation→Approval→Execution→Outcome `Timeline`, Expected/Actual/Variance comparison table.
18. **Settings** (`/talvera/settings`) — spec §24: tabbed/sectioned static settings (Organization/Users/Roles/Notifications/AI Preferences/Decision Governance/Integrations/Appearance) using existing form/switch/select UI primitives, no persistence.

## Responsive Behaviour
- Sidebar: fixed on `lg+`, becomes a `Sheet` drawer opened from a TopBar hamburger on `md` and below.
- Grids/tables: page grids collapse from multi-column to 1–2 columns via Tailwind breakpoints; tables scroll horizontally on small viewports (`overflow-x-auto` wrapper) rather than reflowing.
- Verify Overview and Employees at `desktop_1280` and `mobile_390` with `website_screenshot` after implementation.

## Explicitly Out of Scope
No Enter Cloud, database, auth, AI capability, Qwen/Neo4j/RAG, real simulation, or workflow execution — all data/interactions are mocked in `src/talvera/data/*` and local component state.

## Implementation Checklist
- [ ] Add Plus Jakarta Sans font and rewrite `src/index.css` root tokens + status color tokens per Design System section.
- [ ] Extend `tailwind.config.ts` with `status.*` color scale and font family.
- [ ] Create `src/talvera/data/*` mock modules with consistent employee/department/skill/project relationships (6 named employees reused everywhere).
- [ ] Build `TalveraSidebar`, `TalveraTopBar`, `TalveraShell` (with mobile Sheet drawer) layout components.
- [ ] Build shared primitives: `MetricCard`, `RiskCard`, `StatusPill`, `TrendBadge`, `ChartCard`, `GraphCard`, `EvidenceCard`, `DecisionCard`, `ScenarioCard`, `WorkflowCard`, `Timeline`, `AlertCard`, `EmployeeRow`, `SearchBar`, `PageTransition`.
- [ ] Build `CommandPalette` (⌘K) and `FloatingAIButton` + `AIDrawer`.
- [ ] Implement all 18 page components listed above with their described content and shared components.
- [ ] Update `src/router.tsx`: redirect `/` → `/talvera/overview`, nest all TALVERA routes under `TalveraShell`, keep `*` catch-all.
- [ ] Delete `src/pages/Index.tsx`.
- [ ] Run `pnpm lint` and fix any reported issues.
- [ ] Run `pnpm run build` and fix any reported issues.

## Verification Checklist
- [ ] `/` redirects to `/talvera/overview` and renders the sidebar+header shell.
- [ ] All 15 sidebar nav items route correctly and highlight as active on their page.
- [ ] Employees table row click navigates to `/talvera/employees/:id` with matching mock employee data.
- [ ] Risk Radar scatter chart renders quadrant zones and a tooltip on hover.
- [ ] Contagion Radar trigger-employee selector swaps the alert card and graph data.
- [ ] Ask Talvera floating button opens the drawer and a suggested question populates canned Answer/Evidence/Simulation/Recommendation/Decision-Status blocks.
- [ ] `website_screenshot` of `/talvera/overview` and `/talvera/employees` at `desktop_1280` and `mobile_390` confirms layout matches the spec's density/spacing and does not break responsively.
- [ ] `pnpm lint` and `pnpm run build` pass with no errors.
