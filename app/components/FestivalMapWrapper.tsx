"use client";

import dynamic from "next/dynamic";

const FestivalMap = dynamic(() => import("./FestivalMap"), { ssr: false });

export default function FestivalMapWrapper() {
  return <FestivalMap />;
}
