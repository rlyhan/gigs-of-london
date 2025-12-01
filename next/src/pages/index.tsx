import Mapbox from "../components/mapbox";
import Sidebar from "../components/sidebar";
import EventModal from "../components/Modal/eventModal";
import SuggestionModal from "@/components/Modal/suggestionModal";
import { filterEventsByExistingVenue } from "../helpers/filters";
import { getEventsUrl } from "../helpers/ticketmaster";
import React, { useState, useEffect } from "react";
import { Gig } from "@/types";
import { useGigs } from "@/context/GigContext";
import homeStyles from "../components/home.module.scss";
import LoadingSpinner from "@/components/loading";

interface HomePageProps {
  initialGigs: Gig[];
}

function Home({ initialGigs }: HomePageProps) {
  const { gigs, setGigs, loading } = useGigs();
  const [showSuggestionModal, setShowSuggestionModal] = useState<boolean>(false);
  const [modalGig, setModalGig] = useState<Gig | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuggestionModal(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setGigs(initialGigs);
  }, [initialGigs]);

  return (
    <div className={homeStyles.containerHome}>
      {
        loading ? <LoadingSpinner /> :
          (
            <>
              <Sidebar
                setModalGig={setModalGig}
                setShowSuggestionModal={setShowSuggestionModal}
              />

              <Mapbox
                setModalGig={setModalGig}
              />

              {modalGig && <EventModal
                gig={modalGig}
                setModalGig={setModalGig}
              />}

              {gigs?.length > 0 && <SuggestionModal
                open={showSuggestionModal}
                onClose={() => setShowSuggestionModal(false)}
                setModalGig={setModalGig}
              />}
            </>
          )
      }
    </div>
  );
}

export async function getStaticProps() {
  const today = new Date();
  const res = await fetch(getEventsUrl(today));
  const data = await res.json();

  const gigs = filterEventsByExistingVenue(data._embedded.events);

  return {
    props: { gigs },
    revalidate: 300, // Rebuild page every 5 minutes
  };
}

export default Home;
