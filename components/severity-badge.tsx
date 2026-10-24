import React from "react";
import { SeverityLevel } from "@/types/incident";
import { AlertTriangle, AlertCircle, Info, ShieldAlert, HelpCircle } from "lucide-react";

interface SeverityBadgeProps {
  severity: SeverityLevel;
  showIcon?: boolean;
  prefixSuggested?: boolean;
  className?: string;
}

export function SeverityBadge({
  severity,
  showIcon = true,
  prefixSuggested = true,
  className = "",
}: SeverityBadgeProps) {
  const configs = {
    critical: {
      label: "Critical",
      bg: "bg-red-500/15 border-red-500/40 text-red-400",
      icon: ShieldAlert,
    },
    high: {
      label: "High",
      bg: "bg-amber-500/15 border-amber-500/40 text-amber-400",
      icon: AlertTriangle,
    },
    medium: {
      label: "Medium",
      bg: "bg-yellow-500/15 border-yellow-500/40 text-yellow-300",
      icon: AlertCircle,
    },
    low: {
      label: "Low",
      bg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
      icon: Info,
    },
    undetermined: {
      label: "Undetermined",
      bg: "bg-slate-500/15 border-slate-500/40 text-slate-300",
      icon: HelpCircle,
    },
  };

  const config = configs[severity] || configs.undetermined;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}
      title={prefixSuggested ? "AI Suggested Priority (Requires human operator review)" : undefined}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>
        {prefixSuggested ? `Suggested: ${config.label}` : config.label}
      </span>
    </span>
  );
}
