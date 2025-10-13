import {
  motion,
  AnimatePresence,
  HTMLMotionProps,
  useReducedMotion,
} from "motion/react";
import React from "react";

export default function Reveal({
  show,
  side, // "left" | "right"
  className,
  children,
}: {
  show: boolean;
  side: "left" | "right";
  className?: string;
  children: React.ReactNode;
}) {
  const r = useReducedMotion();

  const common: HTMLMotionProps<"div"> = {
    initial: "hidden",
    animate: "show",
    exit: "exit",
    style: {
      transformOrigin: side === "left" ? "0% 50%" : "100% 50%",
    },
    variants: {
      hidden: { scaleX: 0, opacity: 0 },
      show: {
        scaleX: 1,
        opacity: 1,
        transition: r
          ? { duration: 0 }
          : { duration: 0.22, ease: [0.2, 0.7, 0.3, 1] },
      },
      exit: {
        scaleX: 0,
        opacity: 0,
        transition: r
          ? { duration: 0 }
          : { duration: 0.14, ease: [0.4, 0.0, 0.2, 1] },
      },
    },
  };

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {show ? (
        <motion.div layout {...common} className={className}>
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
