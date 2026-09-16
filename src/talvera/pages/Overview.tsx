import { CheckCircle2, ShieldCheck, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MetricCard } from "@/talvera/components/shared/MetricCard";
import { TrendBadge } from "@/talvera/components/shared/TrendBadge";
import { AlertCard } from "@/talvera/components/shared/AlertCard";
import { departments } from "@/talvera/data/departments";
import { getEmployeeById } from "@/talvera/data/employees";

const rahul = getEmployeeById("rahul-sharma")!;
const overviewDepartments = departments.slice(0, 4);
const riskTrend = [38, 41, 44, 47, 46, 52, 58, 61];

export default function Overview() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex items-center rounded-full border border-status-teal/40 bg-status-teal-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-status-teal">
            Workforce Intelligence Platform
          </span>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-[34px]">
            Workforce intelligence, backed by evidence.
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            See workforce risk before it becomes workforce loss. Predict, diagnose, intervene, and simulate.
          </p>
        </div>
        <MetricCard label="Workforce Health" value="74 /100" className="w-full max-w-[180px]" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_1fr]">
        {/* Left hero — TALVERA CORE */}
        <Card className="relative overflow-hidden border-status-green/30 bg-status-green-soft">
          <CardContent className="relative flex h-full min-h-[440px] flex-col gap-4 p-6">
            <span className="inline-flex w-fit items-center rounded-full bg-card px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-status-green">
              Talvera Core
            </span>
            <h2 className="max-w-sm text-2xl font-bold leading-tight text-foreground">
              See the workforce before the problem appears.
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI-powered workforce intelligence connecting risk, skills, policy and action.
            </p>

            <div className="relative mt-4 flex-1">
              {/* Mini window: workforce overview */}
              <div className="absolute left-0 top-0 w-[72%] rounded-2xl border border-border bg-card p-4 shadow-lg sm:w-[62%]">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Workforce Overview
                </p>
                <div className="mt-3 space-y-2.5">
                  {overviewDepartments.map((department) => (
                    <div key={department.name} className="flex items-center gap-2">
                      <span className="w-16 shrink-0 text-[11px] text-muted-foreground">{department.name}</span>
                      <div className="h-1.5 flex-1 rounded-full bg-muted">
                        <div
                          className="h-1.5 rounded-full bg-primary"
                          style={{ width: `${department.headcountShare * 2.4}%` }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-[11px] font-semibold text-foreground">
                        {department.headcountShare}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating employee window */}
              <div className="absolute right-0 top-[38%] w-[74%] rounded-2xl border border-border bg-card p-4 shadow-xl sm:w-[64%]">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{rahul.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {rahul.department} · {rahul.tenureYears} years
                    </p>
                  </div>
                  <span className="rounded-full bg-status-pink-soft px-2 py-0.5 text-[10px] font-bold text-status-pink">
                    {rahul.attritionRisk}%
                  </span>
                </div>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Attrition Risk
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">
                    Confidence: <span className="font-semibold text-foreground">{rahul.confidence.toUpperCase()} ({rahul.confidencePct}%)</span>
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Top factor: <span className="font-semibold text-foreground">{rahul.topFactor}</span>
                </p>
              </div>

              {/* Assessment complete pill */}
              <div className="absolute bottom-0 left-[6%] flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-md">
                <CheckCircle2 className="h-3.5 w-3.5 text-status-green" />
                AI Assessment Complete
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-status-teal">
              <ShieldCheck className="h-3.5 w-3.5" />
              Evidence Verified
            </div>
          </CardContent>
        </Card>

        {/* Right hero — Workforce Risk */}
        <Card className="relative overflow-hidden border-status-orange/25 bg-status-orange-soft">
          <CardContent className="flex h-full min-h-[440px] flex-col gap-4 p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center rounded-full bg-card px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-status-orange">
                Workforce Risk
              </span>
              <TrendBadge value={8.4} tone="pink" />
            </div>

            <div>
              <p className="text-5xl font-extrabold tracking-tight text-foreground">203</p>
              <p className="mt-1 text-sm text-muted-foreground">employees requiring attention</p>
            </div>

            <div className="flex items-end gap-1.5">
              {riskTrend.map((value, index) => (
                <div key={index} className="flex-1 rounded-t-sm bg-status-orange/70" style={{ height: `${value}px` }} />
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              Rising trend over the last 8 weeks
            </div>

            <div className="mt-auto">
              <AlertCard
                tone="pink"
                title="Emerging signal"
                description="Engineering risk increased 12% this month."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
