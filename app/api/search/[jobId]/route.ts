import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth";

export async function GET(req: Request, { params }: { params: Promise<{ jobId: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await params;

    const job = await prisma.searchJob.findFirst({
        where: {
            id: jobId,
            userId: session.user.id
        },
        include: { leads: true }
    });

    if (!job) {
        return NextResponse.json({ error: "Job tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(job);
}