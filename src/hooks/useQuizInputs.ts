"use client";
import React, { useCallback, useEffect } from "react";

interface QuizInputState {
  query: string;
  selected: string;
  numeric: string;
  choiceIndex: number | null;
}

const INPUT_V = 1;
const inKey = (locale?: string) =>
  `gg:ult:inputs:v${INPUT_V}${locale ? ":" + locale : ""}`;

function safeRead(locale?: string): QuizInputState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(inKey(locale));
    return raw ? (JSON.parse(raw) as QuizInputState) : null;
  } catch {
    return null;
  }
}

export function useQuizInputs(locale?: string) {
  const initial = safeRead(locale) ?? {
    query: "",
    selected: "",
    numeric: "",
    choiceIndex: null,
  };
  const [state, setState] = React.useState<QuizInputState>(initial);

  const updateField = useCallback(
    <K extends keyof QuizInputState>(field: K, value: QuizInputState[K]) => {
      setState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(inKey(locale), JSON.stringify(state));
      } catch {
        /* ignore */
      }
    }, 80);
    return () => clearTimeout(id);
  }, [state, locale]);

  const reset = useCallback(() => {
    setState({
      query: "",
      selected: "",
      numeric: "",
      choiceIndex: null,
    });
    try {
      if (typeof window !== "undefined") localStorage.removeItem(inKey(locale));
    } catch {
      /* ignore */
    }
  }, [locale]);

  return { state, updateField, reset };
}
