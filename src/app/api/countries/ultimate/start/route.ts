import type {
  ChoiceOption,
  UltimateStep,
  UltimateRound,
} from "@/app/types/ultimate";
import countries from "@/data/countries.json";
import type { Country } from "@/app/types/country";
import { NextRequest, NextResponse } from "next/server";

const LOCALE_TO_REST: Record<string, string> = {
  en: "en",
  fr: "fra",
  es: "spa",
  pt: "por",
  zh: "zho",
  ja: "jpn",
  ko: "kor",
  ru: "rus",
};

function normalizeLocale(loc: string): string {
  const base = loc.toLowerCase().split("-")[0];
  return LOCALE_TO_REST[base] ? base : "en";
}

function pickTranslationValue(val: unknown): string | undefined {
  if (!val) return undefined;
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null) {
    const anyVal = val as { common?: string; official?: string };
    return anyVal.common ?? anyVal.official ?? undefined;
  }
  return undefined;
}

function localizedName(c: Country, uiLocale: string): string {
  const rcKey = LOCALE_TO_REST[uiLocale];
  if (rcKey && rcKey !== "en") {
    const raw = c.translations?.[rcKey];
    const val = pickTranslationValue(raw);
    if (val?.trim()) return val;
  }
  return c.name.common;
}

const MAP = countries as Record<string, Country>;
const ALL: Country[] = Object.values(MAP);

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function hasShapeSvg(c: Country) {
  return !!c.shapeSvg?.paths?.length && typeof c.shapeSvg.viewBox === "string";
}
function hasFlag(c: Country) {
  return !!c.flag?.svg;
}
function hasCoat(c: Country) {
  return !!c.coatOfArms?.svg;
}
function hasCapital(c: Country) {
  const cap = (c.capital ?? "").trim();
  return cap.length > 0 && !["n/a", "na", "-"].includes(cap.toLowerCase());
}

function buildQCM(
  pool: Country[],
  correct: Country,
  kind: "flag" | "coat"
): { options: ChoiceOption[]; correctIndex: number } {
  const eligible = pool.filter(
    (c) =>
      (kind === "flag" ? hasFlag(c) : hasCoat(c)) && c.iso3 !== correct.iso3
  );
  const distractors = shuffle(eligible).slice(0, 7);
  const options: ChoiceOption[] = [
    ...(kind === "flag"
      ? [{ iso3: correct.iso3, svg: correct.flag.svg }]
      : [{ iso3: correct.iso3, svg: correct.coatOfArms!.svg as string }]),
    ...distractors.map((c) => ({
      iso3: c.iso3,
      svg: kind === "flag" ? c.flag.svg : (c.coatOfArms!.svg as string),
    })),
  ];
  const order = shuffle(options);
  const correctIndex = order.findIndex((o) => o.iso3 === correct.iso3);
  return { options: order, correctIndex };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uiLocale = normalizeLocale(searchParams.get("locale") || "en");

  const withShape = ALL.filter(hasShapeSvg);
  if (withShape.length === 0) {
    return NextResponse.json(
      { error: "No countries with shapeSvg available." },
      { status: 503 }
    );
  }
  const answer = pickRandom(withShape);

  const steps: UltimateStep[] = [];

  // 1) Shape
  steps.push({
    kind: "shape",
    shapeSvg: answer.shapeSvg!,
  });

  // 2) Area
  if (
    typeof answer.area === "number" &&
    isFinite(answer.area) &&
    answer.area > 0
  ) {
    const tolPct = randInt(10, 20) / 100;
    steps.push({
      kind: "area",
      area: Math.round(answer.area),
      tolerancePct: tolPct,
    });
  }

  // 3) Flag
  if (hasFlag(answer)) {
    const { options, correctIndex } = buildQCM(ALL, answer, "flag");
    if (options.length === 8 && correctIndex >= 0) {
      steps.push({ kind: "flag", options, correctIndex });
    }
  }

  // 4) Capital
  if (hasCapital(answer)) {
    const capEN = answer.capital;
    const nameLoc = localizedName(answer, uiLocale);
    steps.push({
      kind: "capital",
      capitalEN: capEN,
      capitalLocalized: nameLoc,
    });
  }

  // 5) Population
  if (
    typeof answer.population === "number" &&
    isFinite(answer.population) &&
    answer.population > 0
  ) {
    const tolPct = randInt(10, 20) / 100;
    steps.push({
      kind: "population",
      population: Math.round(answer.population),
      tolerancePct: tolPct,
    });
  }

  // 6) Coat of arms
  if (hasCoat(answer)) {
    const { options, correctIndex } = buildQCM(ALL, answer, "coat");
    if (options.length === 8 && correctIndex >= 0) {
      steps.push({ kind: "coat", options, correctIndex });
    }
  }

  // Answer
  const round: UltimateRound = {
    answerIso3: answer.iso3,
    answerEN: answer.name.common,
    answerLocalized: localizedName(answer, uiLocale),
    steps,
  };

  return NextResponse.json(round);
}
