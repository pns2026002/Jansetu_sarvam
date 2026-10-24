"use client";

import React from "react";
import { Shield, Search, RefreshCw, AlertOctagon, Zap, Globe } from "lucide-react";

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  uiLang: "en" | "hi";
  onToggleLang: () => void;
  onResetDemo: () => void;
  incidentCount: number;
}

export function Topbar({
  searchQuery,
  onSearchChange,
  uiLang,
  onToggleLang,
  onResetDemo,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-surface-border bg-[#08111F]/90 backdrop-blur-md px-4 py-3 sm:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-primary/40 shadow-sm shadow-primary/20">
            <Shield className="w-5 h-5 text-primary" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-text-primary">
                JANSETU AI
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500/15 border border-amber-500/40 text-amber-300 rounded">
                SIMULATED DEMO
              </span>
            </div>
            <p className="text-xs text-text-secondary hidden sm:block">
              {uiLang === "hi"
                ? "हर आवाज़ एक संकेत बनती है। हर संकेत एक कार्रवाई बनता है।"
                : "Every voice becomes a signal. Every signal becomes an action."}
            </p>
          </div>
        </div>

        {/* Search bar & Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64 min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder={uiLang === "hi" ? "घटना या स्थान खोजें..." : "Search incidents or locations..."}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-surface border border-surface-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Budget & Model badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-surface border border-surface-border text-text-secondary">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span>₹100 Budget Mode</span>
            <span className="text-text-muted">• 1 Call / Report</span>
          </div>

          {/* Safety Disclaimer pill */}
          <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-surface border border-surface-border text-amber-300/80">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Decision Support Only</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-surface-raised border border-surface-border text-text-primary hover:border-primary/50 transition-colors"
            title="Toggle Hindi/English UI"
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold">{uiLang === "hi" ? "हिंदी" : "EN"}</span>
          </button>

          {/* Reset Demo State button */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-surface border border-surface-border text-text-secondary hover:text-text-primary hover:border-slate-500 transition-colors"
            title="Reset to 3 standard seeded demo incidents"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
