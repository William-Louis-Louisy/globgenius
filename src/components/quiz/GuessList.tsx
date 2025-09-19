import React from "react";
import type { Guess } from "@/hooks/useFlagQuiz";

export default function GuessList({ guesses }: { guesses: Guess[] }) {
  if (guesses.length === 0) return null;

  return (
    <div className="text-left bg-element rounded-lg p-3">
      <ul className="divide-y divide-white/10">
        {guesses.map((g, idx) => (
          <li
            key={`${g.label}-${idx}`}
            className="flex items-center justify-between px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className={g.isCorrect ? "text-accent" : "text-red-400"}
                aria-hidden
              >
                {g.isCorrect ? "✅" : "❌"}
              </span>
              <span className="text-sm font-medium">{g.label}</span>
            </div>

            {typeof g.distanceKm === "number" && !g.isCorrect && (
              <span className="text-sm opacity-80">
                ~ {g.distanceKm.toLocaleString()} km
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
