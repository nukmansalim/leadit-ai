/**
 * Utility – classify errors as critical (should abort the job) vs
 * transient (skip this business, continue with the next).
 */

import { GooglePlacesError } from "@/lib/google-places";
import { LLMServiceError } from "@/lib/llm";

export function isCriticalError(err: unknown): boolean {
  if (err instanceof GooglePlacesError) {
    if (
      err.statusCode === 401 ||
      err.statusCode === 403 ||
      err.statusCode === 429
    ) {
      return true;
    }
  }

  if (err instanceof LLMServiceError) {
    const msg = err.message;
    if (
      msg.includes("Failed to parse") ||
      msg.includes("Missing required fields")
    ) {
      return false;
    }
    return true;
  }

  const message = String((err as Error)?.message || "").toLowerCase();
  if (
    message.includes("429") ||
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("unauthorized") ||
    message.includes("401") ||
    message.includes("403") ||
    message.includes("fetch failed") ||
    message.includes("econnrefused") ||
    message.includes("enotfound")
  ) {
    return true;
  }

  return false;
}
