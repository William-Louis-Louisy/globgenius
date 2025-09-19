import { GameMode } from "@/lib/gameModes";
import Link from "next/link";
import React from "react";

interface Props {
  key: GameMode;
  url: string;
  icon: React.ElementType;
  title: string;
  pitch: string;
  label: string;
}

export default function GameModeCard({
  key,
  url,
  icon,
  title,
  pitch,
  label,
}: Props) {
  const IconComponent = icon;
  return (
    <div
      key={key}
      className="relative flex flex-col items-start justify-between gap-6 p-6 rounded-xl shadow mt-12 bg-element card-pattern"
    >
      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 badge-pattern p-4 rounded-full border-12 border-background">
        <IconComponent size={48} />
      </span>
      <span className="font-medium text-lg underline decoration-accent">
        {title}
      </span>
      <p className="text-sm">{pitch}</p>
      <span className="flex items-center justify-end w-full mt-2">
        <Link
          href={url}
          className="px-5 py-2 rounded-md bg-foreground text-background hover:bg-foreground/75 duration-200"
        >
          {label}
        </Link>
      </span>
    </div>
  );
}
