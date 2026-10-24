"use client";

import React from "react";
import {
  LayoutDashboard,
  Radio,
  FileSearch,
  Boxes,
  BarChart3,
  Sliders,
  Cpu,
  Info,
} from "lucide-react";

export type SidebarTab =
  | "overview"
  | "incidents"
  | "evidence"
  | "resources"
  | "analytics"
  | "settings";

interface SidebarProps {
  currentTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  uiLang: "en" | "hi";
  incidentCount: number;
  unverifiedCount: number;
}

export function AppSidebar({
  currentTab,
  onSelectTab,
  uiLang,
  incidentCount,
  unverifiedCount,
}: SidebarProps) {
  const navItems = [
    {
      id: "overview" as const,
      label: uiLang === "hi" ? "कमांड सेंटर" : "Command Centre",
      icon: LayoutDashboard,
    },
    {
      id: "incidents" as const,
      label: uiLang === "hi" ? "घटना फीड" : "Incident Feed",
      icon: Radio,
      badge: incidentCount,
    },
    {
      id: "evidence" as const,
      label: uiLang === "hi" ? "साक्ष्य सत्यापन" : "Evidence Vault",
      icon: FileSearch,
      badge: unverifiedCount > 0 ? unverifiedCount : undefined,
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      id: "resources" as const,
      label: uiLang === "hi" ? "संसाधन स्टॉक" : "Mock Inventory",
      icon: Boxes,
    },
    {
      id: "analytics" as const,
      label: uiLang === "hi" ? "विश्लेषण" : "Triage Analytics",
      icon: BarChart3,
    },
    {
      id: "settings" as const,
      label: uiLang === "hi" ? "सेटिंग्स व API" : "System & API",
      icon: Sliders,
    },
  ];

  return (
    <aside className="w-full md:w-60 flex-shrink-0 flex flex-col justify-between border-r border-surface-border bg-surface p-3 md:min-h-[calc(100vh-65px)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
          {uiLang === "hi" ? "संचालन मेनू" : "Operations Hub"}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/30 shadow-sm shadow-primary/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-raised border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-text-muted"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                    item.badgeColor || "bg-surface-border text-text-primary border-surface-border"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer system health & Sarvam model info */}
      <div className="mt-6 pt-3 border-t border-surface-border/60 space-y-2">
        <div className="p-2.5 rounded bg-surface-raised border border-surface-border/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
            <Cpu className="w-3.5 h-3.5 text-violet-accent" />
            <span>Sarvam-105B Engine</span>
          </div>
          <p className="mt-1 text-[11px] text-text-muted leading-tight">
            Chat Completion v1 • Strict Single-Call Extraction
          </p>
        </div>

        <div className="px-2 py-1.5 flex items-start gap-1.5 text-[10px] text-text-muted">
          <Info className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400 mt-0.5" />
          <span>
            Decision-support prototype. Not connected to real dispatch or authorities.
          </span>
        </div>
      </div>
    </aside>
  );
}
