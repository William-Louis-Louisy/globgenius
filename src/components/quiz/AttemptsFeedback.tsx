import React from "react";

type Props = {
  attemptsLeft: number;
  feedback: "idle" | "correct" | "wrong";
  answerLocalized: string;
  labels: {
    remainingAttempts: string;
    correct: string;
    wrong: string;
  };
};

export default function AttemptsFeedback({
  attemptsLeft,
  feedback,
  answerLocalized,
  labels,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
      <span className="opacity-70 text-left">
        {labels.remainingAttempts} : {attemptsLeft}
      </span>
      {feedback === "correct" && (
        <span className="text-accent font-semibold text-right">
          ✅ {labels.correct} — {answerLocalized}
        </span>
      )}
      {feedback === "wrong" && (
        <span className="text-red-400 font-semibold text-right">
          ❌ {labels.wrong} — {answerLocalized}
        </span>
      )}
    </div>
  );
}
