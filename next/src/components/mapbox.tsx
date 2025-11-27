import React, {
  useEffect,
  useState,
  useRef,
} from "react";
import {
  getLatLngFromEvent,
  createEventPopupHTML,
} from "../helpers/ticketmaster";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useGigs } from "@/context/GigContext";
import { Gig } from "@/types";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_TOKEN || "";

export const Mapbox = () => {
  const { gigs, selectedGig, setSelectedGig } = useGigs();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  let hoveredPolygonId: React.MutableRefObject<null> | null = useRef(null);
  const [currentMarker, setCurrentMarker] = useState<mapboxgl.Marker | null>(null);

  useEffect(() => {
    const mapboxMap = new mapboxgl.Map({
      // @ts-ignore
      container: mapContainer.current,
      style: "mapbox://styles/rlyhan/cll2i2nxz00e101qp8wn95xl1",
      center: [-0.063, 51.486],
      zoom: 9,
      trackResize: true,
    });

    if (window.innerWidth < 1024 && document.getElementById("sidebar")) {
      // @ts-ignore
      mapContainer.current.style.height = `calc(100vh - ${
        // @ts-ignore
        document.getElementById("sidebar").offsetHeight
        }px)`;
    }

    mapboxMap.on("load", () => {
      // Add the main data (boroughs of London)
      mapboxMap.addSource("boroughs", {
        type: "geojson",
        data: "https://skgrange.github.io/www/data/london_boroughs.json",
        generateId: true,
      });

      mapboxMap.addLayer({
        id: "borough-fills",
        type: "fill",
        source: "boroughs",
        layout: {},
        paint: {
          "fill-color": "#FFFFFF",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.5,
            0.25,
          ],
        },
      });

      mapboxMap.on("mousemove", "borough-fills", (e) => {
        // @ts-ignore
        if (e.features.length > 0) {
          if (hoveredPolygonId !== null) {
            mapboxMap.setFeatureState(
              // @ts-ignore
              { source: "boroughs", id: hoveredPolygonId },
              { hover: false }
            );
          }
          // @ts-ignore
          hoveredPolygonId = e.features[0].id;
          mapboxMap.setFeatureState(
            // @ts-ignore
            { source: "boroughs", id: hoveredPolygonId },
            { hover: true }
          );
        }
      });

      mapboxMap.on("mouseleave", "borough-fills", () => {
        if (hoveredPolygonId !== null) {
          mapboxMap.setFeatureState(
            // @ts-ignore
            { source: "boroughs", id: hoveredPolygonId },
            { hover: false }
          );
        }
        hoveredPolygonId = null;
      });

      setupMarkers(gigs);
    });

    mapRef.current = mapboxMap

    window.addEventListener("resize", () => {
      if (mapContainer.current) {
        if (window.innerWidth < 1024 && document.getElementById("sidebar")) {
          // @ts-ignore
          mapContainer.current.style.height = `calc(100vh - ${
            // @ts-ignore
            document.getElementById("sidebar").offsetHeight
            }px)`;
        } else {
          // @ts-ignore
          mapContainer.current.style.height = "100vh";
        }
      }
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      mapboxMap.remove();
    };
  }, []);

  // When gigs are updated, create new markers
  useEffect(() => {
    if (gigs) setupMarkers(gigs);
  }, [gigs]);

  // Clear current markers
  // Create new markers corresponding to gig location
  const setupMarkers = (gigs: Gig[]) => {
    if (!mapRef.current) return;

    clearMarkers();

    const markerList: mapboxgl.Marker[] = [];

    gigs.forEach((gig) => {
      const marker = createMarker(gig);
      if (marker) markerList.push(marker);
    });

    // Update the ref, not state
    markersRef.current = markerList;

    // Add new markers to map
    markersRef.current.forEach((marker) => marker.addTo(mapRef.current!));
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  const createMarker = (gig: Gig) => {
    const location = getLatLngFromEvent(gig);
    if (location) {
      // @ts-ignore
      const marker = new mapboxgl.Marker().setLngLat(location);
      const popup = new mapboxgl.Popup({
        className: "event-popup",
      }).setHTML(createEventPopupHTML(gig));
      marker.setPopup(popup);
      marker.getElement().setAttribute("data-id", gig.id);
      marker.getElement().addEventListener("mouseenter", () => {
        if (gig.id !== selectedGig?.id) {
          setSelectedGig(gig);
        }
      });
      marker.getElement().addEventListener("mouseleave", () => {
        setSelectedGig(null);
      });
      return marker;
    }
    return null;
  };

  // When the selectedGig changes (by hovering over sidebar gigs
  // or hovering over markers)...
  // Remove current marker if it is not null
  // If selectedGig is not null,
  // find marker on map by id that matches selectedGig
  // and set currentMarker to that marker + show its popup
  useEffect(() => {
    if (currentMarker) {
      // @ts-ignore
      currentMarker.togglePopup();
      setCurrentMarker(null);
    }

    if (selectedGig && markersRef.current.length > 0) {
      const gigMarker = markersRef.current.find(
        (marker) => marker.getElement().dataset.id === selectedGig.id
      );
      if (gigMarker && currentMarker !== gigMarker) {
        gigMarker.togglePopup();
        setCurrentMarker(gigMarker);
      }
    }
  }, [selectedGig]);

  return (
    <div
      className="mapContainer"
      ref={mapContainer}
      style={{
        border: "1px solid #212121",
        boxSizing: "border-box",
      }}
    ></div>
  );
};

export default Mapbox;
