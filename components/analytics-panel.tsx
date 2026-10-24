import React from "react";
import { IncidentRecord } from "@/types/incident";
import { BarChart3, PieChart, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

interface AnalyticsPanelProps {
  incidents: IncidentRecord[];
  uiLang: "en" | "hi";
}

export function AnalyticsPanel({ incidents, uiLang }: AnalyticsPanelProps) {
  const total = incidents.length;

  const categoryCounts: Record<string, number> = {};
  const severityCounts: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    undetermined: 0,
  };
  const reviewCounts: Record<string, number> = {
    unreviewed: 0,
    reviewed: 0,
    needs_verification: 0,
  };

  let totalTokens = 0;

  incidents.forEach((inc) => {
    categoryCounts[inc.analysis.category] = (categoryCounts[inc.analysis.category] || 0) + 1;
    severityCounts[inc.analysis.severity] = (severityCounts[inc.analysis.severity] || 0) + 1;
    reviewCounts[inc.review_status] = (reviewCounts[inc.review_status] || 0) + 1;
    if (inc.tokens_used?.total_tokens) {
      totalTokens += inc.tokens_used.total_tokens;
    }
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-lg bg-surface border border-surface-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded bg-primary/10 text-primary">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-text-primary">
            {uiLang === "hi" ? "संचालन विश्लेषण व बजट ऑडिट" : "Operations & Budget Analytics"}
          </h2>
        </div>
        <p className="text-xs text-text-muted">
          Deterministic aggregations computed locally from active incident memory. Zero supplementary API overhead.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Severity Distribution */}
        <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-primary" />
            <span>AI Suggested Severity</span>
          </h3>

          <div className="space-y-2">
            {[
              { key: "critical", label: "Critical", color: "bg-red-500", count: severityCounts.critical },
              { key: "high", label: "High", color: "bg-amber-500", count: severityCounts.high },
              { key: "medium", label: "Medium", color: "bg-yellow-400", count: severityCounts.medium },
              { key: "low", label: "Low", color: "bg-emerald-400", count: severityCounts.low },
            ].map((item) => (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">{item.label}</span>
                  <span className="font-semibold text-text-primary">{item.count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-raised overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${total ? (item.count / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Categories */}
        <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-violet-accent" />
            <span>Incident Categorization</span>
          </h3>

          <div className="space-y-2">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs capitalize">
                  <span className="text-text-secondary">{cat.replace("_", " ")}</span>
                  <span className="font-semibold text-text-primary">{count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-raised overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{ width: `${total ? (count / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Human Verification State */}
        <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Human Review Status</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-2.5 rounded bg-surface-raised border border-surface-border/60 flex justify-between items-center">
              <span className="text-text-secondary">Needs Verification:</span>
              <span className="font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                {reviewCounts.needs_verification}
              </span>
            </div>

            <div className="p-2.5 rounded bg-surface-raised border border-surface-border/60 flex justify-between items-center">
              <span className="text-text-secondary">Marked Reviewed:</span>
              <span className="font-bold text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                {reviewCounts.reviewed}
              </span>
            </div>

            <div className="p-2.5 rounded bg-surface-raised border border-surface-border/60 flex justify-between items-center">
              <span className="text-text-secondary">Pending Operator:</span>
              <span className="font-bold text-slate-300 px-2 py-0.5 rounded bg-slate-500/10 border border-slate-500/30">
                {reviewCounts.unreviewed}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Credit & Token Efficiency Card */}
      <div className="p-4 rounded-lg bg-surface border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary">
              ₹100 Budget Telemetry & Efficiency
            </h4>
            <p className="text-xs text-text-muted">
              Cumulative session token usage: <strong className="text-cyan-400 font-mono">{totalTokens} tokens</strong> (~₹{(totalTokens * 0.00005).toFixed(4)})
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-400 block">
            Budget Burn Rate: Minimal
          </span>
          <span className="text-[11px] text-text-muted">
            1 call per report • Single extraction cycle
          </span>
        </div>
      </div>
    </div>
  );
}
