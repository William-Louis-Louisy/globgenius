"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAutoAdvance, AutoMode } from "@/hooks/useAutoAdvance";
import Reveal from "../animated/Reveal";

type Props = {
  feedback: "idle" | "correct" | "wrong";
  onSubmit: () => void | Promise<void>;
  onNext: () => void | Promise<void>;
  autoSeconds?: number; // default: 5
  autoMode?: AutoMode; // "off" | "on-correct" | "on-any" (default: "on-any")
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

  const showSubmit = !submitDisabled;
  const showNext = !nextDisabled;

  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row gap-3">
        {/* SUBMIT */}
        <Reveal show={showSubmit} side="left" className="flex-1">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              if (active) cancel();
              await onSubmit();
            }}
            disabled={submitDisabled}
            className="w-full rounded-lg px-4 py-2 font-semibold bg-accent hover:bg-accent/75 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/60"
          >
            {t("submit")}
          </motion.button>
        </Reveal>

        <Reveal show={showNext} side="right" className="flex-1">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              if (active) cancel();
              await onNext();
            }}
            disabled={nextDisabled}
            className="w-full relative rounded-lg px-4 py-2 font-semibold text-background bg-foreground hover:bg-foreground/75 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground/60"
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
          </motion.button>
        </Reveal>
      </div>
    </div>
  );
}
