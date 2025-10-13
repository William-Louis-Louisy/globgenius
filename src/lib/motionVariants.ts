import { Variants } from "motion";

export const centeredReveal: Variants = {
  initial: { opacity: 0, scaleX: 0 },
  animate: {
    opacity: 1,
    scaleX: 1,
    transformOrigin: "center",
    transition: {
      delay: 0.2,
      duration: 2,
      ease: [0.2, 0.7, 0.3, 1],
      type: "spring",
      stiffness: 87,
    },
  },
};

export const downFadeIn: Variants = {
  initial: { opacity: 0, y: 50 },
  inView: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 1.3,
      bounce: 0.3,
      type: "spring",
      ease: [0.2, 0.7, 0.3, 1],
      stiffness: 87,
    },
  },
};

export const leftFadeIn: Variants = {
  initial: { opacity: 0, x: -50 },
  inView: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2,
      duration: 1.3,
      bounce: 0.3,
      type: "spring",
      ease: [0.2, 0.7, 0.3, 1],
      stiffness: 87,
    },
  },
};
export const rightFadeIn: Variants = {
  initial: { opacity: 0, x: 50 },
  inView: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2,
      duration: 1.3,
      bounce: 0.3,
      type: "spring",
      ease: [0.2, 0.7, 0.3, 1],
      stiffness: 87,
    },
  },
};
export const upFadeIn: Variants = {
  initial: { opacity: 0, y: 50 },
  inView: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 1.3,
      bounce: 0.3,
      type: "spring",
      ease: [0.2, 0.7, 0.3, 1],
      stiffness: 87,
    },
  },
};
