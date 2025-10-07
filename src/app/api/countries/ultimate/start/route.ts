import { GeoShape } from "@/app/types/geojson";
import type {
  ChoiceOption,
  UltimateRound,
  UltimateStep,
} from "@/app/types/ultimate";
import countriesJson from "@/data/countries.json";
import { NextRequest, NextResponse } from "next/server";

type CountryRaw = {
  iso3: string;
  name: { common: string; official?: string };
  translations?: Record<
    string,
    string | { common?: string; official?: string } | null
  > | null;
  capital?: string | string[] | null;
  region?: string | null;
  area?: unknown;
  population?: unknown;
  flag?: { svg?: string | null } | null;
  coatOfArms?: { svg?: string | null } | null;
  shapeSvg?: { paths?: unknown; viewBox?: unknown } | null;
};

const MAP = countriesJson as unknown as Record<string, CountryRaw>;
const ALL: CountryRaw[] = Object.values(MAP);

/* ---------------- i18n helpers ---------------- */
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

function pickTranslationValue(v: unknown): string | undefined {
  if (!v) return undefined;
  if (typeof v === "string") return v.trim() || undefined;
  if (typeof v === "object") {
    const { common, official } = v as { common?: unknown; official?: unknown };
    if (typeof common === "string" && common.trim()) return common.trim();
    if (typeof official === "string" && official.trim()) return official.trim();
  }
  return undefined;
}

function localizedName(c: CountryRaw, uiLocale: string): string {
  const rcKey = LOCALE_TO_REST[uiLocale];
  if (rcKey && rcKey !== "en" && c.translations) {
    const raw = c.translations[rcKey];
    const val = pickTranslationValue(raw);
    if (val) return val;
  }
  return c.name.common;
}

/* ---------------- Data helpers ---------------- */
function toCapital(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v)) {
    const first = v.find((x) => typeof x === "string" && x.trim().length > 0);
    return (first ?? "").trim();
  }
  return "";
}

function numberOrNull(v: unknown): number | null {
  return typeof v === "number" && isFinite(v) ? v : null;
}

function hasShapeSvg(c: CountryRaw) {
  const s = c.shapeSvg as GeoShape | null;
  return (
    !!s &&
    Array.isArray(s.paths) &&
    s.paths.length > 0 &&
    typeof s.viewBox === "string"
  );
}

function hasFlag(c: CountryRaw) {
  return !!c.flag?.svg;
}

function hasCoat(c: CountryRaw) {
  return !!c.coatOfArms?.svg;
}

function hasCapital(c: CountryRaw) {
  const cap = toCapital(c.capital);
  return cap.length > 0 && !["n/a", "na", "-"].includes(cap.toLowerCase());
}

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

function buildQCM(
  pool: CountryRaw[],
  correct: CountryRaw,
  kind: "flag" | "coat"
): { options: ChoiceOption[]; correctIndex: number } {
  const eligible = pool.filter(
    (c) =>
      (kind === "flag" ? hasFlag(c) : hasCoat(c)) && c.iso3 !== correct.iso3
  );
  const distractors = shuffle(eligible).slice(0, 7);

  const correctSvg =
    kind === "flag" ? correct.flag!.svg! : correct.coatOfArms!.svg!;
  const options: ChoiceOption[] = [
    { iso3: correct.iso3, svg: correctSvg },
    ...distractors.map((c) => ({
      iso3: c.iso3,
      svg:
        kind === "flag"
          ? (c.flag!.svg as string)
          : (c.coatOfArms!.svg as string),
    })),
  ];

  const order = shuffle(options);
  const correctIndex = order.findIndex((o) => o.iso3 === correct.iso3);
  return { options: order, correctIndex };
}

/* ---------------- Route ---------------- */
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
  steps.push({ kind: "shape", shapeSvg: answer.shapeSvg as GeoShape });

  // 2) Area
  const area = numberOrNull(answer.area);
  if (area && area > 0) {
    const tolPct = randInt(10, 20) / 100;
    steps.push({ kind: "area", area: Math.round(area), tolerancePct: tolPct });
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
    const capEN = toCapital(answer.capital);
    steps.push({
      kind: "capital",
      capitalEN: capEN,
      capitalLocalized: localizedName(answer, uiLocale), // (nom du pays localisé — conforme à ton implémentation)
    });
  }

  // 5) Population
  const population = numberOrNull(answer.population);
  if (population && population > 0) {
    const tolPct = randInt(10, 20) / 100;
    steps.push({
      kind: "population",
      population: Math.round(population),
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

  const round: UltimateRound = {
    answerIso3: answer.iso3,
    answerEN: answer.name.common,
    answerLocalized: localizedName(answer, uiLocale),
    steps,
  };

  return NextResponse.json(round);
}
