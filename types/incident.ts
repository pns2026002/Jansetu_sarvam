export type EvidenceStatus = "reported" | "inferred" | "unknown" | "verified";

export type SeverityLevel = "low" | "medium" | "high" | "critical" | "undetermined";

export type IncidentCategory = "flooding" | "road_accident" | "power_outage" | "medical" | "other";

export type ReviewStatus = "unreviewed" | "reviewed" | "needs_verification";

export interface EvidenceField {
  value: string | null;
  status: EvidenceStatus;
}

export interface ResourceRequirement {
  type: string;
  quantity: number;
  reason?: string;
}

export interface ResourceAllocationMatch {
  type: string;
  requested: number;
  available: number;
  suggested: number;
  shortfall: number;
  status: "available" | "shortfall" | "unsupported";
  reason?: string;
}

export interface InventoryItem {
  type: string;
  name: string;
  available: number;
  unit: string;
}

export interface SarvamAnalysisResult {
  category: IncidentCategory;
  summary: string;
  location: EvidenceField;
  people_affected: EvidenceField;
  severity: SeverityLevel;
  confidence: number;
  missing_information: string[];
  recommended_actions: string[];
  resource_requirements: ResourceRequirement[];
  citizen_response?: string;
}

export interface IncidentRecord {
  id: string;
  timestamp: string;
  original_text: string;
  language: "hi" | "en" | "auto";
  analysis: SarvamAnalysisResult;
  review_status: ReviewStatus;
  reviewed_at?: string;
  is_demo: boolean;
  tokens_used?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}
