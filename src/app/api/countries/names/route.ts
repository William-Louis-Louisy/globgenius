import { NextResponse } from "next/server";
import countries from "@/data/countries.json";
import { normalizeBaseLocale, translationKeyOf } from "@/lib/constants";

type CountryForNames = {
  iso3: string;
  name: { common: string; official?: string };
  translations?: Record<string, string> | null;
};

type NameSuggestion = { iso3: string; name: string };

function getTranslatedName(c: CountryForNames, baseLocale: string): string {
  const tr = c.translations ?? undefined;
  if (tr) {
    const key3 = translationKeyOf(baseLocale);
    const v3 = key3 && typeof tr[key3] === "string" ? tr[key3].trim() : "";
    if (v3) return v3;

    const v2 = typeof tr[baseLocale] === "string" ? tr[baseLocale].trim() : "";
    if (v2) return v2;
  }
  return c.name.common;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const base = normalizeBaseLocale(searchParams.get("locale"));

  const MAP = countries as unknown as Record<string, CountryForNames>;
  const ALL: CountryForNames[] = Object.values(MAP);

  const suggestions: NameSuggestion[] = ALL.map((c) => ({
    iso3: c.iso3,
    name: getTranslatedName(c, base),
  }));

  const seen = new Set<string>();
  const unique = suggestions.filter((s) => {
    const k = `${s.iso3}|${s.name}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  unique.sort((a, b) => a.name.localeCompare(b.name, base));

  return NextResponse.json(unique);
}
