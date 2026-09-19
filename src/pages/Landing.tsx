import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Hexagon,
  Radar,
  Network,
  Share2,
  Workflow,
  Sliders,
  CheckCircle2,
  Lock,
  Layers,
  Cpu,
  Database,
  BarChart3,
  Bot,
  Brain,
  History,
  Scale,
  Zap,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/talvera/components/shared/StatusPill";

export default function Landing() {
  const navigate = useNavigate();

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F4F5F7] text-[#111827] font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Sticky Floating Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
        <nav className="flex w-full max-w-5xl items-center justify-between rounded-full border border-border/80 bg-card/80 px-6 py-3 shadow-sm backdrop-blur-md">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Hexagon className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-base font-extrabold tracking-tight text-foreground">TALVERA</span>
          </Link>

          <div className="hidden items-center gap-6 text-xs font-semibold text-secondary-foreground md:flex">
            <button onClick={() => handleScrollTo("problem")} className="transition-colors hover:text-foreground">
              Product
            </button>
            <button onClick={() => handleScrollTo("loop")} className="transition-colors hover:text-foreground">
              Intelligence
            </button>
            <button onClick={() => handleScrollTo("features")} className="transition-colors hover:text-foreground">
              Decisions
            </button>
            <button onClick={() => handleScrollTo("memory")} className="transition-colors hover:text-foreground">
              Memory
            </button>
            <button onClick={() => handleScrollTo("tech")} className="transition-colors hover:text-foreground">
              About
            </button>
          </div>

          <Button
            onClick={() => navigate("/talvera/overview")}
            size="sm"
            className="rounded-full bg-primary text-primary-foreground font-bold text-xs px-5 hover:bg-primary/90"
          >
            Open Workspace
            <ArrowRight className="h-3.5 w-3.5 text-status-teal" />
          </Button>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          {/* Left Column: Editorial Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-status-teal/40 bg-status-teal-soft px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-status-teal">
              <Sparkles className="h-3.5 w-3.5" />
              AI Workforce Decision Operating System
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-foreground">
              Workforce decisions, <br />
              before they become <br />
              <span className="bg-gradient-to-r from-status-pink via-status-purple to-status-teal bg-clip-text text-transparent">
                business problems.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              TALVERA connects workforce risk, organizational dependencies, simulations, interventions, governance, and execution into one evidence-backed decision loop.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                onClick={() => navigate("/talvera/overview")}
                size="lg"
                className="rounded-full bg-primary text-primary-foreground font-bold text-sm px-8 py-6 shadow-lg shadow-primary/20 hover:bg-primary/90"
              >
                Open TALVERA
                <ArrowRight className="h-4 w-4 text-status-teal" />
              </Button>

              <Button
                onClick={() => handleScrollTo("loop")}
                variant="outline"
                size="lg"
                className="rounded-full border-border bg-card font-bold text-sm px-7 py-6 hover:bg-accent"
              >
                See how it works
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground pt-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-teal" />
              Prediction · Simulation · Governance · Execution
            </div>
          </motion.div>

          {/* Right Column: Interactive Command Center Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-border/90 bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 rounded-full bg-status-pink" />
                  <span className="flex h-3 w-3 rounded-full bg-status-orange" />
                  <span className="flex h-3 w-3 rounded-full bg-status-green" />
                  <span className="ml-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    TALVERA Command Center
                  </span>
                </div>
                <StatusPill tone="green" dot>
                  AI Online
                </StatusPill>
              </div>

              {/* Layered Floating UI Cards */}
              <div className="space-y-3">
                {/* Panel 1: Workforce Risk */}
                <div className="flex items-center justify-between rounded-2xl border border-status-orange/30 bg-status-orange-soft p-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-status-orange">Workforce Risk</p>
                    <p className="text-xl font-extrabold text-foreground">203 employees requiring attention</p>
                  </div>
                  <StatusPill tone="pink">+8.4% this month</StatusPill>
                </div>

                {/* Panel 2: Employee Risk */}
                <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                      RS
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Rahul Sharma</p>
                      <p className="text-xs text-muted-foreground">Senior Backend Engineer · Platform</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Attrition Risk</p>
                    <p className="text-base font-extrabold text-status-pink">78% Estimated</p>
                  </div>
                </div>

                {/* Panel 3: Org Exposure & Simulation */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-status-purple/30 bg-status-purple-soft p-3.5 text-xs">
                    <p className="text-[10px] font-bold uppercase text-status-purple">Org Exposure</p>
                    <p className="mt-1 font-bold text-foreground">Kubernetes SPOF Dependency</p>
                  </div>

                  <div className="rounded-2xl border border-status-teal/30 bg-status-teal-soft p-3.5 text-xs">
                    <p className="text-[10px] font-bold uppercase text-status-teal">Scenario Simulation</p>
                    <p className="mt-1 font-bold text-foreground">Workload -20% → Risk 54%</p>
                  </div>
                </div>

                {/* Panel 4: Decision Guard */}
                <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-3.5 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-status-orange" />
                    <span className="font-bold text-foreground">Decision Firewall State: REVIEW</span>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">Human Approval Required</span>
                </div>
              </div>

              {/* Connecting Flow Indicator */}
              <div className="flex items-center justify-between pt-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>Risk</span>
                <ChevronRight className="h-3.5 w-3.5 text-status-teal" />
                <span>Explain</span>
                <ChevronRight className="h-3.5 w-3.5 text-status-teal" />
                <span>Simulate</span>
                <ChevronRight className="h-3.5 w-3.5 text-status-teal" />
                <span>Decide</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — THE PROBLEM */}
      <section id="problem" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-status-teal">The Shift in Workforce AI</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Prediction was never the whole problem.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Knowing who may leave is useful. Knowing why, what is at stake, what could happen next, and what to do about it is where the real decision begins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-3xl border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-blue-soft text-status-blue font-bold">
                01
              </div>
              <h3 className="text-xl font-bold text-foreground">Predict</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Who is becoming a workforce risk? Calibrated machine learning identifies attrition probability before resignation letters arrive.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-purple-soft text-status-purple font-bold">
                02
              </div>
              <h3 className="text-xl font-bold text-foreground">Understand</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Why is the risk changing, and what does the organization depend on? SHAP drivers and graph dependencies reveal key-person exposure.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-teal-soft text-status-teal font-bold">
                03
              </div>
              <h3 className="text-xl font-bold text-foreground">Decide</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                What intervention should be considered, and should we act? Mathematical optimization and governance checks ensure high-ROI actions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 3 — TALVERA DECISION LOOP */}
      <section id="loop" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-status-teal">System Architecture</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            From signal to decision.
          </h2>
          <p className="text-sm text-muted-foreground">
            Eight integrated stages connecting raw workforce data to governed execution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { stage: "SENSE", icon: Cpu, desc: "Detect workforce signals and behavioral anomalies." },
            { stage: "PREDICT", icon: BarChart3, desc: "Estimate workforce attrition risk using XGBoost." },
            { stage: "UNDERSTAND", icon: Brain, desc: "Explain drivers with SHAP and graph dependencies." },
            { stage: "CHALLENGE", icon: ShieldCheck, desc: "Stress-test recommendations for robustness." },
            { stage: "SIMULATE", icon: Layers, desc: "Explore what-if futures on a Digital Twin." },
            { stage: "DECIDE", icon: Sliders, desc: "Optimize intervention portfolios under budget bounds." },
            { stage: "EXECUTE", icon: Workflow, desc: "Move approved decisions into enterprise workflow." },
            { stage: "LEARN", icon: History, desc: "Compare outcomes and build organizational memory." },
          ].map((item, idx) => (
            <div
              key={item.stage}
              className="flex flex-col gap-2.5 rounded-2xl border border-border/80 bg-card p-5 transition-all hover:border-primary/40 hover:bg-accent/50"
            >
              <div className="flex items-center justify-between">
                <item.icon className="h-5 w-5 text-status-teal" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">0{idx + 1}</span>
              </div>
              <p className="text-sm font-bold text-foreground">{item.stage}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — WHY TALVERA IS DIFFERENT */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-status-teal">The Distinction</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Beyond the risk score.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Traditional HR AI */}
          <div className="rounded-3xl border border-border bg-card/60 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <h3 className="text-lg font-bold text-muted-foreground">Traditional HR AI</h3>
              <StatusPill tone="pink">Static Analytics</StatusPill>
            </div>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <X className="h-4 w-4 text-status-pink shrink-0 mt-0.5" />
                <span>Predicts risk but leaves HR guessing why or what to do next.</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-4 w-4 text-status-pink shrink-0 mt-0.5" />
                <span>Shows static dashboards that don't model organizational dependencies.</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-4 w-4 text-status-pink shrink-0 mt-0.5" />
                <span>Stops at ungrounded recommendations without budget optimization.</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-4 w-4 text-status-pink shrink-0 mt-0.5" />
                <span>No governance firewall or historical decision tracking.</span>
              </li>
            </ul>
          </div>

          {/* TALVERA */}
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-accent/40 p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <h3 className="text-lg font-extrabold text-foreground">TALVERA Operating System</h3>
              <StatusPill tone="teal">Decision System</StatusPill>
            </div>
            <ul className="space-y-4 text-sm text-foreground">
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-status-teal shrink-0 mt-0.5" />
                <span>Predicts risk and explains drivers with SHAP feature attribution.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-status-teal shrink-0 mt-0.5" />
                <span>Maps organizational exposure and single points of failure in graph.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-status-teal shrink-0 mt-0.5" />
                <span>Simulates what-if interventions and optimizes portfolios under budget.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-status-teal shrink-0 mt-0.5" />
                <span>Enforces strict governance checks and records actual outcomes in memory.</span>
              </li>
            </ul>
            <div className="pt-2 text-xs font-bold uppercase tracking-widest text-status-teal">
              Prediction → Decision → Outcome
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — FEATURE SHOWCASE */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-status-teal">Capabilities</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Engineered for high-stakes intelligence.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Panel 1 */}
          <Card className="rounded-3xl border-border bg-card p-6 shadow-sm space-y-4">
            <CardContent className="p-0 space-y-3">
              <StatusPill tone="blue">Risk Intelligence</StatusPill>
              <h3 className="text-xl font-bold text-foreground">XGBoost &amp; SHAP Driver Diagnosis</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Calibrated gradient boosted trees identify attrition probability while SHAP TreeExplainer quantifies exact feature contributions.
              </p>
              <div className="rounded-2xl bg-secondary/50 p-4 text-xs space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Workload Overload</span>
                  <span className="text-status-pink">+38% SHAP</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Pay vs Market</span>
                  <span className="text-status-orange">+22% SHAP</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Panel 2 */}
          <Card className="rounded-3xl border-border bg-card p-6 shadow-sm space-y-4">
            <CardContent className="p-0 space-y-3">
              <StatusPill tone="purple">Cascade Intelligence</StatusPill>
              <h3 className="text-xl font-bold text-foreground">Secondary Attrition Mapping</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Employee → Team → Skill → Project dependency mapping reveals secondary turnover risk if a key employee exits.
              </p>
              <div className="rounded-2xl bg-secondary/50 p-4 text-xs space-y-1 font-semibold text-foreground">
                <p>Vikram Iyer (SOX Controls SPOF)</p>
                <p className="text-status-purple">→ 14 Teammates Impacted · 95% Cascade Risk</p>
              </div>
            </CardContent>
          </Card>

          {/* Panel 3 */}
          <Card className="rounded-3xl border-border bg-card p-6 shadow-sm space-y-4">
            <CardContent className="p-0 space-y-3">
              <StatusPill tone="teal">Workforce Futures</StatusPill>
              <h3 className="text-xl font-bold text-foreground">Digital Twin &amp; OR-Tools Optimizer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Test interventions on a cloned organizational sandbox before committing budget or changing real teams.
              </p>
              <div className="rounded-2xl bg-secondary/50 p-4 text-xs flex justify-between font-bold">
                <span>Budget Constraint: ₹5,00,000</span>
                <span className="text-status-teal">Optimal ROI: 37.3x</span>
              </div>
            </CardContent>
          </Card>

          {/* Panel 4 */}
          <Card className="rounded-3xl border-border bg-card p-6 shadow-sm space-y-4">
            <CardContent className="p-0 space-y-3">
              <StatusPill tone="green">Decision Guard</StatusPill>
              <h3 className="text-xl font-bold text-foreground">Governed Firewall Pipeline</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI can recommend. Humans remain in control. Every decision evaluates evidence, data quality, model agreement, and policy.
              </p>
              <div className="rounded-2xl bg-secondary/50 p-4 text-xs flex items-center justify-between font-bold">
                <span className="text-status-green">✓ 8 Firewall Stages Passed</span>
                <StatusPill tone="orange">State: REVIEW</StatusPill>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 6 — DIGITAL TWIN / WHAT-IF */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-status-teal">Organizational Sandbox</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            What could change?
          </h2>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Current State */}
            <div className="rounded-2xl border border-border bg-secondary/40 p-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">CURRENT STATE</span>
              <p className="text-3xl font-extrabold text-foreground">78% Risk</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Workload Index: <strong className="text-foreground">2.3x (High)</strong></p>
                <p>Engagement Score: <strong className="text-foreground">5.4 (Low)</strong></p>
                <p>Organizational Exposure: <strong className="text-foreground">94%</strong></p>
              </div>
            </div>

            {/* Simulated State */}
            <div className="rounded-2xl border border-status-teal/40 bg-status-teal-soft p-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-status-teal">SIMULATED STATE</span>
              <p className="text-3xl font-extrabold text-status-teal">54% Risk (-24 pts)</p>
              <div className="space-y-1 text-xs text-foreground/80">
                <p>Workload Index: <strong>Reduced to 1.8x</strong></p>
                <p>Engagement Score: <strong>Improved to 6.6</strong></p>
                <p>Organizational Exposure: <strong>Reduced to 72%</strong></p>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground italic">
            Model-based scenario estimate — not a guaranteed future outcome.
          </p>
        </div>
      </section>

      {/* SECTION 7 — ORGANIZATIONAL MEMORY */}
      <section id="memory" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-status-teal">System of Record</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Every decision leaves a trace.
          </h2>
          <p className="text-sm text-muted-foreground">
            TALVERA remembers what happened after the decision — so future decisions have context.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-4">
            <span>Prediction</span>
            <ChevronRight className="h-4 w-4 text-status-teal" />
            <span>Recommendation</span>
            <ChevronRight className="h-4 w-4 text-status-teal" />
            <span>Approval</span>
            <ChevronRight className="h-4 w-4 text-status-teal" />
            <span>Execution</span>
            <ChevronRight className="h-4 w-4 text-status-teal" />
            <span>Outcome</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-2xl bg-secondary/50 p-4">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Expected Risk Change</p>
              <p className="text-xl font-bold text-foreground">-15 pts</p>
            </div>
            <div className="rounded-2xl bg-secondary/50 p-4">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Actual Risk Change</p>
              <p className="text-xl font-bold text-status-teal">-18 pts</p>
            </div>
            <div className="rounded-2xl bg-status-green-soft p-4 text-status-green">
              <p className="text-[10px] font-bold uppercase">Variance</p>
              <p className="text-xl font-bold">+3 pts Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — GOVERNED BY DESIGN */}
      <section id="governance" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/80 text-center">
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-status-teal">Governance</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            AI should assist decisions, not silently make them.
          </h2>
          <p className="text-xl font-bold text-status-pink">
            Prediction is not a decision.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {(["ACT", "REVIEW", "SIMULATE", "WAIT", "DO NOT ACT"] as const).map((action) => (
            <StatusPill
              key={action}
              tone={action === "ACT" ? "teal" : action === "REVIEW" ? "orange" : action === "SIMULATE" ? "purple" : "pink"}
              className="px-5 py-2 text-xs font-bold"
            >
              {action}
            </StatusPill>
          ))}
        </div>
      </section>

      {/* SECTION 9 — TECHNOLOGY */}
      <section id="tech" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/80">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-status-teal">Technology Stack</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Built as a decision system, not a chatbot.
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <TechBox category="Prediction" tech="XGBoost · SHAP · Isolation Forest" />
          <TechBox category="Forecasting" tech="Exponential Smoothing · AR Trend" />
          <TechBox category="Intelligence" tech="NetworkX · Neo4j Graph" />
          <TechBox category="Simulation" tech="Digital Twin · Counterfactual Engine" />
          <TechBox category="Optimization" tech="Google OR-Tools" />
          <TechBox category="Policy RAG" tech="Chroma Vector Database" />
          <TechBox category="Reasoning" tech="Qwen 3.8 Flash Agent" />
          <TechBox category="Execution" tech="EnterPro Workflow Adapter" />
        </div>
      </section>

      {/* SECTION 10 — FINAL CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/80 text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Don’t just predict the workforce. <br />
            Operate the decision.
          </h2>
          <p className="text-base text-muted-foreground">
            Turn workforce signals into governed, evidence-backed action.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            onClick={() => navigate("/talvera/overview")}
            size="lg"
            className="rounded-full bg-primary text-primary-foreground font-bold text-sm px-9 py-6 shadow-xl shadow-primary/20 hover:bg-primary/90"
          >
            Open TALVERA Workspace
            <ArrowRight className="h-4 w-4 text-status-teal" />
          </Button>

          <Button
            onClick={() => handleScrollTo("loop")}
            variant="outline"
            size="lg"
            className="rounded-full border-border bg-card font-bold text-sm px-8 py-6 hover:bg-accent"
          >
            Explore the decision loop
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/80 py-8 px-4 text-center text-xs text-muted-foreground bg-card">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Hexagon className="h-4 w-4 text-primary" />
            TALVERA — The AI Workforce Decision Operating System.
          </div>
          <p>© {new Date().getFullYear()} TALVERA Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function TechBox({ category, tech }: { category: string; tech: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-wider text-status-teal">{category}</p>
      <p className="font-semibold text-foreground leading-snug">{tech}</p>
    </div>
  );
}
