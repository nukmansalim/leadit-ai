import type { Prisma } from "@prisma/client";

export type SearchJobStatus = "pending" | "processing" | "completed" | "failed";

export type DashboardSearchJob = {
  id: string;
  status: SearchJobStatus | string;
  query_params: Prisma.JsonValue;
  progress: number;
  total_businesses: number;
  leads_generated: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type DashboardLead = {
  id: string;
  jobId: string;
  place_id: string;
  business_name: string;
  address: string | null;
  rating: number | null;
  total_reviews: number | null;
  website: string | null;
  phone: string | null;
  formatted_whatsapp: string | null;
  ai_lead_score: "High" | "Medium" | "Low" | string;
  ai_analysis_reason: string;
  complaint_category: string | null;
  bad_review_summary: string | null;
  recommended_solution: string | null;
  confidence: number | null;
  created_at: string;
};

export type LeadsResponse = {
  success: true;
  leads: DashboardLead[];
  jobs: DashboardSearchJob[];
};

export type SearchJobResponse = DashboardSearchJob & {
  leads?: DashboardLead[];
};

export type CreateSearchJobResponse = {
  success: true;
  jobId: string;
  message: string;
};
