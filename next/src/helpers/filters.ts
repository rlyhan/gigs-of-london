import moment from "moment";
import { Gig, GigImage } from "@/types";
import { getLatLngFromEvent } from "./ticketmaster";

const filterEventsByAttractionId = (events: Gig[]) => {
  const distinctEvents: Gig[] = [];
  const distinctAttractionIds = new Set();
  events.forEach((event, index) => {
    if (
      index === 0 ||
      (event._embedded?.attractions &&
        !Array.from(distinctAttractionIds).includes(
          event._embedded?.attractions[0]?.id
        ))
    ) {
      distinctEvents.push(event);
      distinctAttractionIds.add(event._embedded.attractions[0]?.id);
    }
  });
  return distinctEvents;
};

const filterEventsByDate = (events: Gig[], date: Date) => {
  return events.filter(
    (event) =>
      moment(event.dates.start.dateTime).format("YYYY-MM-DD") ===
      moment(date).format("YYYY-MM-DD")
  );
};

const filterEventsByExistingVenue = (events: Gig[]) => {
  return events.filter((event) => getLatLngFromEvent(event) !== null);
};

const filterImagesByAspectRatio = (images: GigImage[], aspectRatio: string) => {
  return images.filter((image) => image.ratio === aspectRatio) || images;
};

const findLargestImage = (images: GigImage[], maxWidth?: number) => {
  if (!images || images.length === 0) return null;

  let candidates = maxWidth
    ? images.filter(img => img.width <= maxWidth)
    : images;

  if (candidates.length === 0) candidates = images;

  const largest = candidates.sort((a, b) => b.width - a.width)[0];

  return largest || null;
};

export {
  filterEventsByAttractionId,
  filterEventsByDate,
  filterEventsByExistingVenue,
  filterImagesByAspectRatio,
  findLargestImage,
};
