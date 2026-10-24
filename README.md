# JANSETU AI — Multilingual Crisis-to-Action Command Centre

> **Every voice becomes a signal. Every signal becomes an action.**  
> *A high-precision, decision-support prototype powered by Sarvam AI (sarvam-105b).*

---

## ⚡ Quick Start

### 1. Configure Sarvam API Key
Create or edit `.env.local` in the project root:
```env
SARVAM_API_KEY=your_sarvam_api_key_here
```
*(Keep this file local. The key is accessed exclusively on the server side and never sent to the client browser.)*

### 2. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 🎯 60–90 Second Judge Demo Script

1. **Open Dashboard**:
   - Notice the tactical mission-control theme (`#08111F`), the live KPI strip (Active Incidents, High/Critical Suggestions, Mock Inventory, Pending Verifications), and the prominent **SIMULATED DEMO** labels.
2. **Submit a Hindi Citizen Report**:
   - Click the preset button: `बाढ़ की सूचना (Hindi Flood)`:  
     *"सर, हमारे गाँव में पानी भर रहा है। स्कूल के पास लगभग 20 लोग फँसे हुए हैं। बिजली भी नहीं है।"*
   - Click **Analyze with Sarvam**.
   - Watch the single server-side API call to `sarvam-105b` return structured JSON in real time.
3. **Inspect the Incident Detail Drawer**:
   - Compare the **raw citizen text** side-by-side with the **AI extraction**.
   - Note that:
     - People affected is marked as **Reported (Unverified)**.
     - Location is marked with exact status.
     - Missing information flags unknowns (e.g., exact village name, water depth, elder presence).
     - Recommended actions provide concrete next steps for human operators.
4. **Deterministic Resource Allocation**:
   - Observe the resource matcher comparing suggested needs (e.g. 2 rescue boats) against local mock inventory.
   - The math is calculated **locally via deterministic TypeScript code**, with zero extra LLM calls or hallucinations.
5. **Human Operator Triage**:
   - Click **"Flag: Needs Verification"** or **"Mark Reviewed"**.
   - Switch tabs to **Evidence Vault** and **Operations Analytics** to view audit logs, category distributions, and token usage telemetry.

---

## 🛡️ Core Guardrails & Architecture

| Boundary | Implementation |
|---|---|
| **AI Provider** | Single call to Sarvam Chat Completions v1 (`sarvam-105b`) at `https://api.sarvam.ai/v1/chat/completions`. |
| **Token & Budget Protection** | Enforces ₹100 credit safety: 1 call per explicit click, no keystroke calls, no multi-agent loops, ~250–350 token prompt, short completions. |
| **Zero Dispatch Claims** | Explicitly framed as a decision-support prototype. No live emergency dispatch, no live GPS claims. |
| **Ground Truth Tracking** | Fields explicitly tagged as `reported`, `inferred`, `unknown`, or `verified`. |
| **Deterministic Math** | Inventory availability, shortfalls, sorting, filtering, and charts are calculated in local code, not generative LLMs. |

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Server-only Sarvam API route (handles validation & errors)
│   ├── globals.css               # Tactical command-center styles & theme tokens
│   ├── layout.tsx                # App root layout & metadata
│   └── page.tsx                  # Main command center dashboard & state
├── components/
│   ├── app-sidebar.tsx           # Operations Hub navigation (Overview, Feed, Evidence, Stock, Analytics)
│   ├── topbar.tsx                # Tactical header, search, language toggle, status
│   ├── kpi-card.tsx              # Metric counters with status glows
│   ├── incident-intake.tsx       # Multilingual input, character limit, quick presets
│   ├── incident-card.tsx         # Incident feed item with severity & evidence status
│   ├── incident-detail-drawer.tsx# Side-by-side evidence audit, unknowns & human triage actions
│   ├── resource-panel.tsx        # Mock emergency stock & deterministic matching
│   ├── schematic-map.tsx         # Illustrative tactical sector grid (no live GPS claims)
│   ├── evidence-panel.tsx        # Ground truth verification & audit log
│   ├── analytics-panel.tsx       # Severity, category distributions & token efficiency
│   ├── settings-panel.tsx        # API key instructions & guardrail rules
│   └── severity-badge.tsx        # AI suggested priority pills
├── lib/
│   ├── sarvam.ts                 # Sarvam Chat Completions v1 caller & error handling
│   ├── schemas.ts                # Zod schemas for input & model output validation
│   ├── resource-matcher.ts       # Deterministic resource allocation logic
│   ├── demo-data.ts              # 3 seeded incidents & 5 mock inventory categories
│   ├── storage.ts                # Safe localStorage persistence
│   └── utils.ts                  # Class utilities & formatting helpers
├── types/
│   └── incident.ts               # Core TypeScript interfaces
└── .env.local                    # Secret API key (never committed)
```
