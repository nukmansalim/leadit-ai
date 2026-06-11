import { auth } from "@/auth";
import { buildLeadWhere, buildLeadOrderBy } from "@/lib/dashboard/db-helper";
import { leadFiltersSchema } from "@/lib/dashboard/schemas";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { z } from "zod";

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

    const filters = leadFiltersSchema.parse(Object.fromEntries(searchParams) ?? undefined);

    const [leads, jobs] = await Promise.all([
      prisma.lead.findMany({
        where: buildLeadWhere(session.user.id, filters),
        orderBy: buildLeadOrderBy(filters.sort),
        take: 250,
        omit: {
          userId: true,
          raw_data: true
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
