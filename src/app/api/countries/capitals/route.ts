import { NextResponse } from "next/server";
import countriesJson from "@/data/countries.json";

type CountriesMin = Record<
  string,
  {
    iso3: string;
    capital?: string | string[] | null;
  }
>;

function normalizeCapital(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v)) {
    const first = v.find((x) => typeof x === "string" && x.trim().length > 0);
    return (first ?? "").trim();
  }
  return "";
}

export async function GET() {
  const countries = countriesJson as unknown as CountriesMin;

  const out = Object.values(countries)
    .map((c) => ({ iso3: c.iso3, capital: normalizeCapital(c.capital) }))
    .filter((x) => x.capital.length > 0);

  // dédoublonnage capital|iso3
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
