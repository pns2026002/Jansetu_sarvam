"use client";

import React, { useState } from "react";
import { SAMPLE_PROMPTS } from "@/lib/demo-data";
import { Sparkles, Loader2, AlertCircle, Send, CheckCircle2, Languages } from "lucide-react";

interface IncidentIntakeProps {
  onAnalyzeComplete: (incident: any) => void;
  uiLang: "en" | "hi";
}

export function IncidentIntake({ onAnalyzeComplete, uiLang }: IncidentIntakeProps) {
  const [reportText, setReportText] = useState("");
  const [selectedLang, setSelectedLang] = useState<"auto" | "hi" | "en">("auto");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSelectSample = (text: string, lang: "auto" | "hi" | "en") => {
    setReportText(text);
    setSelectedLang(lang);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim() || reportText.trim().length < 5) {
      setErrorMessage(
        uiLang === "hi"
          ? "कृपया कम से कम 5 अक्षरों का विवरण दर्ज करें।"
          : "Please enter a report of at least 5 characters."
      );
      return;
    }

    if (reportText.length > 2000) {
      setErrorMessage(
        uiLang === "hi"
          ? "विवरण 2,000 अक्षरों से अधिक नहीं हो सकता।"
          : "Report must not exceed 2,000 characters."
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setErrorCode(null);
    setSuccessNotice(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: reportText.trim(),
          language: selectedLang,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorCode(data.code || null);
        throw new Error(data.message || data.error || "Failed to analyze incident.");
      }

      setSuccessNotice(
        uiLang === "hi"
          ? `सफल: घटना ${data.incident.id} Sarvam-105B द्वारा विश्लेषित की गई!`
          : `Success: Incident ${data.incident.id} structured via Sarvam-105B!`
      );

      onAnalyzeComplete(data.incident);
      setReportText("");
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected network or server error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-surface border border-surface-border p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-primary/10 text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary">
              {uiLang === "hi" ? "नया नागरिक संदेश दर्ज करें" : "Citizen Incident Intake"}
            </h2>
            <p className="text-[11px] text-text-muted">
              {uiLang === "hi"
                ? "हिंदी या अंग्रेज़ी में विवरण लिखें — सर्वम AI केवल 1 कॉल में विश्लेषण करेगा"
                : "Submit raw citizen text in Hindi or English — 1 concise Sarvam-105B call"}
            </p>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-surface-raised px-2 py-1 rounded border border-surface-border text-xs">
          <Languages className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-text-secondary text-[11px]">Lang:</span>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value as any)}
            className="bg-transparent text-text-primary text-xs font-medium focus:outline-none cursor-pointer"
          >
            <option value="auto" className="bg-surface text-text-primary">Auto Detect</option>
            <option value="hi" className="bg-surface text-text-primary">Hindi (हिंदी)</option>
            <option value="en" className="bg-surface text-text-primary">English</option>
          </select>
        </div>
      </div>

      {/* Quick sample buttons */}
      <div className="mt-3">
        <p className="text-[11px] font-semibold text-text-secondary mb-1.5">
          {uiLang === "hi" ? "त्वरित परीक्षण नमूने:" : "Quick Demo Presets:"}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample.text, sample.lang)}
              className="text-[11px] px-2.5 py-1 rounded bg-surface-raised hover:bg-surface-border border border-surface-border hover:border-primary/40 text-text-secondary hover:text-text-primary transition-colors text-left"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        <div className="relative">
          <textarea
            rows={3}
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder={
              uiLang === "hi"
                ? "नागरिक संदेश यहाँ लिखें या ऊपर दिए गए नमूनों में से चुनें..."
                : "Enter raw citizen report (e.g. 'सर, हमारे गाँव में पानी भर रहा है। स्कूल के पास 20 लोग फँसे हैं...')"
            }
            className="w-full rounded-md bg-surface-raised border border-surface-border p-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors"
          />
          <div className="absolute right-2.5 bottom-2 text-[10px] text-text-muted">
            {reportText.length}/2000
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{errorMessage}</p>
              {errorCode === "MISSING_API_KEY" && (
                <p className="text-[11px] text-text-secondary">
                  To test live AI calls: create a <code>.env.local</code> file with <code>SARVAM_API_KEY=your_key</code> and restart the server. In the meantime, you can inspect the 3 pre-seeded incidents below.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Success notification */}
        {successNotice && (
          <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
          <div className="text-[11px] text-text-muted flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Strict single API call • JSON Schema validation</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !reportText.trim()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-[#08111F] transition-all shadow-sm shadow-primary/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Structuring via Sarvam-105B...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Analyze with Sarvam</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
