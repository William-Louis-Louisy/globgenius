import React from "react";
import Image from "next/image";

interface TipData {
  iso3: string;
  name: string;
  area: number;
  flag: string;
}

export default function AreaTipVignette({ country }: { country: TipData }) {
  return (
    <div className="flex flex-col items-center justify-between gap-0.5 text-black">
      <span className="font-semibold text-xs">{country.name}</span>
      <Image src={country.flag} alt="flag" width={40} height={40} priority />
      <span className="font-semibold text-xs">
        {country.area.toLocaleString("fr-FR")} km²
      </span>
    </div>
  );
}
