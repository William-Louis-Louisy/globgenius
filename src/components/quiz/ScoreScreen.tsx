"use client";
import {
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
} from "@headlessui/react";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { StepAnswer } from "@/app/types/game";
import globus from "../../../public/globus.png";
import { CaretDown, Star } from "@phosphor-icons/react";
import MaxWidthWrapper from "../commons/MaxWidthWrapper";

interface Props {
  title: string;
  seriesDone: string;
  scoreLabel: string;
  score: number;
  total: number;
  nextSeries: string;
  answers: StepAnswer[];
  onRestart: () => void;
}

export default function ScoreScreen({
  title,
  seriesDone,
  scoreLabel,
  score,
  total,
  nextSeries,
  answers,
  onRestart,
}: Props) {
  const t = useTranslations("UltimatePage");
  const filled = Math.max(0, Math.min(score, total));

  const messageKey =
    score === 0
      ? "message.zero"
      : score <= 2
      ? "message.low"
      : score <= 4
      ? "message.mid"
      : "message.high";

  return (
    <MaxWidthWrapper className="min-h-page flex flex-col items-center mt-16">
      <div className="w-full max-w-2xl lg:p-6 text-center">
        <h1 className="text-3xl font-montserrat font-bold mb-2">{title}</h1>
        <p className="mb-6">{seriesDone}</p>
        <div className="rounded-lg bg-element/70 border p-6 mb-6 flex flex-col items-center gap-4">
          <p className="text-2xl font-bold">{scoreLabel}</p>
          <div
            className="flex items-center justify-center gap-1"
            aria-label={`${filled} sur ${total} étoiles`}
            role="img"
          >
            {Array.from({ length: total }, (_, i) => {
              const isFilled = i < filled;
              return (
                <Star
                  key={`star-${i}`}
                  size={40}
                  weight={isFilled ? "fill" : "regular"}
                  className={
                    isFilled ? "text-yellow-600" : "text-foreground/50"
                  }
                  aria-hidden="true"
                />
              );
            })}
          </div>
          <p className="text-lg font-semibold mt-2">{t(messageKey)}</p>

          <button
            onClick={onRestart}
            className="font-semibold cursor-pointer bg-accent hover:bg-accent/75 duration-150 px-4 py-2 rounded-md"
          >
            {nextSeries}
          </button>

          <Image
            src={globus}
            alt="globus"
            width={140}
            height={140}
            className="drop-shadow-lg drop-shadow-foreground"
          />

          <Disclosure>
            {({ open }) => (
              <div className="flex flex-col items-center gap-3">
                <DisclosureButton className="text-sm bg-element rounded-lg p-3 gap-3 inline-flex items-center cursor-pointer">
                  {t("showAnswers")}{" "}
                  <CaretDown
                    size={16}
                    className={cn(open ? "rotate-180" : "")}
                  />
                </DisclosureButton>
                <DisclosurePanel>
                  <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {answers.map((a) => (
                      <li
                        key={a.kind}
                        className="flex flex-col items-center justify-between bg-element rounded-lg p-3 gap-3"
                      >
                        <span className="font-light text-xs">{t(a.kind)}</span>
                        <span className="font-semibold">
                          {"svg" in a && a.svg ? (
                            <Image
                              src={a.svg}
                              alt={a.label}
                              width={48}
                              height={48}
                            />
                          ) : (
                            <span>{a.label}</span>
                          )}
                        </span>
                        <span></span>
                      </li>
                    ))}
                  </ul>
                </DisclosurePanel>
              </div>
            )}
          </Disclosure>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
