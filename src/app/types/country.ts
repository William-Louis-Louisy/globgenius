import { GeoShape } from "./geojson";

export interface Country {
  iso2: string;
  iso3: string;
  name: { common: string; official: string };
  translations: Record<string, string>;
  capital: string;
  region: string;
  latlng: [number, number];
  area: number;
  population: number;
  borders: string[];
  flag: { svg: string; png: string };
  coatOfArms: { svg?: string | null; png?: string | null };
  shape: GeoShape | null;
  difficulty: number;
}

export type CountryLite = {
  iso3: string;
  nameEN: string;
  nameLocalized: string;
  capital: string | null;
  region: string | null;
  latlng: [number, number] | null;
};

export type NameSuggestion = { iso3: string; name: string };
