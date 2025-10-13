import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Answer =
  | { kind: string; label: string }
  | { kind: string; label: string; svg?: string };

export default function AnswerGrid({ answers }: { answers: Answer[] }) {
  const t = useTranslations("UltimatePage");
  const r = useReducedMotion();

  const ref = React.useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const container: Variants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: r
        ? { duration: 0 }
        : { delayChildren: 0.05, staggerChildren: 0.08 },
    },
  };

  const item: Variants = {
    hidden: { opacity: r ? 1 : 0, y: r ? 0 : 8, scale: 1 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: r
        ? { duration: 0 }
        : { type: "spring", stiffness: 420, damping: 26, mass: 0.6 },
    },
    exit: {
      opacity: r ? 1 : 0,
      y: r ? 0 : -6,
      scale: 1,
      transition: r ? { duration: 0 } : { duration: 0.15 },
    },
  };

  const listKey = React.useMemo(
    () => answers.map((a) => a.kind).join("|"),
    [answers]
  );

  return (
    <motion.ul
      key={listKey}
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      exit="hidden"
      variants={container}
    >
      <AnimatePresence mode="popLayout">
        {answers.map((a) => (
          <motion.li
            key={a.kind}
            layout
            variants={item}
            className="flex flex-col items-center justify-between bg-element rounded-lg p-3 gap-3"
          >
            <span className="font-light text-xs">{t(a.kind)}</span>

            <span className="font-semibold">
              {"svg" in a && a.svg ? (
                <Image src={a.svg!} alt={a.label} width={48} height={48} />
              ) : (
                <span>{a.label}</span>
              )}
            </span>

            <span />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
