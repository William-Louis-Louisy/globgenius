"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useFlagQuiz } from "@/hooks/useFlagQuiz";
import GuessList from "@/components/quiz/GuessList";
import HintsPanel from "@/components/quiz/HintsPanel";
import { useLocale, useTranslations } from "next-intl";
import QuizActions from "@/components/quiz/QuizActions";
import QuizHeading from "@/components/quiz/QuizHeading";
import LoadingState from "@/components/quiz/LoadingState";
import AttemptsFeedback from "@/components/quiz/AttemptsFeedback";
import MaxWidthWrapper from "@/components/commons/MaxWidthWrapper";
import QuestionWrapper from "@/components/animated/QuestionWrapper";
import AnswerAutocomplete from "@/components/quiz/AnswerAutocomplete";

const ATTEMPTS = 5;

export default function FlagQuizPage() {
  const locale = useLocale();
  const t = useTranslations("FlagPage");

  const quiz = useFlagQuiz({ locale, attempts: ATTEMPTS });

  // Autocomplete
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>("");

  const filtered = useMemo(
    () => quiz.filteredSuggestions(query),
    [quiz, query]
  );

  async function submitCurrent() {
    await quiz.submit((selected || query).trim());
    setSelected("");
    setQuery("");
  }

  if (quiz.loading || !quiz.flagUrl) {
    return <LoadingState message={t("loading")} />;
  }

  return (
    <MaxWidthWrapper className="min-h-page flex flex-col items-center mt-16">
      <div className="w-full max-w-xl py-4 md:py-6 text-center">
        <QuizHeading
          title={t("title")}
          description={t("description")}
          maxAttempts={t("maxAttempts")}
          attempts={ATTEMPTS}
        />
        <>
          {/* FLAG */}
          <QuestionWrapper>
            <Image
              src={quiz.flagUrl}
              alt="Country flag"
              width={300}
              height={200}
              className="w-72 h-44 object-contain rounded-lg border"
            />
          </QuestionWrapper>

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
                title: t("hints", { default: "Indices" }),
                region: t("region", { default: "Région" }),
                capital: t("capital", { default: "Capitale" }),
                firstLetter: t("firstLetter", { default: "Première lettre" }),
              }}
              showRegion={quiz.hints.showRegion}
              showCapital={quiz.hints.showCapital}
              showFirstLetter={quiz.hints.showFirstLetter}
              region={quiz.hints.region}
              capital={quiz.hints.capital}
              firstLetter={quiz.hints.firstLetter}
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
      </div>
    </MaxWidthWrapper>
  );
}
