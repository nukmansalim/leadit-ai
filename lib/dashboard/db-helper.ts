import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { leadFiltersSchema } from "./schemas";

export function buildLeadWhere(
    userId: string,
    filters: z.infer<typeof leadFiltersSchema>,
): Prisma.LeadWhereInput {
    const where: Prisma.LeadWhereInput = { userId };

    if (filters.jobId) {
        where.jobId = filters.jobId;
    }

    if (filters.score) {
        where.ai_lead_score = filters.score;
    }

    if (filters.website === "has-website") {
        where.website = { not: null };
    }

    if (filters.website === "missing-website") {
        where.website = null;
    }

    if (filters.contact === "has-whatsapp") {
        where.formatted_whatsapp = { not: null };
    }

    if (filters.contact === "no-contact") {
        where.AND = [{ formatted_whatsapp: null }, { phone: null }];
    }

    if (filters.q) {
        where.OR = [
            { business_name: { contains: filters.q, mode: "insensitive" } },
            { address: { contains: filters.q, mode: "insensitive" } },
            { ai_analysis_reason: { contains: filters.q, mode: "insensitive" } },
        ];
    }

    return where;
}

export function buildLeadOrderBy(
    sort: z.infer<typeof leadFiltersSchema>["sort"],
): Prisma.LeadOrderByWithRelationInput[] {
    switch (sort) {
        case "opportunity":
            return [{ rating: "asc" }, { total_reviews: "asc" }, { created_at: "desc" }];

        case "rating-asc":
            return [{ rating: "asc" }, { created_at: "desc" }];

        case "reviews-asc":
            return [{ total_reviews: "asc" }, { created_at: "desc" }];

        case "newest":
        default:
            return [{ created_at: "desc" }];
    }
}