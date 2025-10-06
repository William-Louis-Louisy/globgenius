import { Feedback, Guess, StepAnswer } from "./game";
import { GeoShape } from "./geojson";
import { UltimateRound, UltimateStep } from "./ultimate";
import { Suggestion } from "@/components/quiz/AnswerAutocomplete";

type FlagQuestion = {
  type: "flag";
  data: string;
};

type CapitalQuestion = {
  type: "capital";
  data: string;
};

type ShapeQuestion = {
  type: "shape";
  data: GeoShape;
};

export type Question = FlagQuestion | CapitalQuestion | ShapeQuestion;

export interface RandomCountryResponse {
  question: Question;
  options: string[];
  answer: string;
  localizedAnswer: string;
}

export type UseUltimateQuizAPI = {
  loading: boolean;
  finished: boolean;
  round: UltimateRound | null;
  stepIndex: number;
  current: UltimateStep | null;
  answersForScore: StepAnswer[];

  // feedback + tentatives
  feedback: Feedback;
  attemptsLeft: number;
  reveal: string | null;
  score: number;
  guesses: Guess[];

  // autocomplétions
  countrySuggestions: Suggestion[];
  capitalSuggestions: Suggestion[];
  filteredCountries(q: string): Suggestion[];
  filteredCapitals(q: string): Suggestion[];

  // validations
  submitCountry(candidate: string): void;
  submitArea(value: number): void;
  submitFlag(index: number): void;
  submitCapital(candidate: string): void;
  submitPopulation(value: number): void;
  submitCoat(index: number): void;

  next: () => void;
  restart: () => void;
};
