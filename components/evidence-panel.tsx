import React from "react";
import { IncidentRecord } from "@/types/incident";
import { FileSearch, CheckCircle2, HelpCircle, MapPin, Users, ShieldAlert, ArrowRight } from "lucide-react";
import { SeverityBadge } from "./severity-badge";

interface EvidencePanelProps {
  incidents: IncidentRecord[];
  onSelectIncident: (inc: IncidentRecord) => void;
  uiLang: "en" | "hi";
}

export function EvidencePanel({ incidents, onSelectIncident, uiLang }: EvidencePanelProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-surface border border-surface-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded bg-primary/10 text-primary">
            <FileSearch className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-text-primary">
            {uiLang === "hi" ? "साक्ष्य व सत्यापन तिजोरी" : "Evidence Verification Vault"}
          </h2>
        </div>
        <p className="text-xs text-text-muted leading-relaxed">
          {uiLang === "hi"
            ? "प्रत्येक घटना के मूल नागरिक संदेश को AI निष्कर्षों से सीधे मिलाएं। अज्ञात व असत्यापित जानकारी को अलग रखें।"
            : "Audit citizen claims side-by-side with Sarvam-105B extractions. Keep raw reports separated from inferred assumptions."}
        </p>
      </div>

      <div className="space-y-3">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="p-4 rounded-lg bg-surface border border-surface-border space-y-3 hover:border-primary/40 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-border/60">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-text-primary">
                  {inc.id}
                </span>
                <SeverityBadge severity={inc.analysis.severity} />
                <span className="text-[10px] text-text-muted">
                  Confidence: {Math.round(inc.analysis.confidence * 100)}%
                </span>
              </div>

              <button
                onClick={() => onSelectIncident(inc)}
                className="flex items-center gap-1 text-xs text-primary hover:underline font-medium self-start sm:self-auto"
              >
                <span>Audit & Review Drawer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Raw Report */}
              <div className="p-3 rounded bg-surface-raised border border-surface-border/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">
                  Citizen Raw Claim ({inc.language})
                </span>
                <p className="text-text-primary font-serif italic text-xs leading-relaxed">
                  "{inc.original_text}"
                </p>
              </div>

              {/* Extracted Evidence Status */}
              <div className="p-3 rounded bg-surface-raised border border-surface-border/50 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                  Ground Truth Verification State
                </span>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-secondary flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    Location Status:
                  </span>
                  <span className="font-mono uppercase font-semibold text-text-primary">
                    {inc.analysis.location.status} ({inc.analysis.location.value || "None"})
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-secondary flex items-center gap-1">
                    <Users className="w-3 h-3 text-primary" />
                    Casualty/People Status:
                  </span>
                  <span className="font-mono uppercase font-semibold text-text-primary">
                    {inc.analysis.people_affected.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-secondary flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Operator Review:
                  </span>
                  <span className="font-mono uppercase font-semibold text-cyan-400">
                    {inc.review_status.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Unknowns / Missing Info */}
            {inc.analysis.missing_information && inc.analysis.missing_information.length > 0 && (
              <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[11px] font-semibold text-amber-200">
                    Flagged Unknowns (Must not be assumed verified):
                  </strong>
                  <span className="text-[11px] text-text-secondary">
                    {inc.analysis.missing_information.join(" • ")}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
