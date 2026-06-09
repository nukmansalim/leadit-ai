/**
 * Lead-search orchestrator.
 *
 * This is a thin coordinator that wires together the pipeline stages
 * defined in `./pipeline/`. Each stage has a single responsibility:
 *
 *   1. enrich   – Google Places details + review pre-filter
 *   2. filter   – static digital-weakness / website-status checks
 *   3. analyze  – LLM scoring + Zod validation + post-analysis filter
 *   4. persist  – upsert the lead into PostgreSQL
 *
 * Error classification lives in `pipeline/errors.ts`.
 */

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

// ── Helpers ──────────────────────────────────────────────────────────

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
  if (onProgress) {
    await onProgress(progress);
  }
  await prisma.searchJob.update({
    where: { id: jobId },
    data: { progress, ...extra },
  });
}

// ── Main entry point ─────────────────────────────────────────────────

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
    // ── Kick off ──────────────────────────────────────────────────────
    await updateJobProgress(ctx.jobId, 5, { status: "processing" }, options?.onProgress);

    const dynamicQuery = `${ctx.businessCategory} di ${ctx.location}`;
    console.log(`🔍 Mencari: ${dynamicQuery}`);

    const businesses = await googlePlacesService.searchText({
      textQuery: dynamicQuery,
      maxResults: 20,
    });

    if (!businesses || businesses.length === 0) {
      await updateJobProgress(ctx.jobId, 100, {
        status: "completed",
        leads_generated: 0,
      }, options?.onProgress);
      return { success: true, jobId: ctx.jobId, totalBusinesses: 0, totalLeads: 0, message: "No businesses found" };
    }

    await updateJobProgress(ctx.jobId, 15, {
      total_businesses: businesses.length,
    }, options?.onProgress);

    // ── Process each business through the pipeline ────────────────────
    let processedCount = 0;
    let leadsGenerated = 0;

    for (const place of businesses) {
      try {
        // Polite delay between requests to avoid 429s
        if (processedCount > 0) {
          await new Promise((resolve) => setTimeout(resolve, THROTTLE_MS));
        }

        // Stage 1 – Enrich (returns null when no qualifying bad reviews)
        const enriched = await enrichBusiness(place);
        if (!enriched) {
          processedCount++;
          await updateJobProgress(
            ctx.jobId,
            computeProgress(processedCount, businesses.length),
            undefined,
            options?.onProgress,
          );
          continue;
        }

        // Stage 2 – Static filters
        if (shouldSkipBusiness(enriched, ctx)) {
          processedCount++;
          await updateJobProgress(
            ctx.jobId,
            computeProgress(processedCount, businesses.length),
            undefined,
            options?.onProgress,
          );
          continue;
        }

        // Stage 3 – LLM analysis (returns null when post-analysis filter rejects)
        const analyzed = await analyzeBusiness(enriched, ctx);
        if (!analyzed) {
          processedCount++;
          await updateJobProgress(
            ctx.jobId,
            computeProgress(processedCount, businesses.length),
            undefined,
            options?.onProgress,
          );
          continue;
        }

        // Stage 4 – Persist
        await persistLead(analyzed, ctx);

        leadsGenerated++;
        processedCount++;

        const progress = computeProgress(processedCount, businesses.length);
        if (processedCount % 2 === 0 || processedCount === businesses.length) {
          await updateJobProgress(ctx.jobId, progress, {
            leads_generated: leadsGenerated,
          }, options?.onProgress);
        } else {
          await updateJobProgress(ctx.jobId, progress, undefined, options?.onProgress);
        }
      } catch (err) {
        console.error(`❌ Gagal memproses tempat ${place.place_id}:`, err);
        if (isCriticalError(err)) {
          throw err;
        }
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
    const errorMessage =
      jobError instanceof Error ? jobError.message : "Terjadi kesalahan internal";
    await prisma.searchJob.update({
      where: { id: ctx.jobId },
      data: { status: "failed", error_message: errorMessage },
    });
    throw jobError;
  }
}
