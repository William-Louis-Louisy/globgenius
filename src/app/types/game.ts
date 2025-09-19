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
