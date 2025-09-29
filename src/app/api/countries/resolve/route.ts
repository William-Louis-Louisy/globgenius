// /app/api/country/route.ts
import { NextRequest, NextResponse } from "next/server";
import countries from "@/data/countries.json";
import type { Country, CountryLite } from "@/app/types/country";
import { normalizeBaseLocale, translationKeyOf } from "@/lib/constants";

const MAP = countries as Record<string, Country>;
const ALL: Country[] = Object.values(MAP);

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function safeLatLng(input: unknown): [number, number] | null {
  if (
    Array.isArray(input) &&
    input.length === 2 &&
    Number.isFinite(input[0]) &&
    Number.isFinite(input[1])
  ) {
    return [Number(input[0]), Number(input[1])];
  }
  return null;
}

function getTranslatedName(c: Country, baseLocale: string): string {
  const tr: Record<string, unknown> | undefined = c.translations;
  if (tr) {
    const key3 = translationKeyOf(baseLocale);
    const v1 = tr[key3];
    if (typeof v1 === "string" && v1.trim()) return v1;
    const v2 = tr[baseLocale];
    if (typeof v2 === "string" && v2.trim()) return v2;
  }
  return c.name.common;
}

function toLite(c: Country, baseLocale: string): CountryLite {
  return {
    iso3: c.iso3,
    nameEN: c.name.common,
    nameLocalized: getTranslatedName(c, baseLocale),
    capital: c.capital || null,
    region: c.region || null,
    latlng: safeLatLng(c.latlng),
  };
}

function resolveIso3ByName(
  nameRaw: string,
  baseLocale: string
): string | "AMBIGUOUS" | undefined {
  const q = normalize(nameRaw);

  const c1 = ALL.filter((c) => normalize(c.name.common) === q);
  if (c1.length === 1) return c1[0].iso3;
  if (c1.length > 1) return "AMBIGUOUS";

  const c2 = ALL.filter(
    (c) => normalize(getTranslatedName(c, baseLocale)) === q
  );
  if (c2.length === 1) return c2[0].iso3;
  if (c2.length > 1) return "AMBIGUOUS";

  const c3 = ALL.filter(
    (c) => c.name?.official && normalize(c.name.official) === q
  );
  if (c3.length === 1) return c3[0].iso3;
  if (c3.length > 1) return "AMBIGUOUS";

  const hits: string[] = [];
  for (const c of ALL) {
    const tr = c.translations as Record<string, unknown> | undefined;
    if (!tr) continue;
    for (const v of Object.values(tr)) {
      if (typeof v === "string" && normalize(v) === q) {
        hits.push(c.iso3);
        break;
      }
    }
  }
  if (hits.length === 1) return hits[0];
  if (hits.length > 1) return "AMBIGUOUS";

  return undefined;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const baseLocale = normalizeBaseLocale(searchParams.get("locale"));
  const iso3Param = (searchParams.get("iso3") || "").toUpperCase();
  const nameParam = searchParams.get("name") || "";

  if (!iso3Param && !nameParam) {
    return NextResponse.json(
      { error: "Missing iso3 or name" },
      { status: 400 }
    );
  }

  if (iso3Param) {
    const c = MAP[iso3Param];
    if (!c) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }
    return NextResponse.json(toLite(c, baseLocale));
  }

  const resolved = resolveIso3ByName(nameParam, baseLocale);

  if (resolved === "AMBIGUOUS") {
    const q = normalize(nameParam);
    const candidates = ALL.filter((c) => {
      const n = [
        c.name.common,
        c.name.official,
        getTranslatedName(c, baseLocale),
      ].filter(Boolean) as string[];
      return n.some((x) => normalize(x) === q);
    }).map((c) => c.iso3);

    return NextResponse.json(
      { error: "Ambiguous name, please use iso3", candidates },
      { status: 409 }
    );
  }

  if (!resolved) {
    return NextResponse.json({ error: "Country not found" }, { status: 404 });
  }

  const c = MAP[resolved];
  if (!c) {
    return NextResponse.json({ error: "Country not found" }, { status: 404 });
  }

  return NextResponse.json(toLite(c, baseLocale));
}
