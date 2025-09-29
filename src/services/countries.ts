import type { RandomCountryResponse } from "@/app/types/api";
import type { CountryLite, NameSuggestion } from "@/app/types/country";
import { GeoShape } from "@/app/types/geojson";

export type FlagRandomResponse = Omit<RandomCountryResponse, "question"> & {
  question: { type: "flag"; data: string };
};

export type CapitalRandomResponse = Omit<RandomCountryResponse, "question"> & {
  question: { type: "capital"; data: string };
};

export type ShapeRandomResponse = Omit<RandomCountryResponse, "question"> & {
  question: { type: "shape"; data: GeoShape };
};

type ResolveArgs = { locale: string; iso3?: string; name?: string };

const namesCache = new Map<string, NameSuggestion[]>();
const resolveCache = new Map<string, CountryLite>();

// Fetcher
async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return (await res.json()) as T;
}
// Get all country names
export async function getCountryNames(
  locale: string
): Promise<NameSuggestion[]> {
  // Normalise "fr-FR" -> "fr" (sans toucher au reste)
  const base = (locale ?? "en").toLowerCase().split("-")[0];
  const cacheKey = base;

  if (namesCache.has(cacheKey)) return namesCache.get(cacheKey)!;

  const data = await fetchJson<NameSuggestion[]>(
    `/api/countries/names?locale=${encodeURIComponent(base)}`,
    { cache: "force-cache" }
  );

  namesCache.set(cacheKey, data);
  return data;
}

// Get a random flag question
export async function getRandomFlagQuestion(
  locale: string
): Promise<FlagRandomResponse> {
  const data = await fetchJson<RandomCountryResponse>(
    `/api/countries/random?mode=flag&locale=${encodeURIComponent(locale)}`,
    { cache: "no-store" }
  );
  if (data.question?.type !== "flag") {
    throw new Error("Invalid question type for flag quiz.");
  }
  return data as FlagRandomResponse;
}

// Resolve a country
export async function resolveCountry(
  args: ResolveArgs
): Promise<CountryLite | null> {
  const p = new URLSearchParams();
  p.set("locale", args.locale.toLowerCase());
  if (args.iso3) p.set("iso3", args.iso3.toUpperCase());
  if (args.name) p.set("name", args.name);

  const key = p.toString();
  if (resolveCache.has(key)) return resolveCache.get(key)!;

  try {
    const data = await fetchJson<CountryLite>(`/api/countries/resolve?${key}`, {
      cache: "no-store",
    });
    resolveCache.set(key, data);
    return data;
  } catch {
    return null;
  }
}
// Get a random capital question
export async function getRandomCapitalQuestion(
  locale: string
): Promise<CapitalRandomResponse> {
  const data = await fetchJson<RandomCountryResponse>(
    `/api/countries/random?mode=capital&locale=${encodeURIComponent(locale)}`,
    { cache: "no-store" }
  );
  if (data.question?.type !== "capital") {
    throw new Error("Invalid question type for capital quiz.");
  }
  return data as CapitalRandomResponse;
}

export async function getRandomShapeQuestion(
  locale: string
): Promise<ShapeRandomResponse> {
  const data = await fetchJson<RandomCountryResponse>(
    `/api/countries/random?mode=shape&locale=${encodeURIComponent(locale)}`,
    { cache: "no-store" }
  );
  if (data.question?.type !== "shape") {
    throw new Error("Invalid question type for shape quiz.");
  }
  return data as ShapeRandomResponse;
}
