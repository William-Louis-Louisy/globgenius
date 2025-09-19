import { NextResponse } from "next/server";
import countries from "@/data/countries.json";
import type { Country } from "@/app/types/country";

// liste de locales prises en charge côté UI (tu peux compléter)
const SUPPORTED = new Set(["en","fr","es","pt","zh","ja","ko","ru"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") ?? "en";
  const loc = SUPPORTED.has(locale) ? locale : "en";

  const map = countries as Record<string, Country>;
  const all = Object.values(map);

  // On renvoie { iso3, name } pour l’autocomplétion
  const suggestions = all.map((c) => ({
    iso3: c.iso3,
    name: (c.translations?.[loc as keyof typeof c.translations] as string) ?? c.name.common,
  }));

  // Optionnel : dédupliquer (au cas où)
  const seen = new Set<string>();
  const unique = suggestions.filter((s) => {
    const key = `${s.name}|${s.iso3}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return NextResponse.json(unique);
}
