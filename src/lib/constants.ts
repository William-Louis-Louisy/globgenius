import { AttemptsConfig } from "@/app/types/game";

export const LOCALE_MAPPING: Record<string, string> = {
  en: "eng",
  fr: "fra",
  es: "spa",
  pt: "por",
  de: "deu",
  it: "ita",
  nl: "nld",
  ru: "rus",
  zh: "zho",
  ja: "jpn",
  ko: "kor",
  ar: "ara",
  tr: "tur",
  pl: "pol",
  cs: "ces",
  hr: "hrv",
  hu: "hun",
  et: "est",
  fi: "fin",
  sv: "swe",
  sk: "slk",
  sr: "srp",
  fa: "per",
  ur: "urd",
  id: "ind",
  cy: "cym",
  br: "bre",
};

export const SUPPORTED = new Set(Object.keys(LOCALE_MAPPING));

export function normalizeBaseLocale(input: string | null | undefined): string {
  const raw = (input ?? "en").toLowerCase();
  const base = raw.split("-")[0];
  return SUPPORTED.has(base) ? base : "en";
}

export function translationKeyOf(baseLocale: string): string {
  return LOCALE_MAPPING[baseLocale] ?? "eng";
}

export const DEFAULT_ATTEMPTS: AttemptsConfig = {
  shape: 5,
  area: 1,
  flag: 1,
  capital: 1,
  population: 1,
  coat: 1,
};

export const TITLE_MAP = {
  shape: "titleShape",
  area: "titleArea",
  flag: "titleFlag",
  capital: "titleCapital",
  population: "titlePopulation",
  coat: "titleCoat",
} as const;
