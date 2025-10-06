import type { Feedback, Guess } from "@/app/types/game";
import type { UltimateRound } from "@/app/types/ultimate";

export const ULT_PERSIST_V = 1;
const key = (loc: string) => `gg:ult:v${ULT_PERSIST_V}:${loc}`;

type UltSnap = {
  v: number;
  locale: string;
  round: UltimateRound;
  stepIndex: number;
  feedback: Feedback;
  attemptsLeft: number;
  reveal: string | null;
  score: number;
  guesses: Guess[];
  finished: boolean;
};

const hasLS = () => typeof window !== "undefined" && !!window.localStorage;

export function readUltSnap(locale: string): UltSnap | null {
  if (!hasLS()) return null;
  try {
    const raw = localStorage.getItem(key(locale));
    if (!raw) return null;
    const snap = JSON.parse(raw) as UltSnap;
    if (snap.v !== ULT_PERSIST_V || snap.locale !== locale) return null;
    if (!snap.round?.steps?.length) return null;
    return snap;
  } catch {
    return null;
  }
}

export function writeUltSnap(locale: string, snap: UltSnap) {
  if (!hasLS()) return;
  localStorage.setItem(key(locale), JSON.stringify(snap));
}

export function clearUltSnap(locale: string) {
  if (!hasLS()) return;
  localStorage.removeItem(key(locale));
}

export type { UltSnap };
