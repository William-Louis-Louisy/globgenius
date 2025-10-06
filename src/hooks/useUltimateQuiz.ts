"use client";

import {
  readUltSnap,
  writeUltSnap,
  clearUltSnap,
  ULT_PERSIST_V,
  type UltSnap,
} from "@/lib/persist";
import {
  getCapitals,
  resolveCountry,
  getCountryNames,
  getUltimateRound,
} from "@/services/countries";
import {
  Options,
  StepAnswer,
  ToastLabels,
  AttemptsConfig,
} from "@/app/types/game";
import { Flip, toast } from "react-toastify";
import { DEFAULT_ATTEMPTS } from "@/lib/constants";
import { UseUltimateQuizAPI } from "@/app/types/api";
import { haversineKm, normalizeText } from "@/lib/geo";
import { QuizState, useQuizState } from "./useQuizState";
import type { UltimateStep } from "@/app/types/ultimate";
import { useSuggestionsCache } from "./useSuggestionsCache";
import { useCallback, useEffect, useMemo, useRef } from "react";

function getAttemptsForKind(
  kind: UltimateStep["kind"],
  conf: AttemptsConfig
): number {
  return conf[kind];
}

const createSubmitHandlers = (
  state: QuizState,
  actions: ReturnType<typeof useQuizState>[1],
  toastLabels?: ToastLabels
) => {
  const L = {
    correct: toastLabels?.correct || "✅ Correct!",
    wrong: toastLabels?.wrong || "❌ Wrong, try again!",
  };
  const handleCorrectAnswer = (firstTry: boolean, revealText: string) => {
    actions.setFeedback("correct");
    actions.setReveal(revealText);
    if (firstTry) actions.incrementScore();
    toast.success(L.correct, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Flip,
    });
  };

  const handleWrongAnswer = (nextAttempts: number, revealText: string) => {
    actions.setAttemptsLeft(nextAttempts);
    if (nextAttempts <= 0) {
      actions.setFeedback("wrong");
      actions.setReveal(revealText);
      toast.error(L.wrong, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Flip,
      });
    }
  };

  return {
    handleCorrectAnswer,
    handleWrongAnswer,
  };
};

export function useUltimateQuiz({
  locale,
  attemptsConfig,
  toastLabels,
}: Options & {
  attemptsConfig?: Partial<AttemptsConfig>;
  toastLabels?: ToastLabels;
}): UseUltimateQuizAPI {
  const attemptsConf = useMemo<AttemptsConfig>(
    () => ({ ...DEFAULT_ATTEMPTS, ...(attemptsConfig || {}) }),
    [attemptsConfig]
  );

  const { setCacheSuggestions, getFilteredSuggestions, hasExactSuggestion } =
    useSuggestionsCache();

  const warnPickSuggestion =
    toastLabels?.pickSuggestion ?? "Please pick a suggestion from the list.";

  const [state, actions] = useQuizState(attemptsConf.shape);

  const countryResolutionCache = useRef<
    Map<string, { latlng?: [number, number] | null } | null>
  >(new Map());

  const current = useMemo(
    () => state.round?.steps[state.stepIndex] ?? null,
    [state.round, state.stepIndex]
  );

  const load = useCallback(async () => {
    actions.resetState();

    try {
      const [roundData, namesData, capsData] = await Promise.all([
        getUltimateRound(locale),
        getCountryNames(locale),
        getCapitals(),
      ]);

      const countrySuggestions = namesData.map(({ iso3, name }) => ({
        iso3,
        name,
      }));
      const capitalSuggestions = capsData.map(({ iso3, capital }) => ({
        iso3,
        name: capital,
      }));

      setCacheSuggestions(countrySuggestions, capitalSuggestions);

      const resolved = await resolveCountry({
        locale,
        iso3: roundData.answerIso3,
      });

      actions.setRound(roundData);
      actions.setAnswerLatLng(resolved?.latlng ?? null);
      actions.setAttemptsLeft(
        getAttemptsForKind(roundData.steps[0].kind, attemptsConf)
      );
    } finally {
      actions.setLoading(false);
    }
  }, [locale, attemptsConf, actions, setCacheSuggestions]);

  const ensureSuggestions = useCallback(async () => {
    const [namesData, capsData] = await Promise.all([
      getCountryNames(locale),
      getCapitals(),
    ]);

    const countrySuggestions = namesData.map(({ iso3, name }) => ({
      iso3,
      name,
    }));
    const capitalSuggestions = capsData.map(({ iso3, capital }) => ({
      iso3,
      name: capital,
    }));

    setCacheSuggestions(countrySuggestions, capitalSuggestions);
  }, [locale, setCacheSuggestions]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const snap = readUltSnap(locale);
      if (snap) {
        actions.setRound(snap.round);
        actions.setStepIndex(
          Math.min(snap.stepIndex, snap.round.steps.length - 1)
        );
        actions.setFeedback(snap.feedback);
        actions.setAttemptsLeft(snap.attemptsLeft);
        actions.setReveal(snap.reveal);
        actions.setScore(snap.score);
        actions.setGuesses(snap.guesses);
        actions.setFinished(snap.finished);
        actions.setLoading(false);

        await ensureSuggestions();

        try {
          const resolved = await resolveCountry({
            locale,
            iso3: snap.round.answerIso3,
          });
          if (!cancelled) actions.setAnswerLatLng(resolved?.latlng ?? null);
        } catch {
          if (!cancelled) actions.setAnswerLatLng(null);
        }
        return;
      }
      await load();
    })();

    return () => {
      cancelled = true;
    };
  }, [locale, ensureSuggestions]);

  useEffect(() => {
    if (!state.round) return;

    const snap: UltSnap = {
      v: ULT_PERSIST_V,
      locale,
      round: state.round,
      stepIndex: state.stepIndex,
      feedback: state.feedback,
      attemptsLeft: state.attemptsLeft,
      reveal: state.reveal,
      score: state.score,
      guesses: state.guesses,
      finished: state.finished,
    };

    const id = window.setTimeout(() => writeUltSnap(locale, snap), 80);
    return () => clearTimeout(id);
  }, [
    locale,
    state.round,
    state.stepIndex,
    state.feedback,
    state.attemptsLeft,
    state.reveal,
    state.score,
    state.guesses,
    state.finished,
  ]);

  const answersForScore = useMemo<StepAnswer[]>(() => {
    if (!state.round) return [];
    const countryLabel =
      state.round.answerLocalized || state.round.answerEN || "";

    return state.round.steps.map((step) => {
      switch (step.kind) {
        case "shape":
          return { kind: "shape", label: countryLabel };

        case "capital":
          return { kind: "capital", label: step.capitalEN };

        case "area":
          return {
            kind: "area",
            label: `${Math.round(step.area).toLocaleString(locale)} km²`,
          };

        case "population":
          return {
            kind: "population",
            label: Math.round(step.population).toLocaleString(locale),
          };

        case "flag": {
          const correct = step.options[step.correctIndex];
          return { kind: "flag", label: countryLabel, svg: correct?.svg };
        }

        case "coat": {
          const correct = step.options[step.correctIndex];
          return { kind: "coat", label: countryLabel, svg: correct?.svg };
        }
      }
    });
  }, [state.round, locale]);

  const filteredCountries = useCallback(
    (query: string) => getFilteredSuggestions(query, "countries"),
    [getFilteredSuggestions]
  );

  const filteredCapitals = useCallback(
    (query: string) => getFilteredSuggestions(query, "capitals"),
    [getFilteredSuggestions]
  );

  const { handleCorrectAnswer, handleWrongAnswer } = useMemo(
    () => createSubmitHandlers(state, actions, toastLabels),
    [state, actions, toastLabels]
  );

  const submitCountry = useCallback(
    async (candidate: string) => {
      if (
        !state.round ||
        !current ||
        current.kind !== "shape" ||
        state.feedback !== "idle"
      )
        return;

      if (!hasExactSuggestion(candidate, "countries")) {
        toast.warn(warnPickSuggestion);
        return;
      }

      const revealText = state.round.answerLocalized || state.round.answerEN;
      const normalizedCandidate = normalizeText(candidate);

      const isCorrect =
        normalizedCandidate === normalizeText(state.round.answerEN) ||
        normalizedCandidate === normalizeText(state.round.answerLocalized);

      let distanceKm: number | undefined;
      if (!countryResolutionCache.current.has(candidate)) {
        try {
          const resolved = await resolveCountry({ locale, name: candidate });
          countryResolutionCache.current.set(candidate, resolved);
        } catch {
          countryResolutionCache.current.set(candidate, null);
        }
      }

      const candidateLite = countryResolutionCache.current.get(candidate);
      if (candidateLite?.latlng && state.answerLatLng) {
        distanceKm = Math.round(
          haversineKm(candidateLite.latlng, state.answerLatLng)
        );
      }

      actions.addGuess({
        label: candidate,
        isCorrect,
        distanceKm,
      });

      if (isCorrect) {
        handleCorrectAnswer(
          state.attemptsLeft === attemptsConf.shape,
          revealText
        );
      } else {
        handleWrongAnswer(state.attemptsLeft - 1, revealText);
      }
    },
    [
      state.round,
      state.feedback,
      state.attemptsLeft,
      state.answerLatLng,
      current,
      attemptsConf.shape,
      locale,
      actions,
      warnPickSuggestion,
      handleCorrectAnswer,
      handleWrongAnswer,
      hasExactSuggestion,
    ]
  );

  const submitNumeric = useCallback(
    (
      value: number,
      kind: "area" | "population",
      targetValue: number,
      tolerance: number,
      formatter: (val: number) => string
    ) => {
      if (!current || current.kind !== kind || state.feedback !== "idle")
        return;

      const min = targetValue * (1 - tolerance);
      const max = targetValue * (1 + tolerance);
      const isCorrect = value >= min && value <= max;
      const revealText = formatter(targetValue);

      if (isCorrect) {
        handleCorrectAnswer(
          state.attemptsLeft === attemptsConf[kind],
          revealText
        );
      } else {
        handleWrongAnswer(state.attemptsLeft - 1, revealText);
      }
    },
    [
      current,
      state.feedback,
      state.attemptsLeft,
      attemptsConf,
      handleCorrectAnswer,
      handleWrongAnswer,
    ]
  );

  const submitArea = useCallback(
    (value: number) => {
      if (current?.kind === "area") {
        submitNumeric(
          value,
          "area",
          current.area,
          current.tolerancePct,
          (v) => `${Math.round(v).toLocaleString("fr-FR")} km²`
        );
      }
    },
    [current, submitNumeric]
  );

  const submitPopulation = useCallback(
    (value: number) => {
      if (current?.kind === "population") {
        submitNumeric(
          value,
          "population",
          current.population,
          current.tolerancePct,
          (v) => Math.round(v).toLocaleString("fr-FR")
        );
      }
    },
    [current, submitNumeric]
  );

  const submitIndex = useCallback(
    (index: number, kind: "flag" | "coat") => {
      if (!current || current.kind !== kind || state.feedback !== "idle")
        return;

      const isCorrect = index === current.correctIndex;
      const revealText =
        state.round?.answerLocalized ?? state.round?.answerEN ?? "—";

      if (isCorrect) {
        handleCorrectAnswer(
          state.attemptsLeft === attemptsConf[kind],
          revealText
        );
      } else {
        handleWrongAnswer(state.attemptsLeft - 1, revealText);
      }
    },
    [
      current,
      state.feedback,
      state.attemptsLeft,
      state.round,
      attemptsConf,
      handleCorrectAnswer,
      handleWrongAnswer,
    ]
  );

  const submitFlag = useCallback(
    (index: number) => submitIndex(index, "flag"),
    [submitIndex]
  );

  const submitCoat = useCallback(
    (index: number) => submitIndex(index, "coat"),
    [submitIndex]
  );

  const submitCapital = useCallback(
    (candidate: string) => {
      if (!current || current.kind !== "capital" || state.feedback !== "idle")
        return;

      if (!hasExactSuggestion(candidate, "capitals")) {
        toast.warn(warnPickSuggestion);
        return;
      }

      const isCorrect =
        normalizeText(candidate) === normalizeText(current.capitalEN);
      const revealText = current.capitalEN;

      if (isCorrect) {
        handleCorrectAnswer(
          state.attemptsLeft === attemptsConf.capital,
          revealText
        );
      } else {
        handleWrongAnswer(state.attemptsLeft - 1, revealText);
      }
    },
    [
      current,
      state.feedback,
      state.attemptsLeft,
      attemptsConf.capital,
      warnPickSuggestion,
      handleCorrectAnswer,
      handleWrongAnswer,
      hasExactSuggestion,
    ]
  );

  const next = useCallback(() => {
    if (!state.round) return;

    const nextIndex = state.stepIndex + 1;
    if (nextIndex >= state.round.steps.length) {
      actions.setFinished(true);
      return;
    }

    const nextStep = state.round.steps[nextIndex];
    actions.setStepIndex(nextIndex);
    actions.setFeedback("idle");
    actions.setReveal(null);
    actions.setAttemptsLeft(getAttemptsForKind(nextStep.kind, attemptsConf));
    actions.setGuesses([]);
  }, [state.round, state.stepIndex, attemptsConf, actions]);

  const restart = useCallback(() => {
    clearUltSnap(locale);
    countryResolutionCache.current.clear();
    void load();
  }, [locale, load]);

  return useMemo(
    () => ({
      loading: state.loading,
      finished: state.finished,
      round: state.round,
      stepIndex: state.stepIndex,
      current,
      answersForScore,
      feedback: state.feedback,
      attemptsLeft: state.attemptsLeft,
      reveal: state.reveal,
      score: state.score,

      countrySuggestions: [],
      capitalSuggestions: [],
      filteredCountries,
      filteredCapitals,

      guesses: state.guesses,
      submitCountry,
      submitArea,
      submitFlag,
      submitCapital,
      submitPopulation,
      submitCoat,

      next,
      restart,
    }),
    [
      state,
      current,
      answersForScore,
      filteredCountries,
      filteredCapitals,
      submitCountry,
      submitArea,
      submitFlag,
      submitCapital,
      submitPopulation,
      submitCoat,
      next,
      restart,
    ]
  );
}
