"use client";

import Image from "next/image";
import { useFlagQuiz } from "@/hooks/useFlagQuiz";
import { SpinnerGap } from "@phosphor-icons/react";
import GuessList from "@/components/quiz/GuessList";
import HintsPanel from "@/components/quiz/HintsPanel";
import { useLocale, useTranslations } from "next-intl";
import React, { useMemo, useState, useTransition } from "react";
import AttemptsFeedback from "@/components/quiz/AttemptsFeedback";
import MaxWidthWrapper from "@/components/commons/MaxWidthWrapper";
import AnswerAutocomplete from "@/components/quiz/AnswerAutocomplete";

const ATTEMPTS = 5;

export default function FlagQuizPage() {
  const locale = useLocale();
  const t = useTranslations("FlagPage");
  const [isPending, startTransition] = useTransition();

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

  return (
    <MaxWidthWrapper className="min-h-page flex flex-col items-center mt-16">
      <div className="w-full max-w-xl p-6 text-center">
        <header className="mb-6">
          <h1 className="text-3xl">{t("title")}</h1>
          <p className="text-sm opacity-70">
            {t("description")}, {ATTEMPTS} {t("maxAttempts")}
          </p>
        </header>

        {quiz.loading || !quiz.flagUrl ? (
          <p className="text-neutral">{t("loading")}</p>
        ) : (
          <>
            {/* FLAG */}
            <div className="flex items-center justify-center mb-6">
              <Image
                src={quiz.flagUrl}
                alt="Country flag"
                width={300}
                height={200}
                className="w-72 h-44 object-contain rounded-lg border"
              />
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
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={quiz.feedback !== "idle"}
                  className="flex-1 rounded-lg px-4 py-2 font-semibold bg-accent hover:bg-accent/75 disabled:bg-neutral/40 cursor-pointer disabled:cursor-default"
                >
                  {t("validate")}
                </button>
                <button
                  type="button"
                  disabled={quiz.feedback === "idle" || isPending}
                  onClick={() => {
                    setSelected("");
                    setQuery("");
                    startTransition(quiz.nextQuestion);
                  }}
                  className="rounded-lg px-4 py-2 font-semibold text-background bg-foreground hover:bg-foreground/75 disabled:bg-neutral/40 cursor-pointer disabled:cursor-default"
                >
                  {isPending ? (
                    <SpinnerGap size={20} className="animate-spin" />
                  ) : (
                    t("next")
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </MaxWidthWrapper>
  );
}
