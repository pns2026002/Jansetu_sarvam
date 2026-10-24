import { z } from "zod";

export const AnalyzeRequestSchema = z.object({
  text: z
    .string()
    .trim()
    .min(5, "Report must be at least 5 characters long")
    .max(2000, "Report must not exceed 2,000 characters"),
  language: z.enum(["hi", "en", "auto"]).default("auto"),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

const EvidenceStatusSchema = z.enum(["reported", "inferred", "unknown", "verified"]).catch("unknown");

export const EvidenceFieldSchema = z.object({
  value: z.string().nullable().catch(null),
  status: EvidenceStatusSchema,
});

export const ResourceRequirementSchema = z.object({
  type: z.string().trim().toLowerCase(),
  quantity: z.number().int().nonnegative().catch(1),
  reason: z.string().optional(),
});

export const SarvamAnalysisSchema = z.object({
  category: z
    .enum(["flooding", "road_accident", "power_outage", "medical", "other"])
    .catch("other"),
  summary: z
    .string()
    .transform((str) => {
      const words = str.trim().split(/\s+/);
      if (words.length > 40) {
        return words.slice(0, 35).join(" ") + "...";
      }
      return str.trim();
    }),
  location: z.object({
    value: z.string().nullable().catch(null),
    status: EvidenceStatusSchema,
  }),
  people_affected: z.object({
    value: z.string().nullable().catch(null),
    status: EvidenceStatusSchema,
  }),
  severity: z
    .enum(["low", "medium", "high", "critical", "undetermined"])
    .catch("undetermined"),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .catch(0.7),
  missing_information: z
    .array(z.string().trim())
    .max(3)
    .catch([]),
  recommended_actions: z
    .array(z.string().trim())
    .max(3)
    .catch([]),
  resource_requirements: z
    .array(ResourceRequirementSchema)
    .catch([]),
  citizen_response: z.string().optional(),
});

export type SarvamAnalysisValidated = z.infer<typeof SarvamAnalysisSchema>;
