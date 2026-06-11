import type { EnrichedBusiness, PipelineContext } from "./types";

export function shouldSkipBusiness(
  biz: EnrichedBusiness,
  ctx: PipelineContext,
): boolean {
  const { digitalWeaknesses, websiteStatus } = ctx;

  if (digitalWeaknesses && digitalWeaknesses.length > 0) {
    if (digitalWeaknesses.includes("no-website") && biz.hasCustomWebsite) {
      return true;
    }
    if (digitalWeaknesses.includes("no-instagram") && biz.isInstagram) {
      return true;
    }
  }

  if (
    typeof websiteStatus === "boolean" &&
    biz.minimal.has_website !== websiteStatus
  ) {
    return true;
  }

  return false;
}
