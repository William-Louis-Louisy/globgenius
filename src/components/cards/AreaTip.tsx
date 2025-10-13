import {
  russia,
  canada,
  greece,
  nicaragua,
  vatican,
  monaco,
} from "@/lib/countriesAreaTip";
import React from "react";
import AreaTipVignette from "./AreaTipVignette";
import { LightbulbFilament } from "@phosphor-icons/react";

export default function AreaTip({
  iso3,
  label,
}: {
  iso3: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-3 bg-yellow-200/85 p-4 mt-6 rounded-lg">
      <div className="inline-flex items-center gap-1 text-yellow-700">
        <LightbulbFilament size={20} weight="fill" />
        <p className="text-sm font-bold">{label}</p>
      </div>

      <div className="grid grid-cols-3 divide-x divide-yellow-600">
        <AreaTipVignette country={iso3 === russia.iso3 ? canada : russia} />
        <AreaTipVignette country={iso3 === greece.iso3 ? nicaragua : greece} />
        <AreaTipVignette country={iso3 === vatican.iso3 ? monaco : vatican} />
      </div>
    </div>
  );
}
