import React from "react";
import { Compass, Buildings, At } from "@phosphor-icons/react";

export type HintsProps = {
  labels: {
    title: string;
    region: string;
    capital: string;
    firstLetter: string;
  };
  showRegion: boolean;
  showCapital: boolean;
  showFirstLetter: boolean;
  region?: string | null;
  capital?: string | null;
  firstLetter?: string | null;
};

export default function HintsPanel({
  labels,
  showRegion,
  showCapital,
  showFirstLetter,
  region,
  capital,
  firstLetter,
}: HintsProps) {
  if (!(showRegion || showCapital || showFirstLetter)) return null;

  return (
    <div className="text-left rounded-lg p-4 bg-element/70 ring-1 ring-white/10">
      <p className="text-sm font-semibold mb-3">{labels.title}</p>
      <div className="space-y-2">
        {showRegion && (
          <div className="flex items-center gap-2">
            <Compass size={18} />
            <span className="text-sm">
              <strong>{labels.region}:</strong> {region ?? "—"}
            </span>
          </div>
        )}
        {showCapital && (
          <div className="flex items-center gap-2">
            <Buildings size={18} />
            <span className="text-sm">
              <strong>{labels.capital}:</strong> {capital ?? "—"}
            </span>
          </div>
        )}
        {showFirstLetter && (
          <div className="flex items-center gap-2">
            <At size={18} />
            <span className="text-sm">
              <strong>{labels.firstLetter}:</strong> {firstLetter ?? "—"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
