import countries from "@/data/countries.json";
import type { Country } from "@/app/types/country";
import { NextRequest, NextResponse } from "next/server";

const countriesMap = countries as Record<string, Country>;
const ALL = Object.values(countriesMap);

function hasUsableCapital(c: Country): boolean {
  const cap = (c.capital ?? "").trim();
  if (!cap) return false;
  const invalid = ["n/a", "na", "none", "-"];
  return !invalid.includes(cap.toLowerCase());
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode =
    (searchParams.get("mode") as "flag" | "capital" | "shape") || "flag";
  const locale = searchParams.get("locale") || "en";

  let answer: Country;

  if (mode === "capital") {
    const pool = ALL.filter(hasUsableCapital);
    if (pool.length === 0) {
      return NextResponse.json(
        { error: "No countries with a usable capital were found." },
        { status: 503 }
      );
    }
    answer = pickRandom(pool);
  } else {
    answer = pickRandom(ALL);
  }

  let question:
    | { type: "flag"; data: string }
    | { type: "capital"; data: string }
    | { type: "shape"; data: Country["shape"] };

  switch (mode) {
    case "capital":
      question = { type: "capital", data: answer.capital };
      break;
    case "shape":
      if (!answer.shape) {
        return NextResponse.json(
          { error: "Shape not available" },
          { status: 404 }
        );
      }
      question = { type: "shape", data: answer.shape };
      break;
    case "flag":
    default:
      question = { type: "flag", data: answer.flag.svg };
      break;
  }

  return NextResponse.json({
    question,
    options: [],
    answer: answer.name.common,
    localizedAnswer:
      (answer.translations?.[
        locale as keyof typeof answer.translations
      ] as string) ?? answer.name.common,
  });
}
