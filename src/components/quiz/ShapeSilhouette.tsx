"use client";

import React from "react";
import type { GeoShape } from "@/app/types/geojson";

type Props = {
  shape: GeoShape;
  className?: string;
  strokeWidth?: number;
};

export default function ShapeSilhouette({
  shape,
  className,
  strokeWidth = 2,
}: Props) {
  const { viewBox, paths, fillRule = "evenodd" } = shape;

  return (
    <svg
      viewBox={viewBox}
      className={
        className ??
        "w-[360px] h-[240px] rounded-lg border bg-black/10"
      }
      role="img"
      aria-label="Country shape"
      preserveAspectRatio="xMidYMid meet"
    >
      {paths.map((d, i) => (
        <path
          key={`fill-${i}`}
          d={d}
          fill="currentColor"
          className="text-foreground/80"
          fillRule={fillRule}
        />
      ))}
      {paths.map((d, i) => (
        <path
          key={`stroke-${i}`}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-foreground"
        />
      ))}
    </svg>
  );
}
