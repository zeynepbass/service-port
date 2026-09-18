"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(
  () => import("./LocationMap").then((mod) => mod.LocationMap),
  { ssr: false }
);

export function Location({ konum }) {
  if (!konum) return null;

  return <LocationMap konum={konum} />;
}
