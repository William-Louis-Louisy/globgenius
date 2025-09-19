"use client";

import { useEffect, useRef, useState } from "react";

export type AutoMode = "off" | "on-correct" | "on-any";

export function useAutoAdvance(
  feedback: "idle" | "correct" | "wrong",
  seconds: number,
  onNext: () => void | Promise<void>,
  mode: AutoMode = "on-any"
) {
  const minSeconds = Math.max(1, Number.isFinite(seconds) ? seconds : 3);

  const [remaining, setRemaining] = useState<number>(minSeconds);
  const [active, setActive] = useState<boolean>(false);

  const timeoutRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const mountedRef = useRef(false);
  const lastFeedbackRef = useRef<typeof feedback>("idle");

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      runningRef.current = false;
    };
  }, []);

  const scheduleTick = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setRemaining((r) => {
        if (r <= 1) {
          if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
          runningRef.current = false;
          setActive(false);
          Promise.resolve().then(() => onNext());
          return minSeconds;
        }
        scheduleTick();
        return r - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const becameNonIdle =
      lastFeedbackRef.current === "idle" && feedback !== "idle";
    const shouldRun =
      feedback !== "idle" &&
      (mode === "on-any" || (mode === "on-correct" && feedback === "correct"));

    lastFeedbackRef.current = feedback;

    if (!shouldRun) {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      runningRef.current = false;
      setActive(false);
      setRemaining(minSeconds);
      return;
    }

    if (becameNonIdle && !runningRef.current) {
      runningRef.current = true;
      setActive(true);
      setRemaining(minSeconds);
      scheduleTick();
    }
  }, [feedback, mode, minSeconds, onNext]);

  const cancel = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    runningRef.current = false;
    setActive(false);
    setRemaining(minSeconds);
  };

  return { remaining, active, cancel };
}
