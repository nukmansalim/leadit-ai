import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addLeadSearchJob } from "@/lib/bullmq/queue";
import { z } from "zod";
import { auth } from "@/auth";

const SearchRequestSchema = z.object({
    location: z.string().min(3, "Lokasi terlalu pendek"),
    solutionFocus: z.string().min(1, "Fokus solusi wajib dipilih"),
    ratingLimit: z.string().optional(),
    websiteStatus: z.boolean().optional(),
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 });
        }
        const userId = session.user.id;

        const body = await req.json();

        const parsedData = SearchRequestSchema.parse(body);

        const newJob = await prisma.searchJob.create({
            data: {
                userId: userId,
                query_params: parsedData,
                status: "pending",
                progress: 0,
                total_businesses: 0,
                leads_generated: 0
            }
        });

        const { location, solutionFocus, ratingLimit, websiteStatus } = parsedData;

        await addLeadSearchJob({
            jobId: newJob.id,
            userId,
            location,
            solutionFocus,
            ratingLimit,
            websiteStatus,
        });

        return NextResponse.json({
            success: true,
            jobId: newJob.id,
            message: "Tugas ekstraksi prospek berhasil dimasukkan ke antrean."
        }, { status: 201 });

    } catch (error: any) {
        console.error("API /search error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                message: "Parameter pencarian tidak valid.",
                errors: error
            }, { status: 400 });
        }

        if (error instanceof SyntaxError && error.message.includes("JSON")) {
            return NextResponse.json({
                success: false,
                message: "Format JSON tidak valid. Pastikan menggunakan tanda kutip ganda (\") untuk key dan string.",
                error: error.message
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            message: "Terjadi kesalahan pada server."
        }, { status: 500 });
    }
}
