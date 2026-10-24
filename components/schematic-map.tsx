"use client";

import React from "react";
import { IncidentRecord } from "@/types/incident";
import { Compass, Crosshair, AlertTriangle, ShieldCheck } from "lucide-react";

interface SchematicMapProps {
  incidents: IncidentRecord[];
  onSelectIncident: (inc: IncidentRecord) => void;
  uiLang: "en" | "hi";
}

export function SchematicMap({ incidents, onSelectIncident, uiLang }: SchematicMapProps) {
  // Map simulated incident positions onto sectors
  const sectorMapping = [
    { sector: "Sector A-1 (North)", coords: { x: "28%", y: "25%" } },
    { sector: "Sector B-3 (East Bypass)", coords: { x: "72%", y: "38%" } },
    { sector: "Sector C-7 (Municipal Core)", coords: { x: "48%", y: "65%" } },
    { sector: "Sector D-2 (South District)", coords: { x: "22%", y: "78%" } },
    { sector: "Sector E-5 (West Perimeter)", coords: { x: "80%", y: "75%" } },
  ];

  return (
    <div className="rounded-lg bg-surface border border-surface-border p-4 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-primary/10 text-primary">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              {uiLang === "hi" ? "आरेखी सामरिक ग्रिड" : "Schematic Tactical Grid"}
            </h3>
            <p className="text-[11px] text-text-muted">
              {uiLang === "hi" ? "काल्पनिक स्थिति ग्रिड — कोई लाइव GPS नहीं" : "Illustrative Sector Schematic • No Live GPS"}
            </p>
          </div>
        </div>

        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          SCHEMATIC
        </span>
      </div>

      {/* Grid Canvas */}
      <div className="relative w-full h-64 sm:h-72 rounded-lg bg-[#060d17] border border-surface-border overflow-hidden p-3 flex flex-col justify-between">
        {/* Subtle grid lines background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#101e33_1px,transparent_1px),linear-gradient(to_bottom,#101e33_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

        {/* Circular Radar Sweep Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-primary/20 pointer-events-none">
          <div className="w-full h-full rounded-full border border-dashed border-primary/10" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-violet-500/20 pointer-events-none" />

        {/* Tactical Crosshairs */}
        <div className="absolute top-3 right-3 text-text-muted flex items-center gap-1 text-[10px] font-mono">
          <Crosshair className="w-3.5 h-3.5 text-primary" />
          <span>GRID 28°N 77°E (REF)</span>
        </div>

        {/* Sector Labels */}
        <div className="relative z-10 grid grid-cols-2 gap-4 text-[10px] font-mono text-text-muted select-none pointer-events-none">
          <div>ZONE-1 [FLOOD PLAIN]</div>
          <div className="text-right">ZONE-2 [CORRIDOR]</div>
        </div>

        {/* Incident pins plotted on the grid */}
        <div className="relative z-20 flex-1">
          {incidents.slice(0, 5).map((inc, idx) => {
            const pos = sectorMapping[idx % sectorMapping.length].coords;
            const isCritical = inc.analysis.severity === "critical";
            const isHigh = inc.analysis.severity === "high";

            return (
              <button
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                style={{ top: pos.y, left: pos.x }}
                title={`${inc.id}: ${inc.analysis.summary}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className={`absolute w-7 h-7 rounded-full animate-ping opacity-75 ${
                      isCritical
                        ? "bg-red-500"
                        : isHigh
                        ? "bg-amber-500"
                        : "bg-cyan-500"
                    }`}
                  />
                  <div
                    className={`relative flex items-center justify-center w-5 h-5 rounded-full border shadow-md transition-transform group-hover:scale-125 ${
                      isCritical
                        ? "bg-red-500/80 border-red-300 text-white"
                        : isHigh
                        ? "bg-amber-500/80 border-amber-300 text-white"
                        : "bg-primary/80 border-primary text-[#08111F]"
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                  </div>
                </div>

                <div className="mt-1 px-1.5 py-0.5 rounded bg-[#08111F]/90 border border-surface-border text-[9px] font-mono text-text-primary whitespace-nowrap hidden group-hover:block z-30 shadow-lg">
                  {inc.id} • {inc.analysis.category}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Disclaimer */}
        <div className="relative z-10 flex items-center justify-between text-[10px] text-text-muted border-t border-surface-border/50 pt-2 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-primary" />
            SYNTHETIC SECTOR GRID
          </span>
          <span>DEMO DATA ONLY</span>
        </div>
      </div>
    </div>
  );
}
