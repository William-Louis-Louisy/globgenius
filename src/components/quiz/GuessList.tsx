import React from "react";
import { motion } from "motion/react";
import type { Guess } from "@/app/types/game";

export default function GuessList({ guesses }: { guesses: Guess[] }) {
  if (guesses.length === 0) return null;

  return (
    <motion.div
      className="text-left bg-element rounded-lg p-3"
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{
        opacity: 1,
        scaleY: 1,
        transformOrigin: "top",
        transition: { duration: 0.31, ease: [0.2, 0.7, 0.3, 1] },
      }}
    >
      <ul className="divide-y divide-white/10">
        {guesses.map((g, idx) => (
          <motion.li
            key={`${g.label}-${idx}`}
            className="flex items-center justify-between px-3 py-2"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{
              opacity: 1,
              scaleX: 1,
              transformOrigin: "left",
              transition: { duration: 0.31, ease: [0.2, 0.7, 0.3, 1] },
            }}
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
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
