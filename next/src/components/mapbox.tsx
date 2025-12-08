import React, {
  useEffect,
  useRef,
  Dispatch,
  SetStateAction
} from "react";
import {
  getLatLngFromEvent,
  createEventPopupHTML,
} from "../helpers/ticketmaster";
import type { FeatureCollection, Feature, Point } from "geojson";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useGigs } from "@/context/GigContext";
import { Gig } from "@/types";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_TOKEN || "";

interface MapboxProps {
  setModalGig: Dispatch<SetStateAction<Gig | null>>;
}

export const Mapbox = ({ setModalGig }: MapboxProps) => {
  const isPhone = useBreakpoint("phone");
  const { gigs, selectedGig, setSelectedGig } = useGigs();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);


  const getGigsGeoJSON = (gigs: Gig[]): FeatureCollection<Point, { id: string; gig: string }> => {
    const features: Feature<Point, { id: string; gig: string }>[] = gigs
      .map((gig) => {
        const location = getLatLngFromEvent(gig);
        if (!location) return null; // skip gigs with no location
        return {
          type: "Feature" as const, // TypeScript needs the literal
          geometry: {
            type: "Point" as const,
            coordinates: location,
          },
          properties: {
            id: gig.id,
            gig: JSON.stringify(gig),
          },
        };
      })
      .filter(Boolean) as Feature<Point, { id: string; gig: string }>[]; // remove nulls and typecast

    return {
      type: "FeatureCollection" as const, // literal string
      features,
    };
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      // @ts-ignore
      container: mapContainer.current,
      style: "mapbox://styles/rlyhan/cll2i2nxz00e101qp8wn95xl1",
      center: [-0.063, 51.486],
      zoom: 9,
      trackResize: true,
    });

    mapRef.current = map;

    const resizeMap = () => {
      if (mapContainer.current) {
        const sidebar = document.getElementById("sidebar-top");
        if (window.innerWidth <= 1024 && sidebar) {
          mapContainer.current.style.height = `calc(100vh - ${sidebar.offsetHeight}px)`;
        } else {
          mapContainer.current.style.height = "100vh";
        }
      }
    }

    map.on("load", () => {
      if (!gigs) return;

      resizeMap();
      window.addEventListener("resize", resizeMap);

      // Remove old source/layers if they exist
      if (map.getSource("gigs")) {
        ["clusters", "cluster-count", "unclustered-point"].forEach((layer) => {
          if (map.getLayer(layer)) map.removeLayer(layer);
        });
        map.removeSource("gigs");
      }

      // Add GeoJSON source with clustering
      map.addSource("gigs", {
        type: "geojson",
        data: getGigsGeoJSON(gigs),
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 25,
      });

      // Cluster circles
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "gigs",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#51bbd6",
          "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 30, 40],
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      // Cluster counts
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "gigs",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      // // Unclustered points
      map.loadImage("/icons/marker.png", (error, image) => {
        if (error) throw error;

        if (!map.hasImage("blue-marker")) {
          map.addImage("blue-marker", image!);
        }

        map.addLayer({
          id: "unclustered-point",
          type: "symbol",
          source: "gigs",
          filter: ["!", ["has", "point_count"]],
          layout: {
            "icon-image": "blue-marker",
            "icon-size": 1, // adjust as needed
            "icon-allow-overlap": true, // allows markers to overlap
          },
        });
      });


      // Click event for unclustered points
      map.on("click", "unclustered-point", (e) => {
        const feature = e.features![0];
        const gig: Gig = JSON.parse(feature.properties!.gig);

        // Open modal
        setModalGig(gig);
        setSelectedGig(gig);
      });

      let popup: mapboxgl.Popup | null = null;

      map.on("mouseenter", "unclustered-point", (e) => {
        const feature = e.features![0];
        const gig: Gig = JSON.parse(feature.properties!.gig);

        if (gig.id !== selectedGig?.id) setSelectedGig(gig);
        map.getCanvas().style.cursor = "pointer";

        // Remove previous popup if it exists
        if (popup) {
          popup.remove();
          popup = null;
        }

        // Add new popup
        if (feature.geometry.type === "Point") {
          const coords = feature.geometry.coordinates as [number, number];
          popup = new mapboxgl.Popup({ offset: 15, className: "event-popup" })
            .setLngLat(coords)
            .setHTML(createEventPopupHTML(gig))
            .addTo(map);
        }
      });

      map.on("mouseleave", "unclustered-point", () => {
        setSelectedGig(null);
        map.getCanvas().style.cursor = "";

        // Remove popup on mouseleave
        if (popup) {
          popup.remove();
          popup = null;
        }
      });

      // Zoom into cluster on click
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        const clusterId = features[0].properties!.cluster_id;
        (map.getSource("gigs") as any).getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
          if (err) return;
          map.easeTo({
            center: (features[0].geometry as any).coordinates,
            zoom,
          });
        });
      });
    });

    return () => {
      window.removeEventListener("resize", resizeMap);
      map.remove();
    };
  }, [gigs]);

  return (
    <div
      className="mapContainer"
      ref={mapContainer}
      style={{ border: "1px solid #212121", boxSizing: "border-box" }}
    ></div>
  );
};

export default Mapbox;