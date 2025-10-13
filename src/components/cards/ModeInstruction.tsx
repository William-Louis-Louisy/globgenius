import React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

interface Props {
  title: string;
  sub: string;
  description?: string[];
  path: string;
  variants: Variants;
}

export default function ModeInstruction({
  title,
  sub,
  description,
  path,
  variants,
}: Props) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      className="isolate overflow-hidden bg-element rounded-lg px-6 lg:px-8"
      {...(!shouldReduce && {
        viewport: { amount: 0.25, once: true },
        variants,
        initial: "initial",
        whileInView: "inView",
      })}
    >
      <div className="relative mx-auto max-w-2xl py-6 sm:py-12 lg:max-w-3xl">
        <div className="absolute left-1/2 top-0 -z-10 h-[50rem] w-[90rem] -translate-x-1/2 bg-[radial-gradient(50%_100%_at_top,theme(colors.background.100),element)] opacity-20 lg:left-36" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-12 w-[150vw] origin-bottom-left skew-x-[-30deg] bg-element shadow-xl shadow-accent/20 ring-1 ring-background sm:mr-20 md:mr-0 lg:right-full lg:-mr-36 lg:origin-center" />
        <div className="grid grid-cols-1 items-center gap-x-6 gap-y-8 lg:gap-x-10">
          <div className="relative col-span-2 lg:col-start-1 lg:row-start-2">
            <svg
              fill="none"
              viewBox="0 0 256 256"
              aria-hidden="true"
              className="absolute -top-18 right-8 -z-10 h-60 -rotate-6 stroke-accent/25"
            >
              <path d={path} />
            </svg>
            <div className="leading-8 sm:leading-9">
              <h3 className="font-semibold mb-2 text-xl">{title}</h3>
              <p className="mb-2 text-lg">{sub}</p>
              {description &&
                description.map((d, i) => (
                  <p key={`desc-${i}`} className="text-sm text-neutral mt-2">
                    {d}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
