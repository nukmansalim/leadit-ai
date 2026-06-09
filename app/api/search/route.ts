import { auth } from "@/auth";
import { addLeadSearchJob } from "@/lib/bullmq/queue";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { createSearchJobSchema } from "@/lib/dashboard/schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Rate limit: 10 search jobs per 60 seconds per user
    const limitResult = await rateLimit(session.user.id, 10, 60);
    if (!limitResult.success) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body: unknown = await req.json();
    const parsedData = createSearchJobSchema.parse(body);

    const newJob = await prisma.searchJob.create({
      data: {
        userId: session.user.id,
        query_params: parsedData,
        status: "pending",
        progress: 0,
        total_businesses: 0,
        leads_generated: 0,
      },
    });

    await addLeadSearchJob({
      jobId: newJob.id,
      userId: session.user.id,
      location: parsedData.location,
      businessCategory: parsedData.businessCategory,
      solutionFocus: parsedData.solutionFocus,
      websiteStatus: parsedData.websiteStatus,
      digitalWeaknesses: parsedData.digitalWeaknesses,
    });

    return NextResponse.json(
      {
        success: true,
        jobId: newJob.id,
        message: "Search job queued successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/search error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid search parameters.",
          errors: error.issues,
        },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON body.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 },
    );
  }
}
