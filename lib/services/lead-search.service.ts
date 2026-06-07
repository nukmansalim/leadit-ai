import { prisma } from "@/lib/prisma";
import { googlePlacesService, GooglePlacesError } from "@/lib/google-places";
import { analyzeLeadWithLLM, LLMServiceError } from "@/lib/llm";
import { MinimalBusinessInput } from "@/types/business";
import { z } from "zod";
import type { LeadSearchJobData, LeadSearchJobResult } from "@/lib/bullmq/types";

const LeadAnalysisSchema = z.object({
  score: z.enum(["High", "Medium", "Low"]),
  reason: z.string().min(10),
  whatsapp: z.string().nullable(),
  confidence: z.number().min(0).max(100).optional(),
  no_instagram: z.boolean(),
  no_pos: z.boolean(),
});

function isCriticalError(err: unknown): boolean {
  if (err instanceof GooglePlacesError) {
    if (err.statusCode === 401 || err.statusCode === 403 || err.statusCode === 429) {
      return true;
    }
  }

  if (err instanceof LLMServiceError) {
    const msg = err.message;
    if (msg.includes("Failed to parse") || msg.includes("Missing required fields")) {
      return false;
    }
    return true;
  }

  const message = String((err as Error)?.message || "").toLowerCase();
  if (
    message.includes("429") ||
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("unauthorized") ||
    message.includes("401") ||
    message.includes("403") ||
    message.includes("fetch failed") ||
    message.includes("econnrefused") ||
    message.includes("enotfound")
  ) {
    return true;
  }

  return false;
}

export async function runLeadSearch(
  data: LeadSearchJobData,
  options?: { onProgress?: (progress: number) => Promise<void> }
): Promise<LeadSearchJobResult> {
 const { jobId, userId, location, solutionFocus, websiteStatus, digitalWeaknesses } =
  data;
  try {
    if (options?.onProgress) {
      await options.onProgress(5);
    }
    await prisma.searchJob.update({
      where: { id: jobId },
      data: { status: "processing", progress: 5 },
    });

    const dynamicQuery = `${solutionFocus} di ${location}`;
    console.log(`🔍 Mencari: ${dynamicQuery}`);

    const businesses = await googlePlacesService.searchText({
      textQuery: dynamicQuery,
      maxResults: 20,
    });

    if (!businesses || businesses.length === 0) {
      await prisma.searchJob.update({
        where: { id: jobId },
        data: { status: "completed", progress: 100, leads_generated: 0 },
      });
      return { success: true, jobId, totalBusinesses: 0, totalLeads: 0, message: "No businesses found" };
    }

    if (options?.onProgress) {
      await options.onProgress(15);
    }
    await prisma.searchJob.update({
      where: { id: jobId },
      data: { total_businesses: businesses.length, progress: 15 },
    });

    let processedCount = 0;

    for (const business of businesses) {
      try {
        // Throttling/Sleep Logic: Add dynamic/polite delay of 1.5 seconds between requests to prevent 429 errors from Google and LLM APIs
        if (processedCount > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }

        const details = await googlePlacesService.getPlaceDetails(business.place_id);

        const websiteUrl = details.websiteUri || details.website || "";
        const isInstagram = websiteUrl.toLowerCase().includes("instagram.com") || websiteUrl.toLowerCase().includes("instagr.am");
        const hasCustomWebsite = !!websiteUrl && !isInstagram;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const reviewTexts = details.reviews ? (details.reviews as any[]).map(r => r.text?.text || r.text || "").filter(Boolean) : [];

        const minimalBusinessData: MinimalBusinessInput = {
          id: business.place_id,
          nama: details.displayName?.text || details.name || "N/A",
          kategori: details.primaryType || (details.types ? details.types[0] : "Business"),
          rating: details.rating || 0,
          total_review: details.userRatingCount || 0,
          has_website: hasCustomWebsite,
          has_phone_number: !!(details.nationalPhoneNumber || details.internationalPhoneNumber),
          website_url: websiteUrl,
          reviews: reviewTexts,
        };

        console.log(`🤖 Menganalisis: ${minimalBusinessData.nama} (${minimalBusinessData.kategori})`);

        let staticSkip = false;
        if (digitalWeaknesses && digitalWeaknesses.length > 0) {
          if (digitalWeaknesses.includes("no-website") && hasCustomWebsite) {
            staticSkip = true;
          }
          if (digitalWeaknesses.includes("no-instagram") && isInstagram) {
            staticSkip = true;
          }
        }

        const shouldSkipByWebsite =
          typeof websiteStatus === "boolean" &&
          minimalBusinessData.has_website !== websiteStatus;

        if (staticSkip || shouldSkipByWebsite) {
          processedCount++;

          const progress = Math.floor(15 + (processedCount / businesses.length) * 80);

          if (options?.onProgress) {
            await options.onProgress(progress);
          }

          await prisma.searchJob.update({
            where: { id: jobId },
            data: { progress },
          });

          continue;
        }

        const analysis = await analyzeLeadWithLLM({ business: minimalBusinessData, solutionFocus });
        const validated = LeadAnalysisSchema.parse(analysis);

        if (digitalWeaknesses && digitalWeaknesses.length > 0) {
          if (digitalWeaknesses.includes("no-pos") && !validated.no_pos) {
            // Business has a POS system, but user only wants those without. Skip!
            processedCount++;

            const progress = Math.floor(15 + (processedCount / businesses.length) * 80);

            if (options?.onProgress) {
              await options.onProgress(progress);
            }

            await prisma.searchJob.update({
              where: { id: jobId },
              data: { progress },
            });

            continue;
          }
        }

        await prisma.lead.upsert({
          where: {
            userId_place_id: {
              userId: userId,
              place_id: business.place_id,
            },
          },
          update: {
            jobId,
            ai_lead_score: validated.score,
            ai_analysis_reason: validated.reason,
            formatted_whatsapp: validated.whatsapp
              ? `https://wa.me/${validated.whatsapp}`
              : null,
            business_name: minimalBusinessData.nama,
            address: details.formattedAddress,
            rating: minimalBusinessData.rating,
            total_reviews: minimalBusinessData.total_review,
            website: details.websiteUri,
            phone: details.nationalPhoneNumber,
            raw_data: {
              ...(details as unknown as Record<string, unknown>),
              no_instagram: validated.no_instagram,
              no_pos: validated.no_pos,
            },
          },
          create: {
            jobId: jobId,
            userId: userId,
            place_id: business.place_id,
            business_name: minimalBusinessData.nama,
            address: details.formattedAddress,
            rating: minimalBusinessData.rating,
            total_reviews: minimalBusinessData.total_review,
            website: details.websiteUri,
            phone: details.nationalPhoneNumber,
            formatted_whatsapp: validated.whatsapp ? `https://wa.me/${validated.whatsapp}` : null,
            ai_lead_score: validated.score,
            ai_analysis_reason: validated.reason,
            raw_data: {
              ...(details as unknown as Record<string, unknown>),
              no_instagram: validated.no_instagram,
              no_pos: validated.no_pos,
            },
          }
        });

        processedCount++;

        const progress = Math.floor(15 + (processedCount / businesses.length) * 80);
        if (options?.onProgress) {
          await options.onProgress(progress);
        }

        if (processedCount % 2 === 0 || processedCount === businesses.length) {
          await prisma.searchJob.update({
            where: { id: jobId },
            data: { progress, leads_generated: processedCount },
          });
        }

      } catch (err) {
        console.error(`❌ Gagal memproses tempat ${business.place_id}:`, err);
        if (isCriticalError(err)) {
          throw err;
        }
      }
    }

    if (options?.onProgress) {
      await options.onProgress(100);
    }
    await prisma.searchJob.update({
      where: { id: jobId },
      data: { status: "completed", progress: 100, leads_generated: processedCount },
    });

    return {
      success: true,
      jobId,
      totalBusinesses: businesses.length,
      totalLeads: processedCount,
    };

  } catch (jobError) {
    const errorMessage = jobError instanceof Error ? jobError.message : "Terjadi kesalahan internal";
    await prisma.searchJob.update({
      where: { id: jobId },
      data: { status: "failed", error_message: errorMessage },
    });
    throw jobError;
  }
}
