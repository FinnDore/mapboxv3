/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { env } from "~/env.mjs";

import clsx from "clsx";
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com

const themes = ["dusk", "day", "dawn", "night"];

const pois = [
  {
    name: "London",
    center: [-0.076445, 51.507928] as [number, number],
    zoom: 17, // starting zo
    pitch: 60, // pitch in degrees
    bearing: -40,
  },
  {
    name: "Manchester",
    center: [-2.248305, 53.473373],
    pitch: 70,
    bearing: -110,
  },
  {
    name: "Paris",
    center: [2.298191, 48.856808] as [number, number],
    pitch: 70,
    zoom: 17,
    bearing: -100,
  },
  {
    name: "NYC",
    center: [-73.973234, 40.768534] as [number, number],
    pitch: 70,
    zoom: 17,
    bearing: -110,
  },
  {
    name: "Tokyo",
    center: [139.766428, 35.679962] as [number, number],
    pitch: 70,
    bearing: -110,
    zoom: 17,
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
  const dark = ["dusk", "night"].includes(currentTheme ?? "");

  useEffect(() => {
    if (
      !mapRef.current ||
      theMapRef.current ||
      !currentPoi ||
      typeof window === "undefined"
    )
      return;
    mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX;
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
    <main className="relative h-full w-screen bg-black ">
      <div
        className={clsx(
          "absolute z-[100000] grid w-full grid-cols-3 gap-2 px-4 py-4 text-sm",
        )}
      >
        <div></div>
        <div className="0 flex justify-center">
          <button
            className={clsx(
              "group absolute w-40 rounded-full border border-black/20 bg-white px-4 py-2 text-sm  font-bold shadow-md transition-all hover:w-48 hover:scale-105 md:w-64 md:hover:w-72",
              {
                "!border-white/70 !bg-black text-white/80": dark,
              },
            )}
            onClick={() => {
              console.log(pioRef.current);
              pioRef.current = (pioRef.current + 1) % pois.length;
              console.log(pioRef.current);
              theMapRef.current.flyTo({
                ...pois[pioRef.current],
              });
              setCurrentPoi(pois[pioRef.current]);
              localStorage.setItem("pio", pioRef.current.toString());
            }}
          >
            {currentPoi?.name}
            <div className="absolute right-0 top-0 grid h-full place-content-center opacity-0 transition-all group-hover:right-3 group-hover:opacity-100">
              <Arrow />
            </div>
          </button>
        </div>
        <div className="flex justify-end">
          <button
            className={clsx(
              "rounded-md border border-black/20 bg-white px-4 py-2 shadow-md",
              {
                "!border-white/70 !bg-black text-white/80": dark,
              },
            )}
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
      </div>

      <div ref={mapRef} className="map h-screen w-screen"></div>
      <div className="absolute bottom-7 z-[10000] w-screen px-4 py-4">
        <div
          className={clsx(
            "absolute flex rounded-md border border-black/20 bg-white px-2 py-2 text-xs shadow-md transition-all md:gap-2 md:px-3 md:text-sm",

            {
              "!border-white/70 !bg-black text-white/80": dark,
            },
          )}
        >
          <div className="my-auto leading-none">
            using experimental release expect bugs
          </div>
        </div>
      </div>
    </main>
  );
}

const Arrow = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
    ></path>
  </svg>
);
