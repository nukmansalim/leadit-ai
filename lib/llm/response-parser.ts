import { LeadAnalysisResult, Score, ComplaintCategory } from "./types";
import { LLMServiceError } from "./error";
export function parseAndValidateLLMResponse(rawResponse: string): LeadAnalysisResult {
    let parsed: Record<string, unknown>;

    try {
        parsed = JSON.parse(rawResponse);
    } catch (parseError: unknown) {
        throw new LLMServiceError(
            `Failed to parse LLM JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}. Raw response: ${rawResponse}`,
            parseError
        );
    }

    if (parsed.score === undefined || parsed.reason === undefined) {
        throw new LLMServiceError(
            `Missing required fields in LLM response. Raw response: ${rawResponse}`
        );
    }

    return {
        score: parsed.score as Score,
        reason: parsed.reason as string,
        whatsapp: (parsed.whatsapp as string) || null,
        confidence:
            typeof parsed.confidence === "number" ? parsed.confidence : undefined,
        no_instagram:
            parsed.no_instagram !== undefined
                ? Boolean(parsed.no_instagram)
                : undefined,
        no_pos:
            parsed.no_pos !== undefined ? Boolean(parsed.no_pos) : undefined,
        complaint_category: (parsed.complaint_category as ComplaintCategory) || null,
        bad_review_summary: (parsed.bad_review_summary as string) || null,
        recommended_solution: (parsed.recommended_solution as string) || null,
    };
}
