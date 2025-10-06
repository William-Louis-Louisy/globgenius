"use client";

import { Suggestion } from "@/components/quiz/AnswerAutocomplete";
import { normalizeText } from "@/lib/geo";
import { useCallback, useRef } from "react";

interface SuggestionsCache {
  countries: Suggestion[];
  capitals: Suggestion[];
  filteredCountries: Map<string, Suggestion[]>;
  filteredCapitals: Map<string, Suggestion[]>;
}

const MAX_SUGGESTIONS = 50;
const CACHE_SIZE = 100;

export function useSuggestionsCache() {
  const cacheRef = useRef<SuggestionsCache>({
    countries: [],
    capitals: [],
    filteredCountries: new Map(),
    filteredCapitals: new Map(),
  });

  const cleanCache = useCallback((cache: Map<string, Suggestion[]>) => {
    if (cache.size > CACHE_SIZE) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }
  }, []);

  const setCacheSuggestions = useCallback(
    (countries: Suggestion[], capitals: Suggestion[]) => {
      cacheRef.current.countries = countries;
      cacheRef.current.capitals = capitals;
      cacheRef.current.filteredCountries.clear();
      cacheRef.current.filteredCapitals.clear();
    },
    []
  );

  const getFilteredSuggestions = useCallback(
    (query: string, type: "countries" | "capitals"): Suggestion[] => {
      const cache = cacheRef.current;
      const cacheMap =
        type === "countries" ? cache.filteredCountries : cache.filteredCapitals;
      const source = type === "countries" ? cache.countries : cache.capitals;

      if (cacheMap.has(query)) {
        return cacheMap.get(query)!;
      }

      const normalizedQuery = normalizeText(query);
      const result = normalizedQuery
        ? source
            .filter((s) => normalizeText(s.name).includes(normalizedQuery))
            .slice(0, MAX_SUGGESTIONS)
        : source.slice(0, MAX_SUGGESTIONS);

      cacheMap.set(query, result);
      cleanCache(cacheMap);

      return result;
    },
    [cleanCache]
  );

  const hasExactSuggestion = useCallback(
    (value: string, type: "countries" | "capitals"): boolean => {
      const src =
        type === "countries"
          ? cacheRef.current.countries
          : cacheRef.current.capitals;
      const norm = normalizeText(value);
      if (!norm) return false;
      return src.some((s) => normalizeText(s.name) === norm);
    },
    []
  );

  const getSuggestionByName = useCallback(
    (value: string, type: "countries" | "capitals"): Suggestion | null => {
      const src =
        type === "countries"
          ? cacheRef.current.countries
          : cacheRef.current.capitals;
      const norm = normalizeText(value);
      if (!norm) return null;
      return src.find((s) => normalizeText(s.name) === norm) ?? null;
    },
    []
  );

  return {
    setCacheSuggestions,
    getFilteredSuggestions,
    hasExactSuggestion,
    getSuggestionByName,
  };
}
