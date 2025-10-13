import React from "react";
import { motion } from "motion/react";

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
      <motion.h1
        className="text-2xl md:text-3xl font-montserrat font-bold"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{
          opacity: 1,
          scaleX: 1,
          transformOrigin: "left",
          transition: { duration: 0.22, ease: [0.2, 0.7, 0.3, 1] },
        }}
      >
        {title}
      </motion.h1>

      <motion.p
        className="text-sm opacity-70"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{
          opacity: 1,
          scaleX: 1,
          transformOrigin: "right",
          transition: { duration: 0.22, ease: [0.2, 0.7, 0.3, 1] },
        }}
      >
        {description}, {attempts} {maxAttempts}
      </motion.p>
    </header>
  );
}
