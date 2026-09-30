"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("./LocationMap").then((mod) => mod.LocationMap), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full animate-pulse rounded-xl bg-gray-100" aria-hidden="true" />,
});

export function Location({ location, label = "Hizmet konumu" }) {
  if (!location) return null;
  return <LocationMap lat={location.lat} lng={location.lng} label={label} />;
}
