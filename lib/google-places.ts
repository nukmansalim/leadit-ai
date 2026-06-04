const API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

const BASE_URL = "https://places.googleapis.com/v1/places";

if (!API_KEY) {
    throw new Error("GOOGLE_PLACES_API_KEY belum dipasang di file .env");
}

export const googlePlacesService = {

    async searchText({ textQuery, maxResults = 12 }: { textQuery: string, maxResults?: number }) {
        const response = await fetch(`${BASE_URL}:searchText`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": API_KEY,
                "X-Goog-FieldMask": "places.id",
            },
            body: JSON.stringify({
                textQuery,
                maxResultCount: maxResults,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Google Places API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();

        return (data.places || []).map((place: { id: string }) => ({
            place_id: place.id,
        }));
    },

    async getPlaceDetails(placeId: string) {
        const response = await fetch(`${BASE_URL}/${placeId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": API_KEY,
                "X-Goog-FieldMask": "id,displayName,formattedAddress,rating,userRatingCount,websiteUri,nationalPhoneNumber,reviews",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Google Place Details API Error: ${errorData.error?.message || response.statusText}`);
        }

        return await response.json();
    }
};