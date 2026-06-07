import { z } from "zod";

export const LeadSearchJobPayloadSchema = z.object({
  jobId: z.string(),
  userId: z.string(),
  location: z.string().trim().min(3),
  solutionFocus: z.string().trim().min(1),
  ratingLimit: z.string().trim().optional(),
  websiteStatus: z.boolean().optional(),
  digitalWeaknesses: z.array(z.string()).optional(),
});

export type LeadSearchJobData = z.infer<typeof LeadSearchJobPayloadSchema>;

export interface LeadSearchJobResult {
  success: boolean;
  jobId: string;
  totalBusinesses: number;
  totalLeads: number;
  message?: string;
}

export interface LeadSearchProgressPayload {
  progress: number;
}
