/**
 * Stage 1 — Enrich a raw place_id into a fully enriched business object
 * by calling Google Places Details and extracting review data.
 */

import { googlePlacesService, type PlaceSearchResult } from "@/lib/google-places";
import type { MinimalBusinessInput } from "@/types/business";
import type { EnrichedBusiness } from "./types";
import { COMPLAINT_KEYWORDS } from "./complaint-keywords";

/**
 * Returns `null` when the business should be skipped (no matching bad reviews).
 */
export async function enrichBusiness(
  place: PlaceSearchResult,
): Promise<EnrichedBusiness | null> {
  const details = await googlePlacesService.getPlaceDetails(place.place_id);

  // ── Website detection ──────────────────────────────────────────────
  const websiteUrl = details.websiteUri || details.website || "";
  const isInstagram =
    websiteUrl.toLowerCase().includes("instagram.com") ||
    websiteUrl.toLowerCase().includes("instagr.am");
  const hasCustomWebsite = !!websiteUrl && !isInstagram;

  // ── Review pre-filter ──────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawReviews: any[] = details.reviews ? (details.reviews as any[]) : [];

  const badReviews = rawReviews.filter((r) => {
    const rRating = r.rating || 0;
    const rText = (r.text?.text || r.text || "").toLowerCase();
    return (
      rRating > 0 &&
      rRating <= 3 &&
      COMPLAINT_KEYWORDS.some((kw) => rText.includes(kw))
    );
  });

  if (badReviews.length === 0) {
    const name = details.displayName?.text || details.name || "N/A";
    console.log(
      `⏭️ Skipping ${name} - no bad reviews matching complaint pre-filter.`,
    );
    return null;
  }

  // ── Build enriched payload ─────────────────────────────────────────
  const formattedReviews = rawReviews
    .map((r) => `Rating: ${r.rating || 0} - ${r.text?.text || r.text || ""}`)
    .filter(Boolean);

  const minimal: MinimalBusinessInput = {
    id: place.place_id,
    nama: details.displayName?.text || details.name || "N/A",
    kategori:
      details.primaryType || (details.types ? details.types[0] : "Business"),
    rating: details.rating || 0,
    total_review: details.userRatingCount || 0,
    has_website: hasCustomWebsite,
    has_phone_number: !!(
      details.nationalPhoneNumber || details.internationalPhoneNumber
    ),
    website_url: websiteUrl,
    reviews: formattedReviews,
  };

  return {
    placeId: place.place_id,
    details,
    websiteUrl,
    isInstagram,
    hasCustomWebsite,
    formattedReviews,
    minimal,
  };
}
