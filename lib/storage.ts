import { IncidentRecord } from "@/types/incident";
import { SEEDED_INCIDENTS } from "./demo-data";

const STORAGE_KEY = "jansetu_ai_incidents_v1";

export function loadStoredIncidents(): IncidentRecord[] {
  if (typeof window === "undefined") {
    return SEEDED_INCIDENTS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredIncidents(SEEDED_INCIDENTS);
      return SEEDED_INCIDENTS;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SEEDED_INCIDENTS;
  } catch (err) {
    console.error("Failed to parse incidents from localStorage, resetting to seed:", err);
    saveStoredIncidents(SEEDED_INCIDENTS);
    return SEEDED_INCIDENTS;
  }
}

export function saveStoredIncidents(incidents: IncidentRecord[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  } catch (err) {
    console.error("Failed to persist incidents to localStorage:", err);
  }
}

export function resetToDemoIncidents(): IncidentRecord[] {
  saveStoredIncidents(SEEDED_INCIDENTS);
  return SEEDED_INCIDENTS;
}
