"use client";

import React from "react";
import { IncidentRecord } from "@/types/incident";
import { SeverityBadge } from "./severity-badge";
import { matchResources } from "@/lib/resource-matcher";
import {
  X,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  ShieldCheck,
  FileText,
  Boxes,
  MessageSquare,
  Cpu,
  ChevronRight,
  Info,
} from "lucide-react";

interface IncidentDetailDrawerProps {
  incident: IncidentRecord | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: "reviewed" | "needs_verification") => void;
  uiLang: "en" | "hi";
}

export function IncidentDetailDrawer({
  incident,
  onClose,
  onUpdateStatus,
  uiLang,
}: IncidentDetailDrawerProps) {
  if (!incident) return null;

  const resourceMatches = matchResources(incident.analysis.resource_requirements);

  const getEvidenceStatusPill = (status: string) => {
    switch (status) {
      case "reported":
        return {
          label: "Citizen Reported",
          color: "bg-blue-500/15 text-blue-300 border-blue-500/30",
        };
      case "inferred":
        return {
          label: "AI Inferred",
          color: "bg-purple-500/15 text-purple-300 border-purple-500/30",
        };
      case "verified":
        return {
          label: "Verified",
          color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        };
      default:
        return {
          label: "Unknown / Unconfirmed",
          color: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        };
    }
  };

  const locPill = getEvidenceStatusPill(incident.analysis.location.status);
  const peoplePill = getEvidenceStatusPill(incident.analysis.people_affected.status);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0d1726] border-l border-surface-border h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-surface-border bg-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-text-primary">
                  {incident.id}
                </h2>
                <SeverityBadge severity={incident.analysis.severity} />
                {incident.is_demo && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    SIMULATED
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Logged: {new Date(incident.timestamp).toLocaleString()}</span>
                <span>•</span>
                <span>Category: <strong className="text-text-primary capitalize">{incident.analysis.category.replace("_", " ")}</strong></span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Side by side: Original report vs AI Extraction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Citizen Report */}
            <div className="p-3.5 rounded-lg bg-surface border border-surface-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Original Citizen Submission</span>
                </div>
                <span className="text-[10px] font-mono text-text-muted uppercase">
                  Lang: {incident.language}
                </span>
              </div>
              <p className="text-xs text-text-primary bg-surface-raised p-2.5 rounded border border-surface-border/50 font-serif italic leading-relaxed whitespace-pre-wrap">
                "{incident.original_text}"
              </p>
            </div>

            {/* AI Structured Summary */}
            <div className="p-3.5 rounded-lg bg-surface border border-surface-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                  <Cpu className="w-3.5 h-3.5 text-violet-accent" />
                  <span>Sarvam Triage Summary</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">
                  Confidence: {Math.round(incident.analysis.confidence * 100)}%
                </span>
              </div>
              <p className="text-xs text-text-primary bg-surface-raised p-2.5 rounded border border-surface-border/50 leading-relaxed">
                {incident.analysis.summary}
              </p>
            </div>
          </div>

          {/* Evidence Extraction Table */}
          <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Extracted Incident Evidence</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-surface-raised border border-surface-border/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-text-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    Reported Location
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${locPill.color}`}>
                    {locPill.label}
                  </span>
                </div>
                <p className="font-semibold text-text-primary">
                  {incident.analysis.location.value || "Not explicitly specified"}
                </p>
              </div>

              <div className="p-2.5 rounded bg-surface-raised border border-surface-border/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-text-muted flex items-center gap-1">
                    <Users className="w-3 h-3 text-primary" />
                    Affected Persons
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${peoplePill.color}`}>
                    {peoplePill.label}
                  </span>
                </div>
                <p className="font-semibold text-text-primary">
                  {incident.analysis.people_affected.value || "Casualty count unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* Missing Information / Unknowns */}
          <div className="p-4 rounded-lg bg-surface border border-amber-500/30 bg-amber-500/5 space-y-2">
            <h3 className="text-xs font-bold text-amber-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Critical Missing Information & Unknowns (Requires Verification)</span>
            </h3>
            {incident.analysis.missing_information && incident.analysis.missing_information.length > 0 ? (
              <ul className="space-y-1 text-xs text-text-secondary pl-5 list-disc marker:text-amber-400">
                {incident.analysis.missing_information.map((info, idx) => (
                  <li key={idx}>{info}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-text-muted">No explicit missing information flagged.</p>
            )}
          </div>

          {/* Recommended Actions */}
          <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-primary" />
              <span>Recommended Operator Actions (Decision Support)</span>
            </h3>
            <div className="space-y-1.5">
              {incident.analysis.recommended_actions.map((act, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-text-primary p-2 rounded bg-surface-raised border border-surface-border/40">
                  <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deterministic Resource Matching */}
          <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                <Boxes className="w-3.5 h-3.5 text-violet-accent" />
                <span>Deterministic Resource Matcher</span>
              </h3>
              <span className="text-[10px] text-text-muted">
                Calculated against local mock inventory
              </span>
            </div>

            {resourceMatches.length > 0 ? (
              <div className="space-y-2">
                {resourceMatches.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-surface-raised border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-text-primary capitalize">
                          {res.type.replace("_", " ")}
                        </strong>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase border ${
                            res.status === "available"
                              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                              : res.status === "shortfall"
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              : "bg-slate-500/15 text-slate-300 border-slate-500/30"
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>
                      {res.reason && (
                        <p className="text-[11px] text-text-muted mt-0.5">
                          Rationale: {res.reason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs sm:self-center">
                      <div className="text-center px-2 py-1 rounded bg-surface border border-surface-border/80">
                        <span className="text-[10px] text-text-muted block">Req</span>
                        <span className="font-bold text-text-primary">{res.requested}</span>
                      </div>
                      <div className="text-center px-2 py-1 rounded bg-surface border border-surface-border/80">
                        <span className="text-[10px] text-text-muted block">Stock</span>
                        <span className="font-bold text-cyan-400">{res.available}</span>
                      </div>
                      <div className="text-center px-2 py-1 rounded bg-surface border border-surface-border/80">
                        <span className="text-[10px] text-text-muted block">Shortfall</span>
                        <span className={`font-bold ${res.shortfall > 0 ? "text-red-400" : "text-emerald-400"}`}>
                          {res.shortfall}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted">No specific field resources flagged for this incident.</p>
            )}
          </div>

          {/* Citizen Reassurance Response */}
          {incident.analysis.citizen_response && (
            <div className="p-3.5 rounded-lg bg-surface border border-surface-border">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                <span>Suggested Citizen SMS/IVR Response (Language Matched)</span>
              </div>
              <p className="text-xs text-text-primary bg-surface-raised p-2 rounded border border-surface-border/50 italic">
                "{incident.analysis.citizen_response}"
              </p>
            </div>
          )}

          {/* Token Usage & Debug Metadata */}
          {incident.tokens_used && (
            <div className="p-2.5 rounded bg-surface border border-surface-border/60 text-[11px] text-text-muted flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-text-secondary" />
                <span>Tokens: {incident.tokens_used.prompt_tokens ?? 0} in / {incident.tokens_used.completion_tokens ?? 0} out</span>
              </div>
              <span>Est. Cost: ~₹{(((incident.tokens_used.prompt_tokens ?? 0) * 0.00002928) + ((incident.tokens_used.completion_tokens ?? 0) * 0.0000732)).toFixed(4)}</span>
            </div>
          )}
        </div>

        {/* Footer Human Review Controls */}
        <div className="p-4 border-t border-surface-border bg-surface flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Human review mandatory before any field dispatch</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onUpdateStatus(incident.id, "needs_verification")}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded text-xs font-medium border transition-colors ${
                incident.review_status === "needs_verification"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                  : "bg-surface-raised hover:bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              Flag: Needs Verification
            </button>

            <button
              onClick={() => onUpdateStatus(incident.id, "reviewed")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded text-xs font-medium border transition-colors ${
                incident.review_status === "reviewed"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                  : "bg-emerald-500 text-[#08111F] font-semibold hover:bg-emerald-400 border-emerald-400"
              }`}
            >
              Mark Reviewed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
