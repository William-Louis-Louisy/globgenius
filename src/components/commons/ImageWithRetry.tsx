"use client";
import Image from "next/image";
import React, { useMemo, useState, useCallback } from "react";

type Props = {
  srcs: string[];
  alt: string;
  className?: string;
  retriesPerSrc?: number;
};

export default function ImageWithRetry({
  srcs,
  alt,
  className,
  retriesPerSrc = 1,
}: Props) {
  const [srcIdx, setSrcIdx] = useState(0);
  const [bust, setBust] = useState(0);

  const currentSrc = useMemo(() => {
    const base = srcs[srcIdx];
    if (!base) return "";
    return bust > 0
      ? `${base}${base.includes("?") ? "&" : "?"}cb=${bust}`
      : base;
  }, [srcIdx, bust, srcs]);

  const handleError = useCallback(() => {
    if (bust < retriesPerSrc) {
      setBust((b) => b + 1);
      return;
    }
    if (srcIdx < srcs.length - 1) {
      setSrcIdx((i) => i + 1);
      setBust(0);
      return;
    }
  }, [bust, retriesPerSrc, srcIdx, srcs.length]);

  if (!currentSrc) {
    return <div className={className} aria-hidden></div>;
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      className={className}
      decoding="async"
      loading="eager"
      onError={handleError}
      draggable={false}
      priority
      width={100}
      height={100}
    />
  );
}
