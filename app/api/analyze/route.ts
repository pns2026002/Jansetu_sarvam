import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequestSchema } from "@/lib/schemas";
import { analyzeReportWithSarvam } from "@/lib/sarvam";
import { IncidentRecord } from "@/types/incident";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const validation = AnalyzeRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { text, language } = validation.data;

    // Check if key is available
    if (!process.env.SARVAM_API_KEY || !process.env.SARVAM_API_KEY.trim()) {
      return NextResponse.json(
        {
          error: "SARVAM_API_KEY is not configured on the server.",
          message:
            "Please create or edit `.env.local` in the project root with `SARVAM_API_KEY=your_key_here` and restart the server.",
          code: "MISSING_API_KEY",
        },
        { status: 503 }
      );
    }

    // Call Sarvam AI exactly once
    const { analysis, usage } = await analyzeReportWithSarvam(text, language);

    // Create unique incident record
    const incident: IncidentRecord = {
      id: `INC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      original_text: text,
      language: language,
      analysis: analysis,
      review_status: "unreviewed",
      is_demo: false,
      tokens_used: usage,
    };

    return NextResponse.json({
      success: true,
      incident,
      usage,
    });
  } catch (error: unknown) {
    console.error("API /api/analyze error:", error instanceof Error ? error.message : error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected server error occurred";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 502 }
    );
  }
}
