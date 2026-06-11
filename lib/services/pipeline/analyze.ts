import { analyzeLeadWithLLM } from "@/lib/llm/llm";
import { z } from "zod";
import type { EnrichedBusiness, AnalyzedLead, PipelineContext } from "./types";

const LeadAnalysisSchema = z.object({
  score: z.enum(["High", "Medium", "Low"]),
  reason: z.string().min(10),
  whatsapp: z.string().nullable(),
  confidence: z.number().min(0).max(100).optional(),
  no_instagram: z.boolean().optional(),
  no_pos: z.boolean().optional(),
  complaint_category: z
    .enum([
      "slow_service",
      "long_queues",
      "payment_issues",
      "food_consistency",
      "cleanliness",
      "other",
    ])
    .nullable()
    .optional(),
  bad_review_summary: z.string().nullable().optional(),
  recommended_solution: z.string().nullable().optional(),
});

export async function analyzeBusiness(
  biz: EnrichedBusiness,
  ctx: PipelineContext,
): Promise<AnalyzedLead | null> {
  console.log(
    `🤖 Menganalisis: ${biz.minimal.nama} (${biz.minimal.kategori})`,
  );

  const raw = await analyzeLeadWithLLM({
    business: biz.minimal,
    solutionFocus: ctx.solutionFocus,
  });

  const validated = LeadAnalysisSchema.parse(raw);

  // ── Post-analysis filter: no-POS weakness ──────────────────────────
  if (
    ctx.digitalWeaknesses &&
    ctx.digitalWeaknesses.includes("no-pos") &&
    !validated.no_pos
  ) {
    return null;
  }

  return {
    ...biz,
    analysis: {
      score: validated.score,
      reason: validated.reason,
      whatsapp: validated.whatsapp,
      confidence: validated.confidence,
      no_instagram: validated.no_instagram,
      no_pos: validated.no_pos,
      complaint_category: validated.complaint_category ?? null,
      bad_review_summary: validated.bad_review_summary ?? null,
      recommended_solution: validated.recommended_solution ?? null,
    },
  };
}
