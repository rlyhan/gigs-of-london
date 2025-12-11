import moment from "moment";
import { filterImagesByAspectRatio, filterEventsByExistingVenue } from "./filters";
import { Gig } from "@/types";

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

const getEventsUrl = (date: Date) => {
  const dayAfter = new Date(date);
  dayAfter.setDate(date.getDate() + 1);
  return `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.NEXT_PUBLIC_TICKETMASTER_KEY
    }&city=London&countryCode=GB&classificationName=Music&startDateTime=${date.toISOString().split("T")[0]
    }T00:00:00Z&endDateTime=${dayAfter.toISOString().split("T")[0]
    }T00:00:00Z&size=100&sort=date,asc`;
};

const getLatLngFromEvent = (event: Gig) => {
  if (event._embedded?.venues) {
    const location = event._embedded?.venues[0]?.location;
    if (location && !isNaN(location.latitude) && !isNaN(location.longitude)) {
      return [location.longitude, location.latitude];
    }
  }
  return null;
};

const createEventPopupHTML = (gig: Gig, isTabletOrPhone: boolean) => {
  const image = `<img
  src=${filterImagesByAspectRatio(gig.images, "3_2")[0].url}
  alt=${gig.name}
/>`;
  const heading = `<h3 style="font-size: 16px; margin: 0 0 .5em;">${gig.name}</h3>`;
  const paragraph = (text: string) =>
    `<p style="font-size: 14px; margin: 0;">${text}</p>`;
  const mobileTabletCTA = isTabletOrPhone
    ? `<button id="popup-cta-${gig.id}" class="popup-cta-button" style="width: 100%; display: block; font-size: 12px; margin-top: 8px; background-color: #2da143; color: black; border: 0; border-radius: 2rem; padding: 12px 16px; cursor: pointer;">Get tickets</button>`
    : '';

  const textContent =
    heading +
    paragraph(gig._embedded?.venues[0]?.name) +
    paragraph(
      `${moment(gig.dates.start.localDate).format("MMMM Do YYYY")}, ${moment(
        gig.dates.start.localTime,
        "HH:mm:ss"
      ).format("h:mm A")}` +
      mobileTabletCTA
    );

  return `${image}
<div className="mapboxgl-popup-content-text" style="padding: 10px;">
${textContent}
</div>`;
};

export { fetchGigs, getEventsUrl, getLatLngFromEvent, createEventPopupHTML };
