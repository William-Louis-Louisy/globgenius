import countries from "@/data/countries.json";
import type { Country } from "@/app/types/country";
import { NextRequest, NextResponse } from "next/server";
import type { Question, RandomCountryResponse } from "@/app/types/api";

const countriesMap = countries as Record<string, Country>;
const allCountries = Object.values(countriesMap);

function sample<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") as Question["type"]) || "flag";
  const locale = searchParams.get("locale") || "en";

  const answer = allCountries[Math.floor(Math.random() * allCountries.length)];

  let question: Question;
  switch (mode) {
    case "capital":
      question = { type: "capital", data: answer.capital };
      break;
    case "shape":
      if (!answer.shape) {
        return NextResponse.json(
          { error: "Shape data not available for this country" },
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

  const options = sample(allCountries, 3).map((c) => c.name.common);
  if (!options.includes(answer.name.common)) {
    options.push(answer.name.common);
  }
  const shuffledOptions = sample(options, options.length);

  const response: RandomCountryResponse = {
    question,
    options: shuffledOptions,
    answer: answer.name.common,
    localizedAnswer:
      answer.translations?.[locale as keyof typeof answer.translations] ??
      answer.name.common,
  };

  return NextResponse.json(response);
}
