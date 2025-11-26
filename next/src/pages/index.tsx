import Layout from "../components/layout";
import Mapbox from "../components/mapbox";
import Sidebar from "../components/sidebar";
import EventModal from "../components/Modal/eventModal";
import SuggestionModal from "@/components/Modal/suggestionModal";
import { filterEventsByExistingVenue } from "../helpers/filters";
import { getEventsUrl } from "../helpers/ticketmaster";
import React, { useState, useEffect } from "react";

interface HomePageProps {
  gigs: any;
}

function Home({ gigs }: HomePageProps) {
  const [gigList, setGigList] = useState(gigs);
  const [showSuggestionModal, setShowSuggestionModal] = useState<boolean>(false);
  const [selectedGigId, setSelectedGigId] = useState<string | null>(null);
  const [modalGigId, setModalGigId] = useState<string | null>(null);

  const selectedGig = gigList.find((gig: any) => gig.id === modalGigId);

  useEffect(() => {
    console.log('gigs:', gigList)
    const timer = setTimeout(() => {
      setShowSuggestionModal(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout home>
      <Sidebar
        gigs={gigList}
        setGigList={setGigList}
        setSelectedGigId={setSelectedGigId}
        setModalGigId={setModalGigId}
      />

      <Mapbox
        gigs={gigList}
        selectedGigId={selectedGigId}
        setSelectedGigId={setSelectedGigId}
      />

      <EventModal
        gig={selectedGig}
        setModalGigId={setModalGigId}
      />

      {/* <SuggestionModal
        open={showSuggestionModal}
        onClose={() => setShowSuggestionModal(false)}
      /> */}
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const today = new Date();
    const res = await fetch(getEventsUrl(today));
    const data = await res.json();
    // Removes events with no venue location
    const gigs = filterEventsByExistingVenue(data._embedded.events);

    return {
      props: {
        gigs,
      },
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      props: {
        gigs: [],
      },
    };
  }
}

export default Home;
