import { auth } from "@/auth";
import { leadFiltersSchema } from "@/lib/dashboard/schemas";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

function buildLeadWhere(
  userId: string,
  filters: z.infer<typeof leadFiltersSchema>,
): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = { userId };

  if (filters.jobId) {
    where.jobId = filters.jobId;
  }

  if (filters.score) {
    where.ai_lead_score = filters.score;
  }

  if (filters.website === "has-website") {
    where.website = { not: null };
  }

  if (filters.website === "missing-website") {
    where.website = null;
  }

  if (filters.contact === "has-whatsapp") {
    where.formatted_whatsapp = { not: null };
  }

  if (filters.contact === "no-contact") {
    where.AND = [{ formatted_whatsapp: null }, { phone: null }];
  }

  if (filters.q) {
    where.OR = [
      { business_name: { contains: filters.q, mode: "insensitive" } },
      { address: { contains: filters.q, mode: "insensitive" } },
      { ai_analysis_reason: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  return where;
}

function buildLeadOrderBy(
  sort: z.infer<typeof leadFiltersSchema>["sort"],
): Prisma.LeadOrderByWithRelationInput[] {
  switch (sort) {
    case "opportunity":
      return [{ rating: "asc" }, { total_reviews: "asc" }, { created_at: "desc" }];

    case "rating-asc":
      return [{ rating: "asc" }, { created_at: "desc" }];

    case "reviews-asc":
      return [{ total_reviews: "asc" }, { created_at: "desc" }];

    case "newest":
    default:
      return [{ created_at: "desc" }];
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Rate limit: 30 reads per 60 seconds per user
    const limitResult = await rateLimit(`leads:${session.user.id}`, 30, 60);
    if (!limitResult.success) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const { searchParams } = new URL(req.url);

    const filters = leadFiltersSchema.parse({
      q: searchParams.get("q") ?? undefined,
      jobId: searchParams.get("jobId") ?? undefined,
      score: searchParams.get("score") ?? undefined,
      website: searchParams.get("website") ?? undefined,
      contact: searchParams.get("contact") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
    });

    const [leads, jobs] = await Promise.all([
      prisma.lead.findMany({
        where: buildLeadWhere(session.user.id, filters),
        orderBy: buildLeadOrderBy(filters.sort),
        take: 250,
        select: {
          id: true,
          jobId: true,
          place_id: true,
          business_name: true,
          address: true,
          rating: true,
          total_reviews: true,
          website: true,
          phone: true,
          formatted_whatsapp: true,
          ai_lead_score: true,
          ai_analysis_reason: true,
          complaint_category: true,
          bad_review_summary: true,
          recommended_solution: true,
          confidence: true,
          created_at: true,
        },
      }),
      prisma.searchJob.findMany({
        where: { userId: session.user.id },
        orderBy: { created_at: "desc" },
        take: 30,
        select: {
          id: true,
          status: true,
          query_params: true,
          progress: true,
          total_businesses: true,
          leads_generated: true,
          error_message: true,
          created_at: true,
          updated_at: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      leads: leads.map((lead) => ({
        ...lead,
        created_at: lead.created_at.toISOString(),
      })),
      jobs: jobs.map((job) => ({
        ...job,
        created_at: job.created_at.toISOString(),
        updated_at: job.updated_at.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET /api/leads error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid filters.",
          errors: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to load leads." },
      { status: 500 },
    );
  }
}
