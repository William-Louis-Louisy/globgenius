"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useAutoAdvance, AutoMode } from "@/hooks/useAutoAdvance";

type Props = {
  feedback: "idle" | "correct" | "wrong";
  onSubmit: () => void | Promise<void>;
  onNext: () => void | Promise<void>;
  autoSeconds?: number; // défaut: 5
  autoMode?: AutoMode; // "off" | "on-correct" | "on-any" (défaut: "on-any")
  className?: string;
};

export default function QuizActions({
  feedback,
  onSubmit,
  onNext,
  autoSeconds = 5,
  autoMode = "on-any",
  className,
}: Props) {
  const t = useTranslations("QuizActions");
  const { remaining, active, cancel } = useAutoAdvance(
    feedback,
    autoSeconds,
    onNext,
    autoMode
  );

  const submitDisabled = feedback !== "idle";
  const nextDisabled = feedback === "idle";

  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row gap-3">
        {/* SUBMIT */}
        <button
          type="button"
          onClick={async () => {
            if (active) cancel();
            await onSubmit();
          }}
          disabled={submitDisabled}
          className="flex-1 rounded-lg px-4 py-2 font-semibold bg-accent hover:bg-accent/75 disabled:bg-neutral/40 cursor-pointer disabled:cursor-default"
        >
          {t("submit")}
        </button>

        <button
          type="button"
          onClick={async () => {
            if (active) cancel();
            await onNext();
          }}
          disabled={nextDisabled}
          className="relative rounded-lg px-4 py-2 font-semibold text-background bg-foreground hover:bg-foreground/75 disabled:bg-neutral/40 cursor-pointer disabled:cursor-default"
          aria-live="polite"
          aria-label={
            active
              ? `${t("next")} — ${t("autoNextIn", { s: remaining })}`
              : t("next")
          }
        >
          <span className="inline-flex items-center gap-2">
            <span>{t("next")}</span>
            {active && (
              <span className="text-xs opacity-90">({remaining})</span>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
