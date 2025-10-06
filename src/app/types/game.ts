export type Feedback = "idle" | "correct" | "wrong";

export type Guess = {
  label: string;
  iso3?: string;
  distanceKm?: number;
  isCorrect: boolean;
};

export type Options = {
  locale: string;
  attempts?: number;
};

export type AttemptsConfig = {
  shape: number;
  area: number;
  flag: number;
  capital: number;
  population: number;
  coat: number;
};

export type StepAnswer =
  | { kind: "shape" | "capital" | "area" | "population"; label: string }
  | { kind: "flag" | "coat"; label: string; svg?: string };

export type ToastLabels = {
  correct: string;
  wrong: string;
  pickSuggestion: string;
};
