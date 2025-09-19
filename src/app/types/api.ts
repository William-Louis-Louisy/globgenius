import { GeoShape } from "./geojson";

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
