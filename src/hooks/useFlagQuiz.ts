"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { normalizeText, haversineKm } from "@/lib/geo";
import {
  getCountryNames,
  getRandomFlagQuestion,
  resolveCountry,
} from "@/services/countries";
import { CountryLite, NameSuggestion } from "@/app/types/country";

export type Feedback = "idle" | "correct" | "wrong";

export type Guess = {
  label: string;
  iso3?: string;
  distanceKm?: number;
  isCorrect: boolean;
};

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

type Options = {
  locale: string;
  attempts?: number; // default 5
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
      setAnswerEN(data.answer);
      setAnswerLocalized(data.localizedAnswer ?? data.answer);

      const det = await resolveCountry({ locale, name: data.answer });
      setAnswerDetails(det);
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

      const ok =
        normalizeText(candidate) === normalizeText(answerLocalized) ||
        normalizeText(candidate) === normalizeText(answerEN);

      const guess: Guess = {
        label: candidate,
        isCorrect: ok,
      };

      if (ok) {
        setGuesses((g) => [...g, guess]);
        setFeedback("correct");
        return;
      }

      const next = attemptsLeft - 1;
      setAttemptsLeft(next);

      const suggestion = suggestions.find(
        (s) => normalizeText(s.name) === normalizeText(candidate)
      );

      if (answerDetails?.latlng && suggestion) {
        const guessed = await resolveCountry({ locale, iso3: suggestion.iso3 });
        if (guessed?.latlng) {
          guess.iso3 = suggestion.iso3;
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
    const showFirstLetter = wrongCount >= 4 && !!answerEN[0];

    return {
      region: answerDetails?.region ?? null,
      capital: answerDetails?.capital ?? null,
      firstLetter: showFirstLetter ? answerEN[0] : null,
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
