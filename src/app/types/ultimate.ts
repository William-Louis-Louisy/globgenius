import { GeoShape } from "./geojson";

export type UltimateStepKind =
  | "shape"
  | "area"
  | "flag"
  | "capital"
  | "population"
  | "coat";

export type ChoiceOption = {
  iso3: string;
  svg: string;
};

export type StepShape = {
  kind: "shape";
  shapeSvg: GeoShape;
};

export type StepArea = {
  kind: "area";
  area: number;
  tolerancePct: number;
};

export type StepFlag = {
  kind: "flag";
  options: ChoiceOption[];
  correctIndex: number;
};

export type StepCapital = {
  kind: "capital";
  capitalEN: string;
  capitalLocalized: string;
};

export type StepPopulation = {
  kind: "population";
  population: number;
  tolerancePct: number;
};

export type StepCoat = {
  kind: "coat";
  options: ChoiceOption[];
  correctIndex: number;
};

export type UltimateStep =
  | StepShape
  | StepArea
  | StepFlag
  | StepCapital
  | StepPopulation
  | StepCoat;

export type UltimateRound = {
  answerIso3: string;
  answerEN: string;
  answerLocalized: string;
  steps: UltimateStep[];
};
