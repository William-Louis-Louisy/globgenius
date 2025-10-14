"use client";

import { useState, useTransition } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { routing } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { CaretUpDown } from "@phosphor-icons/react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMobile";

export default function LocaleSwitch() {
  const t = useTranslations("LocaleSwitch");
  const currentLocale = useLocale();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const locales = routing.locales.map((loc, index) => ({
    id: index,
    code: loc,
    label: t("locale", { locale: loc }),
  }));

  const defaultLocale =
    locales.find((l) => l.code === currentLocale) || locales[0];
  const [selected, setSelected] = useState(defaultLocale);

  const handleChange = (localeOption: typeof defaultLocale) => {
    setSelected(localeOption);
    startTransition(() => {
      router.replace(
        { pathname, query: params },
        { locale: localeOption.code }
      );
    });
  };

  return (
    <div>
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative text-sm">
          <ListboxButton
            aria-busy={isPending}
            className="relative w-full cursor-default rounded-md bg-element py-2 pl-3 pr-10 text-left shadow-sm ring-0 focus:ring-0 focus:outline-none"
          >
            <span className="block truncate">{selected.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <CaretUpDown aria-hidden="true" className="size-4" />
            </span>
          </ListboxButton>
          <ListboxOptions
            modal={false}
            className={cn(
              "absolute z-10 max-h-60 w-full overflow-auto rounded-md bg-element py-1 text-base shadow-lg focus:outline-none sm:text-sm",
              isMobile ? "bottom-full mb-1" : "top-full mt-1"
            )}
          >
            {locales.map((loc) => (
              <ListboxOption
                key={loc.id}
                value={loc}
                title={loc.label}
                className={({ focus }) =>
                  cn(
                    "relative cursor-default select-none py-2 pl-4 pr-9 text-xs",
                    focus ? "bg-foreground text-background" : "text-foreground"
                  )
                }
              >
                {({ selected: isSelected }) => (
                  <span
                    className={`block ${
                      isSelected ? "font-bold" : "font-normal"
                    }`}
                  >
                    {loc.label}
                  </span>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
