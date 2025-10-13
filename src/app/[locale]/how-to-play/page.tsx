"use client";
import React from "react";
import { useTranslations } from "next-intl";
import MaxWidthWrapper from "@/components/commons/MaxWidthWrapper";
import ModeInstruction from "@/components/cards/ModeInstruction";
import { modeInstructions } from "@/lib/gameModes";

export default function HowToPlay() {
  const t = useTranslations("HowToPlay");
  return (
    <MaxWidthWrapper className="min-h-page flex flex-col items-center mt-16">
      <div className="max-w-3xl py-4 md:py-6">
        <header className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-montserrat font-bold">
            {t("title")}
          </h1>
          <p className="opacity-70">{t("intro")}</p>
        </header>

        <div className="grid gap-4 lg:gap-6">
          {modeInstructions.map((instruction, index) => (
            <ModeInstruction
              key={index}
              title={t(instruction.titleKey)}
              sub={t(instruction.howKey)}
              description={instruction.descriptionKeys.map((key) => t(key))}
              path={instruction.path}
              variants={instruction.variants}
            />
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
