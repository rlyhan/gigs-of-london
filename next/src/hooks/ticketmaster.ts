import { Gig } from "../types";
import { filterEventsByExistingVenue } from "../helpers/filters";

async function fetchGigs(filterDate: Date): Promise<Gig[]> {
    try {
        const res = await fetch(`/api/gigs?date=${filterDate.toISOString()}`);
        const data = await res.json();
        return filterEventsByExistingVenue(data._embedded?.events || []);
    } catch (err) {
        console.error("fetchGigs error:", err);
        return [];
    }
}

export { fetchGigs };