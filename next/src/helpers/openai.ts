import { Gig, GigSuggestion } from "@/types";
import moment from "moment";

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

/**
 * Call the OpenAI API to generate a description for a gig.
 * @param gig - The gig to describe
 * @returns The generated description, or null on failure
 */
export async function getGigDescription(gig: Gig): Promise<string | null> {
    if (!gig.name || !gig.name.trim()) {
        return null;
    }

    try {
        const res = await fetch("/api/openai/describe-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: gig.name,
                venue: gig._embedded?.venues[0]?.name,
                date: gig.dates?.start?.localDate
                    ? moment(gig.dates.start.localDate).format("MMMM Do YYYY")
                    : undefined,
                time: gig.dates?.start?.localTime
                    ? moment(gig.dates.start.localTime, "HH:mm:ss").format("h:mm A")
                    : undefined,
                info: gig.info,
                pleaseNote: gig.pleaseNote,
            }),
        });

        if (!res.ok) {
            console.error("Failed to fetch description:", res.statusText);
            return null;
        }

        const data = await res.json();
        return data.description || null;
    } catch (err) {
        console.error("getGigDescription error:", err);
        return null;
    }
}