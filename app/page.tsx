"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Topbar } from "@/components/topbar";
import { AppSidebar, SidebarTab } from "@/components/app-sidebar";
import { KpiCard } from "@/components/kpi-card";
import { IncidentIntake } from "@/components/incident-intake";
import { IncidentCard } from "@/components/incident-card";
import { IncidentDetailDrawer } from "@/components/incident-detail-drawer";
import { ResourcePanel } from "@/components/resource-panel";
import { SchematicMap } from "@/components/schematic-map";
import { EvidencePanel } from "@/components/evidence-panel";
import { AnalyticsPanel } from "@/components/analytics-panel";
import { SettingsPanel } from "@/components/settings-panel";
import { EmptyState } from "@/components/empty-state";
import { IncidentRecord } from "@/types/incident";
import {
  loadStoredIncidents,
  saveStoredIncidents,
  resetToDemoIncidents,
} from "@/lib/storage";
import { MOCK_INVENTORY } from "@/lib/demo-data";
import {
  Radio,
  AlertTriangle,
  Boxes,
  HelpCircle,
  Filter,
  CheckCircle2,
  X,
  Layers,
} from "lucide-react";

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);
  const [currentTab, setCurrentTab] = useState<SidebarTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [uiLang, setUiLang] = useState<"en" | "hi">("en");

  // Filters
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Load initial incidents from localStorage or seeded default
  useEffect(() => {
    const loaded = loadStoredIncidents();
    setIncidents(loaded);
  }, []);

  // Update incident review status
  const handleUpdateStatus = (id: string, status: "reviewed" | "needs_verification") => {
    const updated = incidents.map((inc) => {
      if (inc.id === id) {
        return {
          ...inc,
          review_status: status,
          reviewed_at: new Date().toISOString(),
        };
      }
      return inc;
    });

    setIncidents(updated);
    saveStoredIncidents(updated);

    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident({
        ...selectedIncident,
        review_status: status,
        reviewed_at: new Date().toISOString(),
      });
    }
  };

  // Handle newly analyzed incident from Sarvam
  const handleNewIncident = (newIncident: IncidentRecord) => {
    const updated = [newIncident, ...incidents];
    setIncidents(updated);
    saveStoredIncidents(updated);
    setSelectedIncident(newIncident);
  };

  // Reset to seeded demo reports
  const handleResetDemo = () => {
    const reset = resetToDemoIncidents();
    setIncidents(reset);
    setSelectedIncident(null);
  };

  // Toggle UI language
  const handleToggleLang = () => {
    setUiLang((prev) => (prev === "en" ? "hi" : "en"));
  };

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSummary = inc.analysis.summary.toLowerCase().includes(q);
        const matchesRaw = inc.original_text.toLowerCase().includes(q);
        const matchesLoc = (inc.analysis.location.value || "").toLowerCase().includes(q);
        const matchesId = inc.id.toLowerCase().includes(q);
        if (!matchesSummary && !matchesRaw && !matchesLoc && !matchesId) {
          return false;
        }
      }

      // Severity check
      if (severityFilter !== "all" && inc.analysis.severity !== severityFilter) {
        return false;
      }

      // Category check
      if (categoryFilter !== "all" && inc.analysis.category !== categoryFilter) {
        return false;
      }

      // Review status check
      if (statusFilter !== "all" && inc.review_status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [incidents, searchQuery, severityFilter, categoryFilter, statusFilter]);

  // Aggregate KPI counts
  const totalIncidents = incidents.length;
  const highOrCriticalCount = incidents.filter(
    (i) => i.analysis.severity === "critical" || i.analysis.severity === "high"
  ).length;
  const unverifiedCount = incidents.filter(
    (i) => i.review_status === "needs_verification" || i.review_status === "unreviewed"
  ).length;
  const totalAvailableStock = MOCK_INVENTORY.reduce((acc, curr) => acc + curr.available, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <Topbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        uiLang={uiLang}
        onToggleLang={handleToggleLang}
        onResetDemo={handleResetDemo}
        incidentCount={totalIncidents}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* App Sidebar */}
        <AppSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          uiLang={uiLang}
          incidentCount={totalIncidents}
          unverifiedCount={unverifiedCount}
        />

        {/* Content Pane */}
        <main className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-4">
          {/* KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard
              label={uiLang === "hi" ? "सक्रिय घटनाएँ" : "Active Demo Incidents"}
              value={totalIncidents}
              sublabel={uiLang === "hi" ? "सिम्युलेटेड सत्र" : "Local session memory"}
              icon={Radio}
              variant="primary"
            />
            <KpiCard
              label={uiLang === "hi" ? "उच्च / गंभीर प्राथमिकता" : "High/Critical Suggestions"}
              value={highOrCriticalCount}
              sublabel={uiLang === "hi" ? "Sarvam सुझाव" : "AI triage recommendations"}
              icon={AlertTriangle}
              variant="critical"
            />
            <KpiCard
              label={uiLang === "hi" ? "उपलब्ध संसाधन" : "Mock Field Inventory"}
              value={totalAvailableStock}
              sublabel={uiLang === "hi" ? "5 मानक श्रेणियां" : "Boats, ambulances, kits, rations"}
              icon={Boxes}
              variant="success"
            />
            <KpiCard
              label={uiLang === "hi" ? "सत्यापन की प्रतीक्षा" : "Awaiting Verification"}
              value={unverifiedCount}
              sublabel={uiLang === "hi" ? "मानव ऑपरेटर आवश्यक" : "Human review pending"}
              icon={HelpCircle}
              variant="warning"
            />
          </div>

          {/* VIEW: OVERVIEW (Command Dashboard) */}
          {currentTab === "overview" && (
            <div className="space-y-4">
              {/* Intake Form */}
              <IncidentIntake
                onAnalyzeComplete={handleNewIncident}
                uiLang={uiLang}
              />

              {/* Main Command Feed & Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left side: Incident Feed */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-bold text-text-primary">
                        {uiLang === "hi" ? "लाइव घटना फीड" : "Active Incident Stream"}
                      </h3>
                      <span className="text-[11px] font-mono text-text-muted">
                        ({filteredIncidents.length})
                      </span>
                    </div>

                    <button
                      onClick={() => setCurrentTab("incidents")}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      View with filters →
                    </button>
                  </div>

                  {filteredIncidents.length === 0 ? (
                    <EmptyState
                      title="No incidents match filter"
                      description="Clear search or reset demo data to view seeded reports."
                      isSearch={Boolean(searchQuery)}
                    />
                  ) : (
                    <div className="space-y-2.5">
                      {filteredIncidents.map((incident) => (
                        <IncidentCard
                          key={incident.id}
                          incident={incident}
                          isSelected={selectedIncident?.id === incident.id}
                          onSelect={setSelectedIncident}
                          uiLang={uiLang}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right side: Schematic Map & Mock Resources */}
                <div className="lg:col-span-5 space-y-4">
                  <SchematicMap
                    incidents={incidents}
                    onSelectIncident={setSelectedIncident}
                    uiLang={uiLang}
                  />

                  <ResourcePanel uiLang={uiLang} />
                </div>
              </div>
            </div>
          )}

          {/* VIEW: INCIDENTS (Dedicated Feed with Deep Filtering) */}
          {currentTab === "incidents" && (
            <div className="space-y-4">
              {/* Filters Header */}
              <div className="p-3.5 rounded-lg bg-surface border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                    <Filter className="w-4 h-4 text-primary" />
                    <span>Filter & Triage Incidents</span>
                  </div>

                  {(severityFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSeverityFilter("all");
                        setCategoryFilter("all");
                        setStatusFilter("all");
                      }}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {/* Severity */}
                  <div>
                    <label className="block text-[11px] text-text-muted mb-1 font-medium">
                      AI Suggested Severity:
                    </label>
                    <select
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-surface-raised border border-surface-border text-text-primary text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="all">All Severities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[11px] text-text-muted mb-1 font-medium">
                      Incident Category:
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-surface-raised border border-surface-border text-text-primary text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="all">All Categories</option>
                      <option value="flooding">Flooding</option>
                      <option value="road_accident">Road Accident</option>
                      <option value="power_outage">Power Outage</option>
                      <option value="medical">Medical</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-[11px] text-text-muted mb-1 font-medium">
                      Human Review Status:
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-surface-raised border border-surface-border text-text-primary text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="all">All Review States</option>
                      <option value="unreviewed">Unreviewed</option>
                      <option value="needs_verification">Needs Verification</option>
                      <option value="reviewed">Reviewed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Incidents Grid */}
              {filteredIncidents.length === 0 ? (
                <EmptyState
                  title="No incidents match selected criteria"
                  description="Try adjusting your filter dropdowns or search query."
                  isSearch={true}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredIncidents.map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      incident={incident}
                      isSelected={selectedIncident?.id === incident.id}
                      onSelect={setSelectedIncident}
                      uiLang={uiLang}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: EVIDENCE */}
          {currentTab === "evidence" && (
            <EvidencePanel
              incidents={incidents}
              onSelectIncident={setSelectedIncident}
              uiLang={uiLang}
            />
          )}

          {/* VIEW: RESOURCES */}
          {currentTab === "resources" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResourcePanel uiLang={uiLang} />
              <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-3">
                <h3 className="text-sm font-bold text-text-primary">
                  Deterministic Allocation Rules
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  JANSETU AI never lets an LLM execute arithmetic or invent imaginary inventory.
                  When Sarvam-105B extracts resource requirements (e.g. 2 rescue boats for a flood), our deterministic engine computes:
                </p>
                <div className="p-3 rounded bg-surface-raised border border-surface-border font-mono text-xs text-cyan-300 space-y-1">
                  <div>suggested = min(requested, stock.available)</div>
                  <div>shortfall = max(0, requested - stock.available)</div>
                  <div>status = shortfall === 0 ? "available" : "shortfall"</div>
                </div>
                <div className="text-xs text-text-muted">
                  If the suggested item does not match our five standard emergency categories, the engine tags it as <em>"needs manual mapping"</em> rather than fabricating supplies.
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ANALYTICS */}
          {currentTab === "analytics" && (
            <AnalyticsPanel incidents={incidents} uiLang={uiLang} />
          )}

          {/* VIEW: SETTINGS */}
          {currentTab === "settings" && (
            <SettingsPanel onResetDemo={handleResetDemo} uiLang={uiLang} />
          )}
        </main>
      </div>

      {/* Incident Detail Drawer / Modal */}
      <IncidentDetailDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onUpdateStatus={handleUpdateStatus}
        uiLang={uiLang}
      />
    </div>
  );
}
