export interface MinimalBusinessInput {
    id: string;
    nama: string;
    kategori: string;
    rating: number | null;
    total_review: number | null;
    has_website: boolean;
    has_phone_number: boolean;
    website_url?: string;
    reviews?: string[];
}

export interface AnalyzeParams {
    business: MinimalBusinessInput;
    solutionFocus: string;
}