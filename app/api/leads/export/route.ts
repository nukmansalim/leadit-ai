import { auth } from "@/auth";
import { buildLeadWhere } from "@/lib/dashboard/db-helper";
import { leadFiltersSchema } from "@/lib/dashboard/schemas";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { z } from "zod";


function escapeCsv(value: string | number | null | undefined) {
  const normalized = value === null || value === undefined ? "" : String(value);
  return `"${normalized.replaceAll('"', '""')}"`;
}

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);

  const filters = leadFiltersSchema.parse(Object.fromEntries(searchParams) ?? undefined);

  const leads = await prisma.lead.findMany({
    where: buildLeadWhere(session.user.id, filters),
    orderBy: [{ rating: "asc" }, { total_reviews: "asc" }, { created_at: "desc" }],
    select: {
      business_name: true,
      ai_lead_score: true,
      formatted_whatsapp: true,
      phone: true,
      website: true,
      rating: true,
      total_reviews: true,
      ai_analysis_reason: true,
      complaint_category: true,
      bad_review_summary: true,
      recommended_solution: true,
      confidence: true,
    },
  });

  const header = [
    "Business Name",
    "AI Score",
    "WhatsApp Link",
    "Phone",
    "Website",
    "Google Rating",
    "Reviews",
    "AI Reason",
    "Complaint Category",
    "Bad Review Summary",
    "Recommended Solution",
    "Confidence Score",
  ];

  const rows = leads.map((lead) => [
    lead.business_name,
    lead.ai_lead_score,
    lead.formatted_whatsapp,
    lead.phone,
    lead.website,
    lead.rating,
    lead.total_reviews,
    lead.ai_analysis_reason,
    lead.complaint_category,
    lead.bad_review_summary,
    lead.recommended_solution,
    lead.confidence,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="leadit-leads.csv"',
    },
  });
}
