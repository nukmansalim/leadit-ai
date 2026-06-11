export type Score = "High" | "Medium" | "Low";

export type ComplaintCategory =
    | "slow_service"
    | "long_queues"
    | "payment_issues"
    | "food_consistency"
    | "cleanliness"
    | "other";

export interface LeadAnalysisResult {
    score: Score;
    reason: string;
    whatsapp: string | null;
    confidence?: number;
    no_instagram?: boolean;
    no_pos?: boolean;
    complaint_category: ComplaintCategory | null;
    bad_review_summary: string | null;
    recommended_solution: string | null;
}