import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  placeholder: string;
  toleranceText: string;
}

export default function NumericInput({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder,
  toleranceText,
}: Props) {
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <input
        type="number"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) onSubmit();
          }
        }}
        className="w-56 rounded-lg px-4 py-2 bg-black/20 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-foreground"
        disabled={disabled}
      />
      <span className="text-xs opacity-70">{toleranceText}</span>
    </div>
  );
}
