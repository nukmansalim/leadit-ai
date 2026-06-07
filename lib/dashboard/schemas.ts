import { z } from "zod";

export const leadScoreSchema = z.enum(["High", "Medium", "Low"]);

export const leadFiltersSchema = z.object({
  q: z.string().trim().optional(),
  jobId: z.string().trim().optional(),
  score: leadScoreSchema.optional(),
  website: z.enum(["has-website", "missing-website"]).optional(),
  contact: z.enum(["has-whatsapp", "no-contact"]).optional(),
  sort: z
    .enum(["newest", "rating-asc", "reviews-asc", "opportunity"])
    .default("newest"),
});

export const createSearchJobSchema = z.object({
  location: z.string().trim().min(3, "Location must be at least 3 characters."),
  solutionFocus: z.string().trim().min(1, "Solution focus is required."),
  websiteStatus: z.boolean().optional(),
  digitalWeaknesses: z.array(z.string()).optional(),
});

export type LeadFiltersInput = z.infer<typeof leadFiltersSchema>;
export type CreateSearchJobInput = z.input<typeof createSearchJobSchema>;
