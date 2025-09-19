"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import React from "react";

export type Suggestion = { iso3: string; name: string };

type Props = {
  value: string;
  query: string;
  onChangeValue: (v: string) => void;
  onChangeQuery: (v: string) => void;
  onSubmitEnterNoActive: () => Promise<void> | void;
  suggestions: Suggestion[];
  placeholder?: string;
  disabled?: boolean;
};

export default function AnswerAutocomplete({
  value,
  query,
  onChangeValue,
  onChangeQuery,
  onSubmitEnterNoActive,
  suggestions,
  placeholder,
  disabled,
}: Props) {
  return (
    <Combobox value={value} onChange={onChangeValue} disabled={disabled}>
      <div className="relative">
        <ComboboxInput
          autoComplete="off"
          className="w-full rounded-lg px-4 py-2 bg-black/20 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-foreground"
          displayValue={(v: string) => v}
          placeholder={placeholder}
          value={value || query}
          onChange={(e) => {
            onChangeValue("");
            onChangeQuery(e.target.value);
          }}
          onKeyDown={async (e) => {
            if (e.key !== "Enter" || e.shiftKey) return;
            const hasActive =
              (e.currentTarget.getAttribute("aria-activedescendant") ?? "")
                .length > 0;
            if (hasActive) {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            await onSubmitEnterNoActive();
          }}
        />
        {suggestions.length > 0 && (
          <ComboboxOptions className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-lg bg-element ring-2 ring-foreground shadow-xl divide-y divide-white/10 text-left">
            {suggestions.map((s) => (
              <ComboboxOption
                key={s.iso3 + s.name}
                value={s.name}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-white/5 data-[focus]:bg-white/5 data-[selected]:bg-white/10"
              >
                {s.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}
