
import { MinimalBusinessInput } from "@/types/business";
import { retryWithBackoff } from "../utils/resilience";
import { LeadAnalysisResult } from "./types";
import { LLMServiceError } from "./error";
import { callGroqAPI } from "./groq-client";
import { buildPrompt } from "./prompt-builder";
import { parseAndValidateLLMResponse } from "./response-parser";

interface AnalyzeParams {
  business: MinimalBusinessInput;
  solutionFocus: string;
}

export let mockAnalyzeLeadWithLLM: typeof analyzeLeadWithLLM | null = null;

export function setMockAnalyzeLeadWithLLM(
  mock: typeof analyzeLeadWithLLM | null
) {
  mockAnalyzeLeadWithLLM = mock;
}


export async function analyzeLeadWithLLM({
  business,
  solutionFocus,
}: AnalyzeParams): Promise<LeadAnalysisResult> {
  if (mockAnalyzeLeadWithLLM) {
    return mockAnalyzeLeadWithLLM({ business, solutionFocus });
  }

  const prompt = buildPrompt(business, solutionFocus);

  try {
    return await retryWithBackoff(async () => {
      const rawResponse = await callGroqAPI(prompt);
      return parseAndValidateLLMResponse(rawResponse);
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const details = error instanceof LLMServiceError ? error.details : "";
    console.error("❌ Groq AI SDK Analysis Error:", message, details || "");
    throw error;
  }
}


export { LLMServiceError };
export type { LeadAnalysisResult };
