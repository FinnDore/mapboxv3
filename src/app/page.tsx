/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { env } from "~/env.mjs";

// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com

const themes = ["dusk", "day"];

const pois = [
  {
    name: "London",
    center: [-0.076445, 51.507928] as [number, number],
    zoom: 17, // starting zo
    pitch: 60, // pitch in degrees
    bearing: -40,
  },
  {
    name: "NYC",
    center: [-73.973234, 40.768534] as [number, number],
    pitch: 70,
    bearing: -110,
  },
  {
    name: "Manchester",
    center: [-2.248305, 53.473373],
    pitch: 70,
    bearing: -110,
  },
];

export default function HomePage() {
  "use client";
  const mapRef = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const theMapRef = useRef<any>(null);
  const themeRef = useRef<number>(0);
  const [currentTheme, setCurrentTheme] = useState(themes[themeRef.current]);
  const pioRef = useRef<number>(0);
  const [currentPoi, setCurrentPoi] = useState(pois[pioRef.current]);
  useEffect(() => {
    if (
      !mapRef.current ||
      theMapRef.current ||
      !currentPoi ||
      typeof window === "undefined"
    )
      return;
    mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX;
    console.log(currentPoi.center);

    pioRef.current = 0;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
    const map: any = new mapboxgl.Map({
      container: mapRef.current, // container ID
      center: pois[pioRef.current]?.center as [number, number], // starting position [lng, lat]
      zoom: pois[pioRef.current]?.zoom, // starting zoom
      pitch: pois[pioRef.current]?.pitch, // pitch in degrees
      bearing: pois[pioRef.current]?.bearing, // bearing in degrees
    });
    map.on("style.load", () => {
      map.setConfigProperty("basemap", "lightPreset", "dusk");
      map.setConfigProperty("basemap", "showPointOfInterestLabels", true);
    });
    theMapRef.current = map;
    return () => {
      // a
    };
  }, [currentPoi]);

  return (
    <main className="relative h-screen w-screen bg-black">
      <div className="absolute right-6 top-6 z-[100000] flex gap-2 text-sm">
        <button
          className="rounded-md border border-white bg-black px-4 py-2 text-white shadow-md"
          onClick={() => {
            pioRef.current = (pioRef.current + 1) % pois.length;
            theMapRef.current.flyTo({
              ...pois[pioRef.current],
            });
            setCurrentPoi(pois[pioRef.current]);
            localStorage.setItem("pio", pioRef.current.toString());
          }}
        >
          flyto
        </button>
        <button
          className="rounded-md border border-white bg-black px-4 py-2 text-white shadow-md"
          onClick={() => {
            themeRef.current = (themeRef.current + 1) % themes.length;
            theMapRef.current.setConfigProperty(
              "basemap",
              "lightPreset",
              themes[themeRef.current],
            );

            setCurrentTheme(themes[themeRef.current]);
          }}
        >
          {currentTheme}
        </button>
      </div>

      <div ref={mapRef} className="map h-screen w-screen"></div>
    </main>
  );
}
