export const LOCALE_MAPPING: Record<string, string> = {
  en: "eng", // Anglais
  fr: "fra", // Français
  es: "spa", // Espagnol
  pt: "por", // Portugais
  de: "deu", // Allemand
  it: "ita", // Italien
  nl: "nld", // Néerlandais
  ru: "rus", // Russe
  zh: "zho", // Chinois
  ja: "jpn", // Japonais
  ko: "kor", // Coréen
  ar: "ara", // Arabe
  tr: "tur", // Turc
  pl: "pol", // Polonais
  cs: "ces", // Tchèque
  hr: "hrv", // Croate
  hu: "hun", // Hongrois
  et: "est", // Estonien
  fi: "fin", // Finnois
  sv: "swe", // Suédois
  sk: "slk", // Slovaque
  sr: "srp", // Serbe
  fa: "per", // Persan
  ur: "urd", // Urdu
  id: "ind", // Indonésien
  cy: "cym", // Gallois
  br: "bre", // Breton
};

export const SUPPORTED = new Set(Object.keys(LOCALE_MAPPING));

/** Normalise "fr-FR" -> "fr", valide, renvoie "en" sinon. */
export function normalizeBaseLocale(input: string | null | undefined): string {
  const raw = (input ?? "en").toLowerCase();
  const base = raw.split("-")[0];
  return SUPPORTED.has(base) ? base : "en";
}

/** Retourne la clé de traduction “trois lettres” ("fra", "deu", etc.) */
export function translationKeyOf(baseLocale: string): string {
  return LOCALE_MAPPING[baseLocale] ?? "eng";
}
