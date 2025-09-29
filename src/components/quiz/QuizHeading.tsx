import React from "react";

interface Props {
  title: string;
  description: string;
  maxAttempts: string;
  attempts: number;
}

export default function QuizHeading({
  title,
  description,
  maxAttempts,
  attempts,
}: Props) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl md:text-3xl font-montserrat font-bold">
        {title}
      </h1>
      <p className="text-sm opacity-70">
        {description}, {attempts} {maxAttempts}
      </p>
    </header>
  );
}
