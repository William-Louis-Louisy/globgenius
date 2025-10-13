import React from "react";
import { motion } from "framer-motion";
import { centeredReveal } from "@/lib/motionVariants";
import { cn } from "@/lib/utils";

export default function QuestionWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        "flex items-center justify-center mb-6 select-none",
        className
      )}
      variants={centeredReveal}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
}
