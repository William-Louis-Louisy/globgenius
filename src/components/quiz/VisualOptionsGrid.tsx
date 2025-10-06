import React from "react";
import ImageWithRetry from "../commons/ImageWithRetry";
import { cn } from "@/lib/utils";

interface Props {
  options: Array<{ iso3: string; svg: string; png?: string }>;
  choiceIndex: number | null;
  correctIndex: number;
  isAnswered: boolean;
  onChoiceClick: (index: number) => void;
  optionType: "flag" | "coat";
}

export default function VisualOptionsGrid({
  options,
  choiceIndex,
  correctIndex,
  isAnswered,
  onChoiceClick,
  optionType,
}: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {options.map((opt, idx) => {
        const isChosen = choiceIndex === idx;
        const isCorrectIdx = idx === correctIndex;
        const isUserWrongChoice = isAnswered && isChosen && !isCorrectIdx;
        const isCorrect = isAnswered && isCorrectIdx;

        const stateClasses = isAnswered
          ? isCorrect
            ? "ring-4 ring-green-600 bg-green-500/60"
            : isUserWrongChoice
            ? "ring-4 ring-red-600 bg-red-500/60"
            : ""
          : isChosen
          ? "ring-4 ring-foreground"
          : "";

        return (
          <button
            key={`${opt.iso3}-${idx}`}
            type="button"
            onClick={() => onChoiceClick(idx)}
            className={cn(
              "relative rounded-lg p-3 transition",
              !isChosen && !isUserWrongChoice && !isCorrect
                ? "hover:bg-foreground/60"
                : "",
              stateClasses
            )}
            disabled={isAnswered}
            aria-pressed={isChosen}
            aria-label={`${optionType === "flag" ? "Flag" : "Coat"} option ${
              idx + 1
            }`}
          >
            <ImageWithRetry
              srcs={[opt.png, opt.svg].filter(Boolean) as string[]}
              alt={opt.iso3}
              className="w-full h-20 object-contain select-none drop-shadow-sm"
            />
          </button>
        );
      })}
    </div>
  );
}
