import { Worker, Job } from "bullmq";
import Redis from "ioredis";
import { prisma } from "@/lib/prisma";
import { googlePlacesService } from "@/lib/google-places";
import { analyzeLeadWithLLM } from "@/lib/llm";
import { MinimalBusinessInput } from "../types/business";
import { z } from "zod";

const LeadAnalysisSchema = z.object({
    score: z.enum(["High", "Medium", "Low"]),
    reason: z.string().min(10),
    whatsapp: z.string().nullable(),
    confidence: z.number().min(0).max(100).optional(),
});

const redisConnection = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: null,
});

export const leadSearchWorker = new Worker(
    "LeadSearchQueue",
    async (job: Job) => {
        const { jobId, userId, location, solutionFocus } = job.data;

        try {
            await job.updateProgress(5);
            await prisma.searchJob.update({
                where: { id: jobId },
                data: { status: "processing", progress: 5 },
            });

            const businesses = await googlePlacesService.searchText({
                textQuery: `${location} (restaurant OR cafe OR bar OR bakery)`,
                maxResults: 12,
            });

            if (!businesses || businesses.length === 0) {
                await prisma.searchJob.update({
                    where: { id: jobId },
                    data: { status: "completed", progress: 100, leads_generated: 0 },
                });
                return { success: true, message: "No businesses found" };
            }

            await job.updateProgress(15);
            await prisma.searchJob.update({
                where: { id: jobId },
                data: { total_businesses: businesses.length, progress: 15 },
            });

            let processedCount = 0;
            const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
            for (const business of businesses) {
                try {
                    const details = await googlePlacesService.getPlaceDetails(business.place_id);
                    const minimalBusinessData: MinimalBusinessInput = {
                        id: business.place_id,
                        nama: details.displayName?.text || "N/A",
                        kategori: details.primaryType || "UMKM",
                        rating: details.rating,
                        total_review: details.userRatingCount,
                        has_website: !!details.websiteUri,
                        has_phone_number: !!details.nationalPhoneNumber,
                    };
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
                        },
                        create: {
                            jobId: jobId,
                            userId: userId,
                            place_id: business.place_id,
                            business_name: details.displayName?.text || "N/A",
                            address: details.formattedAddress,
                            rating: details.rating,
                            total_reviews: details.userRatingCount,
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
                    await job.updateProgress(progress);

                    if (processedCount % 2 === 0 || processedCount === businesses.length) {
                        await prisma.searchJob.update({
                            where: { id: jobId },
                            data: { progress, leads_generated: processedCount },
                        });
                    }
                } catch (err) {
                    console.error(`Gagal memproses tempat ${business.place_id}:`, err);
                }
            }

            await job.updateProgress(100);
            await prisma.searchJob.update({
                where: { id: jobId },
                data: { status: "completed", progress: 100, leads_generated: processedCount },
            });

            return { success: true, leadsCreated: processedCount };

        } catch (jobError: any) {
            await prisma.searchJob.update({
                where: { id: jobId },
                data: { status: "failed", error_message: jobError.message || "Terjadi kesalahan internal" },
            });
            throw jobError;
        }
    },
    {
        connection: redisConnection as any
    }
);

leadSearchWorker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} selesai! Prospek yang diekstrak: ${job.returnvalue.leadsCreated}`);
});

leadSearchWorker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} gagal total:`, err.message);
});