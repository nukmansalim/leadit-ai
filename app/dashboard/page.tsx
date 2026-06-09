import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/dashboardShell";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [jobs, leads] = await Promise.all([
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
    prisma.lead.findMany({
      where: { userId: session.user.id },
      orderBy: { created_at: "desc" },
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
  ]);

  return (
    <DashboardShell
      initialJobs={jobs.map((job) => ({
        ...job,
        created_at: job.created_at.toISOString(),
        updated_at: job.updated_at.toISOString(),
      }))}
      initialLeads={leads.map((lead) => ({
        ...lead,
        created_at: lead.created_at.toISOString(),
      }))}
    />
  );
}
