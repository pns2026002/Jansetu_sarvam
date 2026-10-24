import React from "react";
import { MOCK_INVENTORY } from "@/lib/demo-data";
import { Boxes, ShieldAlert, LifeBuoy, Truck, HeartPulse, UtensilsCrossed, Users } from "lucide-react";

interface ResourcePanelProps {
  uiLang: "en" | "hi";
}

export function ResourcePanel({ uiLang }: ResourcePanelProps) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "rescue_boat":
        return LifeBuoy;
      case "ambulance":
        return Truck;
      case "medical_kit":
        return HeartPulse;
      case "food_package":
        return UtensilsCrossed;
      case "rescue_team":
        return Users;
      default:
        return Boxes;
    }
  };

  return (
    <div className="rounded-lg bg-surface border border-surface-border p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-violet-500/10 text-violet-accent">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              {uiLang === "hi" ? "स्थानीय मॉक इन्वेंट्री" : "Tactical Resource Stock"}
            </h3>
            <p className="text-[11px] text-text-muted">
              {uiLang === "hi" ? "हार्डकोडेड डेमो स्टॉक — कोई लाइव फ्लीट नहीं" : "Local Mock Inventory • Deterministic Matching"}
            </p>
          </div>
        </div>

        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          SIMULATED
        </span>
      </div>

      <div className="space-y-2.5">
        {MOCK_INVENTORY.map((item) => {
          const Icon = getResourceIcon(item.type);
          return (
            <div
              key={item.type}
              className="p-2.5 rounded-md bg-surface-raised border border-surface-border flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-surface border border-surface-border text-primary">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-text-primary">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-text-muted capitalize">
                    Category: {item.type.replace("_", " ")}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-cyan-400">
                  {item.available}
                </span>
                <span className="text-[10px] text-text-muted ml-1">
                  {item.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-2.5 rounded bg-surface-raised/50 border border-surface-border/50 flex items-start gap-2 text-[11px] text-text-muted">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
        <span>
          Availability is checked instantly via deterministic code without incurring additional AI API costs or making external dispatch requests.
        </span>
      </div>
    </div>
  );
}
