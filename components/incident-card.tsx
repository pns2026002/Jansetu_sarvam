import React from "react";
import { IncidentRecord } from "@/types/incident";
import { SeverityBadge } from "./severity-badge";
import {
  MapPin,
  Users,
  Clock,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  ChevronRight,
  Flame,
  Droplets,
  Car,
  Zap,
  Activity,
} from "lucide-react";

interface IncidentCardProps {
  incident: IncidentRecord;
  isSelected: boolean;
  onSelect: (incident: IncidentRecord) => void;
  uiLang: "en" | "hi";
}

export function IncidentCard({ incident, isSelected, onSelect, uiLang }: IncidentCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "flooding":
        return Droplets;
      case "road_accident":
        return Car;
      case "power_outage":
        return Zap;
      case "medical":
        return Activity;
      default:
        return Flame;
    }
  };

  const CategoryIcon = getCategoryIcon(incident.analysis.category);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reviewed":
        return {
          label: uiLang === "hi" ? "सत्यापित" : "Reviewed",
          icon: CheckCircle,
          className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        };
      case "needs_verification":
        return {
          label: uiLang === "hi" ? "सत्यापन आवश्यक" : "Needs Verification",
          icon: HelpCircle,
          className: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        };
      default:
        return {
          label: uiLang === "hi" ? "अपरिपक्व / अनिर्णित" : "Unreviewed",
          icon: AlertCircle,
          className: "bg-slate-500/15 text-slate-300 border-slate-500/30",
        };
    }
  };

  const statusBadge = getStatusBadge(incident.review_status);
  const StatusIcon = statusBadge.icon;

  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return ts;
    }
  };

  return (
    <div
      onClick={() => onSelect(incident)}
      className={`group relative rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-surface-raised border-primary shadow-md shadow-primary/10"
          : "bg-surface border-surface-border hover:border-primary/40 hover:bg-surface-raised/70"
      }`}
    >
      {/* Top row: ID, Category, Badges */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded bg-surface-border/60 text-primary">
            <CategoryIcon className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-mono font-semibold text-text-primary">
            {incident.id}
          </span>
          {incident.is_demo && (
            <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
              SIMULATED
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <SeverityBadge severity={incident.analysis.severity} />
        </div>
      </div>

      {/* Summary */}
      <p className="mt-2 text-xs font-medium text-text-primary line-clamp-2 leading-relaxed">
        {incident.analysis.summary}
      </p>

      {/* Extracted Reported Data */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-text-secondary border-t border-surface-border/60 pt-2.5">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
          <span className="truncate">
            {incident.analysis.location.value || "Location unspecified"}
          </span>
          <span className="text-[10px] text-text-muted">
            ({incident.analysis.location.status})
          </span>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <Users className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
          <span className="truncate">
            {incident.analysis.people_affected.value || "Casualty count unknown"}
          </span>
        </div>
      </div>

      {/* Footer row: Status pill + Timestamp + Arrow */}
      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-surface-border/40 text-[11px]">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusBadge.className}`}
          >
            <StatusIcon className="w-3 h-3" />
            <span>{statusBadge.label}</span>
          </span>

          <div className="flex items-center gap-1 text-text-muted">
            <Clock className="w-3 h-3" />
            <span>{formatTime(incident.timestamp)}</span>
          </div>
        </div>

        <div className="flex items-center text-text-muted group-hover:text-primary transition-colors text-xs font-medium">
          <span className="hidden sm:inline">Details</span>
          <ChevronRight className="w-4 h-4 ml-0.5" />
        </div>
      </div>
    </div>
  );
}
