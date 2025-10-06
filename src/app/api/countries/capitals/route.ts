import { NextResponse } from "next/server";
import countries from "@/data/countries.json";
import type { Country } from "@/app/types/country";

export async function GET() {
  const all = Object.values(countries as Record<string, Country>);
  const out = all
    .filter((c) => typeof c.capital === "string" && c.capital.trim().length > 0)
    .map((c) => ({ iso3: c.iso3, capital: c.capital.trim() }));

  const seen = new Set<string>();
  const unique = out.filter((x) => {
    const key = `${x.capital}|${x.iso3}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  unique.sort((a, b) => a.capital.localeCompare(b.capital, "en"));

  return NextResponse.json(unique);
}
