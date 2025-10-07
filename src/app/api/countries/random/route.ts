import { NextRequest, NextResponse } from "next/server";
import countriesJson from "@/data/countries.json";
import { normalizeBaseLocale, translationKeyOf } from "@/lib/constants";
import { GeoShape } from "@/app/types/geojson";

type CountryRandomRaw = {
  iso3: string;
  name: { common: string; official?: string };
  translations?: Record<string, string> | null;
  capital?: string | string[] | null;
  flag: { svg: string };
  shapeSvg?: { paths?: unknown; viewBox?: unknown } | null;
};

const MAP = countriesJson as unknown as Record<string, CountryRandomRaw>;
const ALL: CountryRandomRaw[] = Object.values(MAP);

/* ---------------- Helpers ---------------- */
function toCapital(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v)) {
    const first = v.find((x) => typeof x === "string" && x.trim().length > 0);
    return (first ?? "").trim();
  }
  return "";
}

function hasUsableCapital(c: CountryRandomRaw): boolean {
  const cap = toCapital(c.capital);
  if (!cap) return false;
  const invalid = ["n/a", "na", "none", "-"];
  return !invalid.includes(cap.toLowerCase());
}

function hasShapeSvg(c: CountryRandomRaw): boolean {
  const s = c.shapeSvg as GeoShape | null;
  return (
    !!s &&
    Array.isArray(s.paths) &&
    s.paths.length > 0 &&
    typeof s.viewBox === "string"
  );
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function localizedName(
  c: CountryRandomRaw,
  requestedLocale: string | null
): string {
  const base = normalizeBaseLocale(requestedLocale);
  const tr = c.translations ?? undefined;
  if (tr) {
    const key3 = translationKeyOf(base); // ex: "fr" -> "fra"
    const v3 = key3 && typeof tr[key3] === "string" ? tr[key3].trim() : "";
    if (v3) return v3;
    const v2 = typeof tr[base] === "string" ? tr[base].trim() : "";
    if (v2) return v2;
  }
  return c.name.common;
}

/* ---------------- Route ---------------- */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode =
    (searchParams.get("mode") as "flag" | "capital" | "shape") || "flag";
  const locale = searchParams.get("locale");

  let answer: CountryRandomRaw;

  if (mode === "shape") {
    const pool = ALL.filter(hasShapeSvg);
    if (pool.length === 0) {
      return NextResponse.json(
        { error: "No countries with shape available." },
        { status: 503 }
      );
    }
    answer = pickRandom(pool);
  } else if (mode === "capital") {
    const pool = ALL.filter(hasUsableCapital);
    if (pool.length === 0) {
      return NextResponse.json(
        { error: "No countries with a usable capital were found." },
        { status: 503 }
      );
    }
    answer = pickRandom(pool);
  } else {
    // mode === "flag"
    answer = pickRandom(ALL);
  }

  let question:
    | { type: "flag"; data: string }
    | { type: "capital"; data: string }
    | { type: "shape"; data: CountryRandomRaw["shapeSvg"] };

  switch (mode) {
    case "capital":
      question = { type: "capital", data: toCapital(answer.capital) };
      break;
    case "shape":
      if (!hasShapeSvg(answer)) {
        return NextResponse.json(
          { error: "Shape not available" },
          { status: 404 }
        );
      }
      question = { type: "shape", data: answer.shapeSvg ?? null };
      break;
    case "flag":
    default:
      question = { type: "flag", data: answer.flag.svg };
      break;
  }

  return NextResponse.json({
    question,
    options: [],
    answer: answer.name.common,
    localizedAnswer: localizedName(answer, locale),
  });
}
