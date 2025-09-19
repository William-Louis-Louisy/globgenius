"use client";
import Link from "next/link";
import Image from "next/image";
import { gameModes } from "@/lib/gameModes";
import { useTranslations } from "next-intl";
import GameModeCard from "@/components/cards/GameModeCard";
import MaxWidthWrapper from "@/components/commons/MaxWidthWrapper";

export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <>
      <div className="relative w-full h-80 md:h-[480px] mt-16">
        <Image
          src="/heroGG.png"
          alt="logo"
          fill
          objectFit="cover"
          priority
          className="z-10"
        />
        <div className="absolute flex flex-col items-center justify-end gap-4 z-20 inset-0 text-center md:text-left bg-gradient-to-t from-background from-30% md:from-10% via-transparent to-background to-99%">
          <h1 className="text-2xl md:text-4xl">{t("title")}</h1>
          <p>{t("description")}</p>
        </div>
      </div>
      <MaxWidthWrapper className="flex flex-col items-center gap-8 mt-8 pb-12">
        <div className="inline-flex items-center justify-center w-full gap-4">
          <Link
            href="/quiz/how-to-play"
            className="cta border border-foreground"
          >
            {t("howToPlay")}
          </Link>
          <Link
            href="/quiz/flag"
            className="cta bg-accent border border-accent"
          >
            {t("playNow")}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {gameModes.map((gm) => (
            <GameModeCard
              key={gm.key}
              url={gm.url}
              icon={gm.icon}
              title={t(`${gm.key}.title`)}
              pitch={t(`${gm.key}.pitch`)}
              label={t("play")}
            />
          ))}
        </div>
      </MaxWidthWrapper>
    </>
  );
}
