import { SarvamAnalysisResult } from "@/types/incident";
import { SarvamAnalysisSchema } from "./schemas";

const SARVAM_CHAT_URL = "https://api.sarvam.ai/v1/chat/completions";
const MODEL_NAME = "sarvam-105b";

const SYSTEM_PROMPT = `You are JANSETU AI, an emergency operations triage assistant. Analyze this citizen report and output strictly valid JSON matching this schema:
{
  "category": "flooding" | "road_accident" | "power_outage" | "medical" | "other",
  "summary": "concise summary under 35 words",
  "location": { "value": "location or null", "status": "reported" | "inferred" | "unknown" },
  "people_affected": { "value": "number or description or null", "status": "reported" | "inferred" | "unknown" },
  "severity": "low" | "medium" | "high" | "critical" | "undetermined",
  "confidence": 0.1 to 1.0,
  "missing_information": ["up to 3 critical missing pieces of info"],
  "recommended_actions": ["up to 3 immediate human responder actions"],
  "resource_requirements": [
    { "type": "rescue_boat" | "ambulance" | "medical_kit" | "food_package" | "rescue_team" | "other", "quantity": 1, "reason": "brief reason" }
  ],
  "citizen_response": "brief 1-2 sentence reassuring response in the report language"
}
Rules:
- Never assume unstated facts. If location or casualties are unconfirmed, mark status as "unknown" or "inferred".
- Severity is an unverified suggestion for operator review.
- Respond with pure JSON only, no markdown wrapping.`;

export interface SarvamCallResponse {
  analysis: SarvamAnalysisResult;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

export async function analyzeReportWithSarvam(
  reportText: string,
  language: string = "auto"
): Promise<SarvamCallResponse> {
  const apiKey = process.env.SARVAM_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "SARVAM_API_KEY is not configured in .env.local. Please provide a valid Sarvam API subscription key to perform live triage."
    );
  }

  const userMessage = language !== "auto" 
    ? `[Report Language: ${language}]\nReport: "${reportText}"`
    : `Report: "${reportText}"`;

  const payload: Record<string, unknown> = {
    model: MODEL_NAME,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" },
    max_tokens: 650,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  let response: Response;
  try {
    response = await fetch(SARVAM_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Sarvam API request timed out after 30 seconds. Please check your network or try again.");
    }
    throw new Error(`Failed to reach Sarvam API: ${err instanceof Error ? err.message : "Network error"}`);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    let errorDetail = `Status ${response.status} ${response.statusText}`;
    try {
      const parsedError = JSON.parse(errorText);
      if (parsedError.message) errorDetail = parsedError.message;
      else if (parsedError.error?.message) errorDetail = parsedError.error.message;
    } catch {
      if (errorText) errorDetail = errorText.slice(0, 150);
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error(`Authentication failed with Sarvam API (${errorDetail}). Please check your SARVAM_API_KEY.`);
    }
    if (response.status === 429) {
      throw new Error("Sarvam API rate limit exceeded or credit balance exhausted. Please check your Sarvam dashboard.");
    }

    throw new Error(`Sarvam API request failed [${response.status}]: ${errorDetail}`);
  }

  const rawJson = await response.json();
  const content = rawJson.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("Sarvam API returned an empty or malformed message completion.");
  }

  // Strip potential markdown code blocks if the model wrapped output in ```json
  let cleaned = content.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  let parsedRaw: unknown;
  try {
    parsedRaw = JSON.parse(cleaned);
  } catch (parseErr) {
    throw new Error(`Failed to parse Sarvam model output as valid JSON: ${parseErr instanceof Error ? parseErr.message : "Invalid JSON syntax"}`);
  }

  const validationResult = SarvamAnalysisSchema.safeParse(parsedRaw);
  if (!validationResult.success) {
    console.error("Schema validation failure:", validationResult.error.format());
    throw new Error(`Model output did not match expected incident schema: ${validationResult.error.issues[0]?.message || "Schema mismatch"}`);
  }

  return {
    analysis: validationResult.data,
    usage: {
      prompt_tokens: rawJson.usage?.prompt_tokens,
      completion_tokens: rawJson.usage?.completion_tokens,
      total_tokens: rawJson.usage?.total_tokens,
    },
  };
}
