import { defineRouting } from "next-intl/routing";
export const routing = defineRouting({
  locales: ["en", "fr", "es", "pt", "zh", "ja", "ko", "ru"],
  defaultLocale: "en",
});
