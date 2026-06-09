/**
 * Stage 2 — Static filters that can disqualify a business *before*
 * making an expensive LLM call.
 *
 * Returns `true` when the business should be **skipped**.
 */

import type { EnrichedBusiness, PipelineContext } from "./types";

export function shouldSkipBusiness(
  biz: EnrichedBusiness,
  ctx: PipelineContext,
): boolean {
  // ── Digital-weakness AND filter ────────────────────────────────────
  const { digitalWeaknesses, websiteStatus } = ctx;

  if (digitalWeaknesses && digitalWeaknesses.length > 0) {
    if (digitalWeaknesses.includes("no-website") && biz.hasCustomWebsite) {
      return true;
    }
    if (digitalWeaknesses.includes("no-instagram") && biz.isInstagram) {
      return true;
    }
  }

  // ── Website-status boolean filter ──────────────────────────────────
  if (
    typeof websiteStatus === "boolean" &&
    biz.minimal.has_website !== websiteStatus
  ) {
    return true;
  }

  return false;
}
