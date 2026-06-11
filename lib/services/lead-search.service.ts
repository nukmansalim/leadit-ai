import { prisma } from "@/lib/prisma";
import { googlePlacesService } from "@/lib/google-places";
import type { LeadSearchJobData, LeadSearchJobResult } from "@/lib/bullmq/types";
import {
  enrichBusiness,
  shouldSkipBusiness,
  analyzeBusiness,
  persistLead,
  isCriticalError,
  type PipelineContext,
  type ProgressCallback,
} from "./pipeline";

const THROTTLE_MS = 1500;

function computeProgress(processed: number, total: number): number {
  return Math.floor(15 + (processed / total) * 80);
}

async function updateJobProgress(
  jobId: string,
  progress: number,
  extra?: Record<string, unknown>,
  onProgress?: ProgressCallback,
): Promise<void> {
  if (onProgress) await onProgress(progress);

  await prisma.searchJob.update({
    where: { id: jobId },
    data: { progress, ...extra },
  });
}

async function processSingleBusiness(place: any, ctx: PipelineContext): Promise<boolean> {

  const enriched = await enrichBusiness(place);
  if (!enriched) return false;

  if (shouldSkipBusiness(enriched, ctx)) return false;

  const analyzed = await analyzeBusiness(enriched, ctx);
  if (!analyzed) return false;

  await persistLead(analyzed, ctx);
  return true;
}


export async function runLeadSearch(
  data: LeadSearchJobData,
  options?: { onProgress?: ProgressCallback },
): Promise<LeadSearchJobResult> {
  const ctx: PipelineContext = {
    jobId: data.jobId,
    userId: data.userId,
    location: data.location,
    businessCategory: data.businessCategory,
    solutionFocus: data.solutionFocus,
    websiteStatus: data.websiteStatus,
    digitalWeaknesses: data.digitalWeaknesses,
  };

  try {
    await updateJobProgress(ctx.jobId, 5, { status: "processing" }, options?.onProgress);

    const dynamicQuery = `${ctx.businessCategory} di ${ctx.location}`;
    console.log(`🔍 Mencari: ${dynamicQuery}`);

    const businesses = await googlePlacesService.searchText({
      textQuery: dynamicQuery,
      maxResults: 20,
    });

    if (!businesses || businesses.length === 0) {
      await updateJobProgress(ctx.jobId, 100, { status: "completed", leads_generated: 0 }, options?.onProgress);
      return { success: true, jobId: ctx.jobId, totalBusinesses: 0, totalLeads: 0, message: "No businesses found" };
    }

    await updateJobProgress(ctx.jobId, 15, { total_businesses: businesses.length }, options?.onProgress);

    let processedCount = 0;
    let leadsGenerated = 0;

    for (const place of businesses) {
      try {
        if (processedCount > 0) {
          await new Promise((resolve) => setTimeout(resolve, THROTTLE_MS));
        }

        const isLeadSaved = await processSingleBusiness(place, ctx);
        if (isLeadSaved) {
          leadsGenerated++;
        }

      } catch (err) {
        console.error(`❌ Gagal memproses tempat ${place.place_id}:`, err);
        if (isCriticalError(err)) throw err;
      } finally {
        processedCount++;
        const progress = computeProgress(processedCount, businesses.length);
        const shouldUpdateDb = processedCount % 2 === 0 || processedCount === businesses.length;
        const extraPayload = shouldUpdateDb ? { leads_generated: leadsGenerated } : undefined;

        await updateJobProgress(ctx.jobId, progress, extraPayload, options?.onProgress);
      }
    }

    // ── Finalize ──────────────────────────────────────────────────────
    await updateJobProgress(ctx.jobId, 100, {
      status: "completed",
      leads_generated: leadsGenerated,
    }, options?.onProgress);

    return {
      success: true,
      jobId: ctx.jobId,
      totalBusinesses: businesses.length,
      totalLeads: leadsGenerated,
    };

  } catch (jobError) {
    const errorMessage = jobError instanceof Error ? jobError.message : "Terjadi kesalahan internal";
    await prisma.searchJob.update({
      where: { id: ctx.jobId },
      data: { status: "failed", error_message: errorMessage },
    });
    throw jobError;
  }
}