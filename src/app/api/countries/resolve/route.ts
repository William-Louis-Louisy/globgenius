import { NextRequest, NextResponse } from "next/server";
import countriesJson from "@/data/countries.json";
import { normalizeBaseLocale, translationKeyOf } from "@/lib/constants";
import type { CountryLite } from "@/app/types/country";

type CountryRaw = {
  iso3: string;
  name: { common: string; official?: string };
  translations?: Record<
    string,
    string | { common?: string; official?: string } | null
  > | null;
  capital?: string | string[] | null;
  region?: string | null;
  latlng?: unknown;
};

const MAP = countriesJson as unknown as Record<string, CountryRaw>;
const ALL: CountryRaw[] = Object.values(MAP);

/* ---------------- Helpers ---------------- */
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

function getTranslatedName(c: CountryRaw, baseLocale: string): string {
  const tr = c.translations ?? undefined;
  if (tr) {
    const key3 = translationKeyOf(baseLocale);
    if (key3 && key3 in tr) {
      const v3 = pickTranslationValue(tr[key3]);
      if (v3) return v3;
    }
    if (baseLocale in tr) {
      const v2 = pickTranslationValue(tr[baseLocale]);
      if (v2) return v2;
    }
  }
  return c.name.common;
}

function toCapital(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v)) {
    const first = v.find((x) => typeof x === "string" && x.trim().length > 0);
    return (first ?? "").trim();
  }
  return "";
}

function toLite(c: CountryRaw, baseLocale: string): CountryLite {
  return {
    iso3: c.iso3,
    nameEN: c.name.common,
    nameLocalized: getTranslatedName(c, baseLocale),
    capital: toCapital(c.capital) || null,
    region: (c.region && String(c.region)) || null,
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
    const tr = c.translations ?? undefined;
    if (!tr) continue;
    for (const v of Object.values(tr)) {
      const val = pickTranslationValue(v);
      if (val && normalize(val) === q) {
        hits.push(c.iso3);
        break;
      }
    }
  }
  if (hits.length === 1) return hits[0];
  if (hits.length > 1) return "AMBIGUOUS";
  return undefined;
}

/* ---------------- Route ---------------- */
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
