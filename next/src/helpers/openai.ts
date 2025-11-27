import { Gig, GigSuggestion } from "@/types";

/**
 * Call the OpenAI API to classify gigs based on user text.
 * @param text - User description of the desired night
 * @param gigs - Array of gigs to consider
 * @returns Array of GigSuggestion
 */
export async function getGigSuggestions(text: string, gigs: Gig[]): Promise<GigSuggestion[]> {
    // Only keep gigs with a valid name
    const validGigs = gigs.filter((gig) => gig.name && gig.name.trim() !== "");
    if (validGigs.length === 0) {
        console.warn("No valid gigs with a name to send to the API.");
        return [];
    }

    try {
        const res = await fetch("/api/openai/classify-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text,
                gigs: validGigs.map((gig) => ({ name: gig.name, id: gig.id })),
            }),
        });

        if (!res.ok) {
            console.error("Failed to fetch suggestions:", res.statusText);
            return [];
        }

        const data = await res.json();
        return data.suggestions || [];
    } catch (err) {
        console.error("getGigSuggestions error:", err);
        return [];
    }
}