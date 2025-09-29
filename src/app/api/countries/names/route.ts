import { NextResponse } from "next/server";
import countries from "@/data/countries.json";
import type { Country } from "@/app/types/country";
import { normalizeBaseLocale, translationKeyOf } from "@/lib/constants";

type NameSuggestion = { iso3: string; name: string };

// Ton JSON ressemble à Record<iso3, Country>
const MAP = countries as Record<string, Country>;
const ALL: Country[] = Object.values(MAP);

/** Retourne le nom localisé avec l’ordre de priorité: 3 lettres -> 2 lettres -> common */
function getTranslatedName(c: Country, baseLocale: string): string {
  const tr: Record<string, string> | undefined = c.translations;
  if (!tr) return c.name.common;

  const key3 = translationKeyOf(baseLocale); // ex: "fra"
  if (key3 && typeof tr[key3] === "string" && tr[key3].trim().length > 0) {
    return tr[key3];
  }
  if (typeof tr[baseLocale] === "string" && tr[baseLocale].trim().length > 0) {
    return tr[baseLocale];
  }
  return c.name.common;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const base = normalizeBaseLocale(searchParams.get("locale"));

  // construit la liste localisée
  const suggestions: NameSuggestion[] = ALL.map((c) => ({
    iso3: c.iso3,
    name: getTranslatedName(c, base),
  }));

  // dé-duplication (au cas où)
  const seen = new Set<string>();
  const unique = suggestions.filter((s) => {
    const k = `${s.iso3}|${s.name}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return NextResponse.json(unique);
}
