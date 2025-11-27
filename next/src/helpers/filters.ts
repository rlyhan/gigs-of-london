import moment from "moment";
import { Gig } from "@/types";
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

const filterImagesByAspectRatio = (images: any[], aspectRatio: string) => {
  return images.filter((image) => image.ratio === aspectRatio) || images;
};

const findLargestImage = (images: any[]) => {
  return images.sort((a, b) => b.width - a.width)[0];
};

export {
  filterEventsByAttractionId,
  filterEventsByDate,
  filterEventsByExistingVenue,
  filterImagesByAspectRatio,
  findLargestImage,
};
