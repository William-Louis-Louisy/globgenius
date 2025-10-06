import { useMemo, useState } from "react";
import { Feedback, Guess } from "@/app/types/game";
import { UltimateRound } from "@/app/types/ultimate";

export interface QuizState {
  loading: boolean;
  finished: boolean;
  round: UltimateRound | null;
  stepIndex: number;
  feedback: Feedback;
  attemptsLeft: number;
  reveal: string | null;
  score: number;
  guesses: Guess[];
  answerLatLng: [number, number] | null;
}

export const useQuizState = (
  initialAttempts: number
): [
  QuizState,
  {
    setLoading: (loading: boolean) => void;
    setFinished: (finished: boolean) => void;
    setRound: (round: UltimateRound | null) => void;
    setStepIndex: (index: number) => void;
    setFeedback: (feedback: Feedback) => void;
    setAttemptsLeft: (attempts: number) => void;
    setReveal: (reveal: string | null) => void;
    incrementScore: () => void;
    setScore: (score: number) => void;
    addGuess: (guess: Guess) => void;
    setGuesses: (guesses: Guess[]) => void;
    setAnswerLatLng: (latlng: [number, number] | null) => void;
    resetState: () => void;
  }
] => {
  const [state, setState] = useState<QuizState>({
    loading: true,
    finished: false,
    round: null,
    stepIndex: 0,
    feedback: "idle",
    attemptsLeft: initialAttempts,
    reveal: null,
    score: 0,
    guesses: [],
    answerLatLng: null,
  });

  const actions = useMemo(
    () => ({
      setLoading: (loading: boolean) =>
        setState((prev) => ({ ...prev, loading })),
      setFinished: (finished: boolean) =>
        setState((prev) => ({ ...prev, finished })),
      setRound: (round: UltimateRound | null) =>
        setState((prev) => ({ ...prev, round })),
      setStepIndex: (stepIndex: number) =>
        setState((prev) => ({ ...prev, stepIndex })),
      setFeedback: (feedback: Feedback) =>
        setState((prev) => ({ ...prev, feedback })),
      setAttemptsLeft: (attemptsLeft: number) =>
        setState((prev) => ({ ...prev, attemptsLeft })),
      setReveal: (reveal: string | null) =>
        setState((prev) => ({ ...prev, reveal })),
      incrementScore: () =>
        setState((prev) => ({ ...prev, score: prev.score + 1 })),
      setScore: (score: number) => setState((prev) => ({ ...prev, score })),
      addGuess: (guess: Guess) =>
        setState((prev) => ({ ...prev, guesses: [...prev.guesses, guess] })),
      setGuesses: (guesses: Guess[]) =>
        setState((prev) => ({ ...prev, guesses })),
      setAnswerLatLng: (answerLatLng: [number, number] | null) =>
        setState((prev) => ({ ...prev, answerLatLng })),
      resetState: () =>
        setState({
          loading: true,
          finished: false,
          round: null,
          stepIndex: 0,
          feedback: "idle",
          attemptsLeft: initialAttempts,
          reveal: null,
          score: 0,
          guesses: [],
          answerLatLng: null,
        }),
    }),
    [initialAttempts]
  );

  return [state, actions];
};
