"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

export default function ThemeToggle() {
  const t = useTranslations("ThemeToggle");
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <button
      className="cursor-pointer bg-element rounded-full p-2"
      onClick={toggleTheme}
      aria-label={t("label")}
      title={resolvedTheme === "dark" ? t("light") : t("dark")}
    >
      {resolvedTheme === "dark" ? (
        <Sun size={20} weight="bold" />
      ) : (
        <Moon size={20} weight="bold" />
      )}
    </button>
  );
}
