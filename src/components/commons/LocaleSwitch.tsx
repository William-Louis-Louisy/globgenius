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
import { Check, CaretUpDown } from "@phosphor-icons/react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";

export default function LocaleSwitch() {
  const t = useTranslations("LocaleSwitch");
  const currentLocale = useLocale();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          <ListboxButton className="relative w-full cursor-default rounded-md bg-element py-2 pl-3 pr-10 text-left shadow-sm ring-0 focus:ring-0 focus:outline-none">
            <span className="block truncate">{selected.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <CaretUpDown aria-hidden="true" className="size-4" />
            </span>
          </ListboxButton>
          <ListboxOptions
            modal={false}
            className="absolute z-10 mt-1 max-h-60 w-fit overflow-auto rounded-md bg-element py-1 text-base shadow-lg ring-0 focus:outline-none sm:text-sm"
          >
            {locales.map((loc) => (
              <ListboxOption
                key={loc.id}
                value={loc}
                className={({ focus }) =>
                  `relative cursor-default select-none py-2 pl-4 pr-9 ${
                    focus ? "bg-foreground text-background" : "text-foreground"
                  }`
                }
              >
                {({ selected: isSelected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        isSelected ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {loc.label}
                    </span>
                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Check aria-hidden="true" className="size-4" />
                      </span>
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
