"use client";

import { TITLE_MAP } from "@/lib/constants";
import React, { useCallback, useMemo } from "react";
import GuessList from "@/components/quiz/GuessList";
import { useQuizInputs } from "@/hooks/useQuizInputs";
import { useLocale, useTranslations } from "next-intl";
import QuizActions from "@/components/quiz/QuizActions";
import ScoreScreen from "@/components/quiz/ScoreScreen";
import { useUltimateQuiz } from "@/hooks/useUltimateQuiz";
import LoadingState from "@/components/quiz/LoadingState";
import NumericInput from "@/components/quiz/NumericInput";
import ShapeSilhouette from "@/components/quiz/ShapeSilhouette";
import AttemptsFeedback from "@/components/quiz/AttemptsFeedback";
import MaxWidthWrapper from "@/components/commons/MaxWidthWrapper";
import VisualOptionsGrid from "@/components/quiz/VisualOptionsGrid";
import AnswerAutocomplete from "@/components/quiz/AnswerAutocomplete";
import QuestionWrapper from "@/components/animated/QuestionWrapper";
import AreaTip from "@/components/cards/AreaTip";

export default function UltimateQuizPage() {
  const locale = useLocale();
  const t = useTranslations("UltimatePage");
  const quiz = useUltimateQuiz({
    locale,
    toastLabels: {
      correct: t("correct"),
      wrong: t("wrong"),
      pickSuggestion: t("pickSuggestion"),
    },
  });
  const {
    state: inputs,
    updateField,
    reset: resetInputs,
  } = useQuizInputs(locale);

  const handleSubmit = useCallback(async () => {
    const c = quiz.current;
    if (!c) return;

    const submissionMap = {
      shape: () => {
        quiz.submitCountry((inputs.selected || inputs.query).trim());
        updateField("selected", "");
        updateField("query", "");
      },
      capital: () => {
        quiz.submitCapital((inputs.selected || inputs.query).trim());
        updateField("selected", "");
        updateField("query", "");
      },
      area: () => {
        quiz.submitArea(Number(inputs.numeric.replace(/\s/g, "")));
        updateField("numeric", "");
      },
      population: () => {
        quiz.submitPopulation(Number(inputs.numeric.replace(/\s/g, "")));
        updateField("numeric", "");
      },
      flag: () => {
        if (inputs.choiceIndex !== null) quiz.submitFlag(inputs.choiceIndex);
      },
      coat: () => {
        if (inputs.choiceIndex !== null) quiz.submitCoat(inputs.choiceIndex);
      },
    };

    submissionMap[c.kind]?.();
  }, [quiz, inputs, updateField]);

  const handleNext = useCallback(() => {
    resetInputs();
    quiz.next();
  }, [quiz, resetInputs]);

  const title = useMemo(() => {
    if (!quiz.current) return "";
    return t(TITLE_MAP[quiz.current.kind]);
  }, [quiz.current, t]);

  if (quiz.loading) {
    return <LoadingState message={t("loading")} />;
  }

  if (quiz.finished) {
    return (
      <ScoreScreen
        title={t("title")}
        seriesDone={t("seriesDone")}
        scoreLabel={t("score")}
        score={quiz.score}
        total={quiz.round?.steps.length ?? 0}
        nextSeries={t("nextSeries")}
        answers={quiz.answersForScore}
        onRestart={quiz.restart}
      />
    );
  }

  const c = quiz.current;
  if (!c) return null;

  const isAnswered = quiz.feedback !== "idle";

  return (
    <MaxWidthWrapper className="min-h-page flex flex-col items-center mt-16">
      <div className="w-full max-w-2xl pb-4 lg:p-6 text-center">
        <header className="mb-6">
          <h1 className="text-3xl font-montserrat font-bold">{t("title")}</h1>
          <p className="text-sm opacity-70">{t("description")}</p>
        </header>

        {quiz.stepIndex > 0 && quiz.round && (
          <p className="mb-4 text-sm opacity-80">
            {t("currentCountry")}{" "}
            <span className="font-semibold">
              {quiz.round.answerLocalized || quiz.round.answerEN}
            </span>
          </p>
        )}
        <h2 className="text-lg lg:text-xl font-semibold mb-4">{title}</h2>

        <div className="mb-6">
          {c.kind === "shape" && (
            <>
              <QuestionWrapper className="relative">
                <ShapeSilhouette
                  shape={c.shapeSvg}
                  className="w-[420px] h-[280px] rounded-lg border border-foreground/10 bg-black/10"
                />
                {quiz.feedback !== "idle" && (
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-semibold text-sm px-3 py-1 bg-accent">
                    {quiz.reveal}
                  </span>
                )}
              </QuestionWrapper>
              <div className="mt-6">
                <AnswerAutocomplete
                  value={inputs.selected}
                  query={inputs.query}
                  onChangeValue={(v) => updateField("selected", v)}
                  onChangeQuery={(q) => updateField("query", q)}
                  onSubmitEnterNoActive={handleSubmit}
                  suggestions={quiz.filteredCountries(inputs.query)}
                  placeholder={t("placeholderCountry")}
                  disabled={isAnswered}
                />
                <div className="mt-4">
                  <GuessList guesses={quiz.guesses} />
                </div>
              </div>
            </>
          )}

          {(c.kind === "flag" || c.kind === "coat") && (
            <VisualOptionsGrid
              options={c.options}
              choiceIndex={inputs.choiceIndex}
              correctIndex={c.correctIndex}
              isAnswered={isAnswered}
              onChoiceClick={(idx) => updateField("choiceIndex", idx)}
              optionType={c.kind}
            />
          )}

          {c.kind === "capital" && (
            <div className="mt-6">
              <AnswerAutocomplete
                value={inputs.selected}
                query={inputs.query}
                onChangeValue={(v) => updateField("selected", v)}
                onChangeQuery={(q) => updateField("query", q)}
                onSubmitEnterNoActive={handleSubmit}
                suggestions={quiz.filteredCapitals(inputs.query)}
                placeholder={t("placeholderCapital")}
                disabled={isAnswered}
              />
            </div>
          )}

          {(c.kind === "area" || c.kind === "population") && (
            <NumericInput
              value={inputs.numeric}
              onChange={(v) => updateField("numeric", v)}
              onSubmit={handleSubmit}
              disabled={isAnswered}
              placeholder={t("numberPlaceholder")}
              toleranceText={t("tolerance", {
                p: Math.round(c.tolerancePct * 100),
              })}
            />
          )}

          {c.kind === "area" && (
            <AreaTip
              iso3={quiz.round?.answerIso3 || ""}
              label={t("areaTipLabel")}
            />
          )}
        </div>

        <AttemptsFeedback
          attemptsLeft={quiz.attemptsLeft}
          feedback={quiz.feedback}
          answerLocalized={quiz.reveal ?? ""}
          labels={{
            remainingAttempts: t("remainingAttempts"),
            correct: t("correct"),
            wrong: t("wrong"),
          }}
        />

        <QuizActions
          feedback={quiz.feedback}
          onSubmit={handleSubmit}
          onNext={handleNext}
          autoMode="off"
          className="mt-2"
        />
      </div>
    </MaxWidthWrapper>
  );
}
