import React from "react";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: LucideIcon;
  trend?: string;
  variant?: "primary" | "critical" | "warning" | "success" | "neutral";
}

export function KpiCard({
  label,
  value,
  sublabel,
  icon: Icon,
  variant = "primary",
}: KpiCardProps) {
  const variantStyles = {
    primary: {
      border: "border-primary/30",
      iconBg: "bg-primary/10 text-primary",
      glow: "hover:shadow-primary/10",
    },
    critical: {
      border: "border-red-500/30",
      iconBg: "bg-red-500/10 text-red-400",
      glow: "hover:shadow-red-500/10",
    },
    warning: {
      border: "border-amber-500/30",
      iconBg: "bg-amber-500/10 text-amber-400",
      glow: "hover:shadow-amber-500/10",
    },
    success: {
      border: "border-emerald-500/30",
      iconBg: "bg-emerald-500/10 text-emerald-400",
      glow: "hover:shadow-emerald-500/10",
    },
    neutral: {
      border: "border-surface-border",
      iconBg: "bg-surface-raised text-text-secondary",
      glow: "hover:shadow-slate-500/10",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-surface border ${style.border} p-4 transition-all duration-200 hover:shadow-lg ${style.glow}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            {value}
          </p>
          {sublabel && (
            <p className="mt-0.5 text-[11px] text-text-muted">
              {sublabel}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg border border-white/5 ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
