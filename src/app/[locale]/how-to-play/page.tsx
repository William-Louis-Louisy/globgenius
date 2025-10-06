import React from "react";
import { useTranslations } from "next-intl";
import MaxWidthWrapper from "@/components/commons/MaxWidthWrapper";

export default function HowToPlay() {
  const t = useTranslations("HowToPlay");
  return (
    <MaxWidthWrapper className="min-h-page flex flex-col items-center mt-16">
      <div className="w-full py-4 md:py-6">
        <header className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-montserrat font-bold">
            {t("title")}
          </h1>
          <p className="opacity-70">{t("intro")}</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          <article className="rounded-lg bg-element p-6">
            <h3 className="font-semibold mb-2 text-lg">{t("flags.title")}</h3>
            <p className="mb-2">{t("flags.how")}</p>
            <p className="text-sm text-neutral">{t("input")}</p>
          </article>

          <article className="rounded-lg bg-element p-6">
            <h3 className="font-semibold mb-2 text-lg">{t("shapes.title")}</h3>
            <p>{t("shapes.how")}</p>
            <p className="text-sm text-neutral mt-2">{t("input")}</p>
            <p className="text-sm text-neutral mt-2">{t("distance")}</p>
          </article>

          <article className="rounded-lg bg-element p-6">
            <h3 className="font-semibold mb-2 text-lg">
              {t("capitals.title")}
            </h3>
            <p>{t("capitals.how")}</p>
            <p className="text-sm text-neutral mt-2">{t("input")}</p>
          </article>

          <article className="rounded-lg bg-element p-6">
            <h3 className="font-semibold mb-2 text-lg">
              {t("ultimate.title")}
            </h3>
            <p>{t("ultimate.how")}</p>
            <p className="text-sm text-neutral mt-2">{t("ultimate.numbers")}</p>
          </article>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
