"use client";

import React, { useMemo, useState } from "react";
import { useShapeQuiz } from "@/hooks/useShapeQuiz";
import GuessList from "@/components/quiz/GuessList";
import HintsPanel from "@/components/quiz/HintsPanel";
import { useLocale, useTranslations } from "next-intl";
import QuizActions from "@/components/quiz/QuizActions";
import ShapeSilhouette from "@/components/quiz/ShapeSilhouette";
import AttemptsFeedback from "@/components/quiz/AttemptsFeedback";
import MaxWidthWrapper from "@/components/commons/MaxWidthWrapper";
import AnswerAutocomplete from "@/components/quiz/AnswerAutocomplete";
import QuizHeading from "@/components/quiz/QuizHeading";

const ATTEMPTS = 5;

export default function ShapeQuizPage() {
  const locale = useLocale();
  const t = useTranslations("ShapePage");

  const quiz = useShapeQuiz({ locale, attempts: ATTEMPTS });

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");

  const filtered = useMemo(
    () => quiz.filteredSuggestions(query),
    [quiz, query]
  );

  async function submitCurrent() {
    await quiz.submit((selected || query).trim());
    setSelected("");
    setQuery("");
  }

  return (
    <MaxWidthWrapper className="min-h-page flex flex-col items-center mt-16">
      <div className="w-full max-w-xl py-4 md:py-0 text-center">
        <QuizHeading
          title={t("title")}
          description={t("description")}
          maxAttempts={t("maxAttempts")}
          attempts={ATTEMPTS}
        />

        {quiz.loading || !quiz.shape ? (
          <p className="text-neutral">{t("loading")}</p>
        ) : (
          <>
            {/* SHAPE */}
            <div className="flex items-center justify-center mb-6 select-none">
              {quiz.shape && (
                <ShapeSilhouette
                  shape={quiz.shape}
                  className="w-[360px] h-[240px] rounded-lg border bg-black/10"
                />
              )}
            </div>

            {/* INPUT + AUTOCOMPLETE */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await submitCurrent();
              }}
              className="space-y-4"
            >
              <AnswerAutocomplete
                value={selected}
                query={query}
                onChangeValue={setSelected}
                onChangeQuery={setQuery}
                onSubmitEnterNoActive={submitCurrent}
                suggestions={filtered}
                placeholder={t("placeholder")}
                disabled={quiz.feedback !== "idle"}
              />

              {/* USER GUESSES LIST */}
              <GuessList guesses={quiz.guesses} />

              {/* HINTS */}
              <HintsPanel
                labels={{
                  title: t("hints"),
                  region: t("region"),
                  firstLetter: t("firstLetter"),
                }}
                showRegion={quiz.hints.showRegion}
                showFirstLetter={quiz.hints.showFirstLetter}
                region={quiz.hints.region ?? undefined}
                firstLetter={quiz.hints.firstLetter ?? undefined}
              />

              {/* ATTEMPTS + FEEDBACK */}
              <AttemptsFeedback
                attemptsLeft={quiz.attemptsLeft}
                feedback={quiz.feedback}
                answerLocalized={quiz.answerLocalized}
                labels={{
                  remainingAttempts: t("remainingAttempts"),
                  correct: t("correct"),
                  wrong: t("wrong"),
                }}
              />

              {/* Actions */}
              <QuizActions
                autoMode="on-correct"
                feedback={quiz.feedback}
                onSubmit={submitCurrent}
                onNext={async () => {
                  setSelected("");
                  setQuery("");
                  await quiz.nextQuestion();
                }}
              />
            </form>
          </>
        )}
      </div>
    </MaxWidthWrapper>
  );
}
