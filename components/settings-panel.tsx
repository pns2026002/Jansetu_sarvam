import React from "react";
import { Sliders, Key, Shield, RefreshCw, CheckCircle2, AlertCircle, FileCode } from "lucide-react";

interface SettingsPanelProps {
  onResetDemo: () => void;
  uiLang: "en" | "hi";
}

export function SettingsPanel({ onResetDemo, uiLang }: SettingsPanelProps) {
  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="p-4 rounded-lg bg-surface border border-surface-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded bg-primary/10 text-primary">
            <Sliders className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-text-primary">
            {uiLang === "hi" ? "सिस्टम और API विन्यास" : "System & API Configuration"}
          </h2>
        </div>
        <p className="text-xs text-text-muted">
          Operational parameters, environment secrets guidance, and test data management.
        </p>
      </div>

      {/* API Key Instructions */}
      <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-3">
        <div className="flex items-center gap-2 text-text-primary font-semibold text-xs">
          <Key className="w-4 h-4 text-primary" />
          <span>Sarvam API Key Setup (.env.local)</span>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          JANSETU AI enforces strict server-side key security. Keys are never exposed to client browsers or bundled into static assets.
        </p>

        <div className="p-3 rounded bg-surface-raised border border-surface-border font-mono text-xs text-cyan-300">
          <span className="text-text-muted"># .env.local (in project root)</span>
          <br />
          SARVAM_API_KEY=your_sarvam_subscription_key_here
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Server Endpoint: https://api.sarvam.ai/v1/chat/completions (model: sarvam-105b)</span>
        </div>
      </div>

      {/* Safety & Compliance Card */}
      <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-2">
        <div className="flex items-center gap-2 text-text-primary font-semibold text-xs">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Decision Support Guardrails</span>
        </div>

        <ul className="space-y-1.5 text-xs text-text-secondary pl-5 list-disc marker:text-primary">
          <li><strong>Zero Autonomous Dispatch:</strong> System produces structured decision-support incident cards for human dispatchers.</li>
          <li><strong>Deterministic Resource Arithmetic:</strong> Suggested needs are strictly matched against mock inventory with mathematical formulas, not generative hallucination.</li>
          <li><strong>Distinction of Ground Truth:</strong> Facts are labeled as <em>Citizen Reported</em>, <em>AI Inferred</em>, or <em>Unknown</em>.</li>
        </ul>
      </div>

      {/* Test Data Control */}
      <div className="p-4 rounded-lg bg-surface border border-surface-border flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-text-primary">Reset Demo Incident State</h4>
          <p className="text-[11px] text-text-muted">
            Restore the 3 standard seeded demo reports (Flood, Highway Crash, Power Outage).
          </p>
        </div>

        <button
          onClick={onResetDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-raised border border-surface-border hover:border-primary/50 text-xs font-medium text-text-primary transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-primary" />
          <span>Reset Demo Incidents</span>
        </button>
      </div>
    </div>
  );
}
