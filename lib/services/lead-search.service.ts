import { prisma } from "@/lib/prisma";
import { googlePlacesService } from "@/lib/google-places";
import { analyzeLeadWithLLM } from "@/lib/llm";
import { MinimalBusinessInput } from "@/types/business";
import { z } from "zod";
import type { LeadSearchJobData, LeadSearchJobResult } from "@/lib/bullmq/types";

const LeadAnalysisSchema = z.object({
  score: z.enum(["High", "Medium", "Low"]),
  reason: z.string().min(10),
  whatsapp: z.string().nullable(),
  confidence: z.number().min(0).max(100).optional(),
});

export async function runLeadSearch(
  data: LeadSearchJobData,
  options?: { onProgress?: (progress: number) => Promise<void> }
): Promise<LeadSearchJobResult> {
  const { jobId, userId, location, solutionFocus } = data;

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
        const details = await googlePlacesService.getPlaceDetails(business.place_id);

        const minimalBusinessData: MinimalBusinessInput = {
          id: business.place_id,
          nama: details.displayName?.text || details.name || "N/A",
          kategori: details.primaryType || (details.types ? details.types[0] : "Business"),
          rating: details.rating || 0,
          total_review: details.userRatingCount || 0,
          has_website: !!(details.websiteUri || details.website),
          has_phone_number: !!(details.nationalPhoneNumber || details.internationalPhoneNumber),
        };

        console.log(`🤖 Menganalisis: ${minimalBusinessData.nama} (${minimalBusinessData.kategori})`);

        const analysis = await analyzeLeadWithLLM({ business: minimalBusinessData, solutionFocus });
        const validated = LeadAnalysisSchema.parse(analysis);

        await prisma.lead.upsert({
          where: {
            userId_place_id: {
              userId: userId,
              place_id: business.place_id,
            },
          },
          update: {
            jobId: jobId,
            ai_lead_score: validated.score,
            ai_analysis_reason: validated.reason,
            formatted_whatsapp: validated.whatsapp ? `https://wa.me/${validated.whatsapp}` : null,
            business_name: minimalBusinessData.nama,
            address: details.formattedAddress,
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
            raw_data: details as any,
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

  } catch (jobError: any) {
    await prisma.searchJob.update({
      where: { id: jobId },
      data: { status: "failed", error_message: jobError.message || "Terjadi kesalahan internal" },
    });
    throw jobError;
  }
}
