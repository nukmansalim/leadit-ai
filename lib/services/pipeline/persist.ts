import { prisma } from "@/lib/prisma";
import type { AnalyzedLead, PipelineContext } from "./types";

export async function persistLead(
  lead: AnalyzedLead,
  ctx: PipelineContext,
): Promise<void> {
  const { analysis, details, minimal } = lead;

  const sharedData = {
    jobId: ctx.jobId,
    ai_lead_score: analysis.score,
    ai_analysis_reason: analysis.reason,
    complaint_category: analysis.complaint_category,
    bad_review_summary: analysis.bad_review_summary,
    recommended_solution: analysis.recommended_solution,
    confidence: analysis.confidence,
    formatted_whatsapp: analysis.whatsapp
      ? `https://wa.me/${analysis.whatsapp}`
      : null,
    business_name: minimal.nama,
    address: details.formattedAddress,
    rating: minimal.rating,
    total_reviews: minimal.total_review,
    website: details.websiteUri,
    phone: details.nationalPhoneNumber,
    raw_data: {
      ...(details as unknown as Record<string, unknown>),
      no_instagram: analysis.no_instagram,
      no_pos: analysis.no_pos,
    },
  };

  await prisma.lead.upsert({
    where: {
      userId_place_id: {
        userId: ctx.userId,
        place_id: lead.placeId,
      },
    },
    update: sharedData,
    create: {
      userId: ctx.userId,
      place_id: lead.placeId,
      ...sharedData,
    },
  });
}
