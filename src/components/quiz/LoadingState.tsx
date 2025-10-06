"use client";
import React from "react";
import MaxWidthWrapper from "../commons/MaxWidthWrapper";
import { SpinnerGap } from "@phosphor-icons/react";

export default function LoadingState({ message }: { message: string }) {
  return (
    <MaxWidthWrapper className="min-h-page flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <SpinnerGap size={32} weight="bold" className="animate-spin" />
        <p>{message}</p>
      </div>
    </MaxWidthWrapper>
  );
}
