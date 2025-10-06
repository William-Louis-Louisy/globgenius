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
    <div className="flex items-center justify-between text-sm">
      <span className="opacity-70">
        {labels.remainingAttempts} : {attemptsLeft}
      </span>
      {feedback === "correct" && (
        <span className="text-accent font-semibold">
          ✅ {labels.correct} — {answerLocalized}
        </span>
      )}
      {feedback === "wrong" && (
        <span className="text-red-400 font-semibold">
          ❌ {labels.wrong} — {answerLocalized}
        </span>
      )}
    </div>
  );
}
