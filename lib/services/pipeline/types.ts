import type { PlaceDetailsResult } from "@/lib/google-places";
import type { MinimalBusinessInput } from "@/types/business";
import type { LeadAnalysisResult } from "@/lib/llm/llm";

// ── Shared context that flows through the entire pipeline ────────────

export interface PipelineContext {
  jobId: string;
  userId: string;
  location: string;
  businessCategory: string;
  solutionFocus: string;
  websiteStatus?: boolean;
  digitalWeaknesses?: string[];
}

// ── Per-business enriched data produced by each pipeline stage ────────

export interface EnrichedBusiness {
  placeId: string;
  details: PlaceDetailsResult;
  websiteUrl: string;
  isInstagram: boolean;
  hasCustomWebsite: boolean;
  formattedReviews: string[];
  minimal: MinimalBusinessInput;
}

export interface AnalyzedLead extends EnrichedBusiness {
  analysis: LeadAnalysisResult;
}

// ── Progress callback ────────────────────────────────────────────────

export type ProgressCallback = (progress: number) => Promise<void>;
