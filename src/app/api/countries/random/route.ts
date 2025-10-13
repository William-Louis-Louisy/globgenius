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
  independent?: boolean | null;
};

const MAP = countriesJson as unknown as Record<string, CountryRandomRaw>;
const ALL: CountryRandomRaw[] = Object.values(MAP);

/* ---------------- Helpers ---------------- */
function pickRandom<T>(arr: T[]): T {
  return arr[(Math.random() * arr.length) | 0];
}

function toCapital(c: CountryRandomRaw): string | null {
  if (!c.capital) return null;
  if (typeof c.capital === "string") return c.capital.trim() || null;
  if (Array.isArray(c.capital)) {
    const v = (
      c.capital.find((x) => typeof x === "string" && x.trim()) || ""
    ).trim();
    return v || null;
  }
  return null;
}

function hasUsableCapital(c: CountryRandomRaw): boolean {
  return !!toCapital(c);
}

function hasShapeSvg(c: CountryRandomRaw): boolean {
  const s = c.shapeSvg as
    | { paths?: unknown; viewBox?: unknown }
    | null
    | undefined;
  return !!(s && s.paths && s.viewBox);
}

function hasFlagSvg(c: CountryRandomRaw): boolean {
  return typeof c.flag?.svg === "string" && c.flag.svg.length > 0;
}

function localizedName(c: CountryRandomRaw, locale: string | null): string {
  if (!locale) return c.name.common;
  const base = normalizeBaseLocale(locale);
  const key = translationKeyOf(locale);
  const tr = c.translations as Record<string, unknown> | null | undefined;
  if (tr) {
    const v1 = typeof tr[key] === "string" ? (tr[key] as string).trim() : "";
    if (v1) return v1;
    const v2 =
      typeof tr[locale] === "string" ? (tr[locale] as string).trim() : "";
    if (v2) return v2;
    const v3 = typeof tr[base] === "string" ? (tr[base] as string).trim() : "";
    if (v3) return v3;
  }
  return c.name.common;
}

/* ---------------- Precalculated Pools ---------------- */
const FLAG_POOL = ALL.filter(hasFlagSvg).filter((c) => c.independent !== false);
const CAPITAL_POOL = ALL.filter(hasUsableCapital);
const SHAPE_POOL = ALL.filter(hasShapeSvg);

/* ---------------- Route ---------------- */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode =
    (searchParams.get("mode") as "flag" | "capital" | "shape") || "flag";
  const locale = searchParams.get("locale");

  let answer: CountryRandomRaw;

  if (mode === "shape") {
    if (SHAPE_POOL.length === 0) {
      return NextResponse.json(
        { error: "No countries with shape available." },
        { status: 503 }
      );
    }
    answer = pickRandom(SHAPE_POOL);
  } else if (mode === "capital") {
    if (CAPITAL_POOL.length === 0) {
      return NextResponse.json(
        { error: "No countries with a usable capital were found." },
        { status: 503 }
      );
    }
    answer = pickRandom(CAPITAL_POOL);
  } else {
    if (FLAG_POOL.length === 0) {
      return NextResponse.json(
        { error: "No countries with a flag were found." },
        { status: 503 }
      );
    }
    answer = pickRandom(FLAG_POOL);
  }

  let question:
    | { type: "flag"; data: string }
    | { type: "capital"; data: string }
    | { type: "shape"; data: GeoShape };

  switch (mode) {
    case "capital":
      question = { type: "capital", data: toCapital(answer)! };
      break;
    case "shape":
      question = { type: "shape", data: answer.shapeSvg as GeoShape };
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
