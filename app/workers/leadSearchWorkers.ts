import { Worker, Job } from "bullmq";
import Redis from "ioredis";
import { prisma } from "@/lib/prisma";
import { googlePlacesService } from "@/lib/google-places";
import { analyzeLeadWithLLM } from "@/lib/llm";
import { MinimalBusinessInput } from "../../types/business";
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


            const dynamicQuery = `Klinik dan Apotek di ${location}`;
            console.log(``);

            const businesses = await googlePlacesService.searchText({
                textQuery: dynamicQuery,
                maxResults: 5,
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
                    await job.updateProgress(progress);

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

leadSearchWorker.on("completed", (job, result) => {
    console.log(`✅ Job ${job.id} selesai! Prospek yang diekstrak: ${result?.leadsCreated ?? 0}`);
});

leadSearchWorker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} gagal total:`, err.message);
});