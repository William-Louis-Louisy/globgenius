import { NextRequest, NextResponse } from "next/server";
import countries from "@/data/countries.json";
import type { Country, CountryLite } from "@/app/types/country";

const MAP = countries as Record<string, Country>;
const ALL = Object.values(MAP);

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toLite(c: Country, locale: string): CountryLite {
  const nameLoc =
    (c.translations?.[locale as keyof typeof c.translations] as string) ||
    c.name.common;

  return {
    iso3: c.iso3,
    nameEN: c.name.common,
    nameLocalized: nameLoc,
    capital: c.capital || null,
    region: c.region || null,
    latlng: Array.isArray(c.latlng) ? c.latlng : null,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = (searchParams.get("locale") || "en").toLowerCase();
  const iso3 = (searchParams.get("iso3") || "").toUpperCase();
  const name = searchParams.get("name") || "";

  if (!iso3 && !name) {
    return NextResponse.json(
      { error: "Missing iso3 or name" },
      { status: 400 }
    );
  }

  if (iso3) {
    const c = MAP[iso3];
    if (!c)
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    return NextResponse.json(toLite(c, locale));
  }

  const target = normalize(name);
  let found: Country | undefined;

  for (const c of ALL) {
    const pool = new Set<string>(
      [
        c.name.common,
        c.name.official,
        ...Object.values(c.translations || {}),
      ].map((n: string | undefined) => (typeof n === "string" ? n : ""))
    );

    for (const candidate of pool) {
      if (!candidate) continue;
      if (normalize(candidate) === target) {
        found = c;
        break;
      }
    }
    if (found) break;
  }

  if (!found) {
    for (const c of ALL) {
      if (normalize(c.name.common).includes(target)) {
        found = c;
        break;
      }
    }
  }

  if (!found)
    return NextResponse.json({ error: "Country not found" }, { status: 404 });
  return NextResponse.json(toLite(found, locale));
}
