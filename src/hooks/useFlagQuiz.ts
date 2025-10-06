"use client";

import {
  resolveCountry,
  getCountryNames,
  getRandomFlagQuestion,
} from "@/services/countries";
import { normalizeText, haversineKm } from "@/lib/geo";
import { Feedback, Guess, Options } from "@/app/types/game";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CountryLite, NameSuggestion } from "@/app/types/country";

type Hints = {
  region?: string | null;
  capital?: string | null;
  firstLetter?: string | null;
  showRegion: boolean;
  showCapital: boolean;
  showFirstLetter: boolean;
};

export type UseFlagQuizState = {
  loading: boolean;
  flagUrl: string | null;
  answerEN: string;
  answerLocalized: string;
  attemptsLeft: number;
  feedback: Feedback;
  suggestions: NameSuggestion[];
  guesses: Guess[];
  hints: Hints;
};

export type UseFlagQuizAPI = UseFlagQuizState & {
  filteredSuggestions(query: string): NameSuggestion[];
  submit(candidate: string): Promise<void>;
  nextQuestion(): Promise<void>;
};

export function useFlagQuiz({ locale, attempts = 5 }: Options): UseFlagQuizAPI {
  const [loading, setLoading] = useState(true);
  const [flagUrl, setFlagUrl] = useState<string | null>(null);
  const [answerEN, setAnswerEN] = useState<string>("");
  const [answerLocalized, setAnswerLocalized] = useState<string>("");
  const [answerDetails, setAnswerDetails] = useState<CountryLite | null>(null);
  const [suggestions, setSuggestions] = useState<NameSuggestion[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(attempts);
  const [feedback, setFeedback] = useState<Feedback>("idle");

  useEffect(() => {
    let disposed = false;
    getCountryNames(locale)
      .then((list) => {
        if (!disposed) setSuggestions(list);
      })
      .catch(() => {
        if (!disposed) setSuggestions([]);
      });
    return () => {
      disposed = true;
    };
  }, [locale]);

  const load = useCallback(async () => {
    setLoading(true);
    setFeedback("idle");
    setGuesses([]);
    setAttemptsLeft(attempts);

    try {
      const data = await getRandomFlagQuestion(locale);
      setFlagUrl(data.question.data);

      const det = await resolveCountry({ locale, name: data.answer });
      setAnswerDetails(det);

      setAnswerEN(det?.nameEN ?? data.answer);
      setAnswerLocalized(
        det?.nameLocalized ?? data.localizedAnswer ?? data.answer
      );
    } finally {
      setLoading(false);
    }
  }, [attempts, locale]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredSuggestions = useCallback(
    (query: string) => {
      const q = normalizeText(query);
      if (!q) return suggestions.slice(0, 50);
      return suggestions
        .filter((s) => normalizeText(s.name).includes(q))
        .slice(0, 50);
    },
    [suggestions]
  );

  const submit = useCallback(
    async (candidateRaw: string) => {
      if (feedback !== "idle" || !candidateRaw) return;

      const candidate = candidateRaw.trim();
      const normCandidate = normalizeText(candidate);
      const normAnswerLoc = normalizeText(answerLocalized);
      const normAnswerEN = normalizeText(answerEN);

      const matchedSuggestion = suggestions.find(
        (s) => normalizeText(s.name) === normCandidate
      );

      let ok =
        !!matchedSuggestion &&
        !!answerDetails?.iso3 &&
        matchedSuggestion.iso3 === answerDetails.iso3;

      if (!ok) {
        ok = normCandidate === normAnswerLoc || normCandidate === normAnswerEN;
      }

      const guess: Guess = { label: candidate, isCorrect: ok };

      if (ok) {
        setGuesses((g) => [...g, guess]);
        setFeedback("correct");
        return;
      }

      const next = attemptsLeft - 1;
      setAttemptsLeft(next);

      if (answerDetails?.latlng && matchedSuggestion) {
        const guessed = await resolveCountry({
          locale,
          iso3: matchedSuggestion.iso3,
        });
        if (guessed?.latlng) {
          guess.iso3 = matchedSuggestion.iso3;
          guess.distanceKm = haversineKm(guessed.latlng, answerDetails.latlng);
        }
      }

      setGuesses((g) => [...g, guess]);
      if (next <= 0) setFeedback("wrong");
    },
    [
      feedback,
      answerLocalized,
      answerEN,
      attemptsLeft,
      suggestions,
      answerDetails,
      locale,
    ]
  );

  const hints: Hints = useMemo(() => {
    const wrongCount = attempts - attemptsLeft;

    const showRegion = wrongCount >= 2 && !!answerDetails?.region;
    const showCapital = wrongCount >= 3 && !!answerDetails?.capital;
    const showFirstLetter = wrongCount >= 4 && !!answerLocalized[0];

    return {
      region: answerDetails?.region ?? null,
      capital: answerDetails?.capital ?? null,
      firstLetter: showFirstLetter ? answerLocalized[0] : null,
      showRegion,
      showCapital,
      showFirstLetter,
    };
  }, [attempts, attemptsLeft, guesses, answerDetails]);

  const nextQuestion = useCallback(async () => {
    if (feedback === "idle" && attemptsLeft === attempts) return;
    await load();
  }, [attempts, attemptsLeft, feedback, load]);

  return {
    loading,
    flagUrl,
    answerEN,
    answerLocalized,
    attemptsLeft,
    feedback,
    suggestions,
    guesses,
    hints,
    filteredSuggestions,
    submit,
    nextQuestion,
  };
}
