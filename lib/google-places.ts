import { retryWithBackoff } from "./utils/resilience";

export class GooglePlacesError extends Error {
  constructor(message: string, public readonly statusCode?: number, public readonly details?: unknown) {
    super(message);
    this.name = "GooglePlacesError";
  }
}

export interface SearchTextParams {
  textQuery: string;
  maxResults?: number;
}

export interface PlaceSearchResult {
  place_id: string;
}

export interface PlaceDetailsResult {
  id: string;
  displayName?: { text: string };
  name?: string;
  primaryType?: string;
  types?: string[];
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  website?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  formattedAddress?: string;
  reviews?: Record<string, unknown>[];
}

interface GoogleApiErrorResponse {
  error?: {
    message?: string;
  };
}

function getApiKey(): string {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    throw new GooglePlacesError("GOOGLE_PLACES_API_KEY belum dipasang di file .env");
  }
  return key;
}

const BASE_URL = "https://places.googleapis.com/v1/places";

export const googlePlacesService = {
  async searchText({ textQuery, maxResults = 12 }: SearchTextParams): Promise<PlaceSearchResult[]> {
    return retryWithBackoff(async () => {
      const apiKey = getApiKey();
      
      let response: Response;
      try {
        response = await fetch(`${BASE_URL}:searchText`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "places.id",
          },
          body: JSON.stringify({
            textQuery,
            maxResultCount: maxResults,
          }),
        });
      } catch (networkError) {
        throw new GooglePlacesError(
          `Google Places Search network error: ${networkError instanceof Error ? networkError.message : String(networkError)}`
        );
      }

      if (!response.ok) {
        let errorDetails: GoogleApiErrorResponse | null = null;
        try {
          errorDetails = await response.json() as GoogleApiErrorResponse;
        } catch {
          // ignore parsing error
        }
        throw new GooglePlacesError(
          `Google Places Search API Error: ${errorDetails?.error?.message || response.statusText}`,
          response.status,
          errorDetails
        );
      }

      const data = await response.json() as { places?: { id: string }[] };
      const places = data.places || [];

      return places.map((place) => ({
        place_id: place.id,
      }));
    });
  },

  async getPlaceDetails(placeId: string): Promise<PlaceDetailsResult> {
    return retryWithBackoff(async () => {
      const apiKey = getApiKey();

      let response: Response;
      try {
        response = await fetch(`${BASE_URL}/${placeId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "id,displayName,formattedAddress,rating,userRatingCount,websiteUri,nationalPhoneNumber,reviews",
          },
        });
      } catch (networkError) {
        throw new GooglePlacesError(
          `Google Place Details network error: ${networkError instanceof Error ? networkError.message : String(networkError)}`
        );
      }

      if (!response.ok) {
        let errorDetails: GoogleApiErrorResponse | null = null;
        try {
          errorDetails = await response.json() as GoogleApiErrorResponse;
        } catch {
          // ignore parsing error
        }
        throw new GooglePlacesError(
          `Google Place Details API Error: ${errorDetails?.error?.message || response.statusText}`,
          response.status,
          errorDetails
        );
      }

      return await response.json() as PlaceDetailsResult;
    });
  }
};
