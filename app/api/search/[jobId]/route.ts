import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
export async function GET(req: Request, { params }: { params: Promise<{ jobId: string }> }) {
    const { jobId } = await params;

    const job = await prisma.searchJob.findUnique({
        where: { id: jobId },
        include: { leads: true }
    });

    if (!job) {
        return NextResponse.json({ error: "Job tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(job);
}