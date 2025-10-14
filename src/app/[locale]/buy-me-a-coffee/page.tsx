import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import globKofi from "../../../../public/globKofi.png";
import MaxWidthWrapper from "@/components/commons/MaxWidthWrapper";

export default function BuyMeCoffee() {
  const t = useTranslations("BuyMeCoffee");
  return (
    <MaxWidthWrapper className="min-h-page flex flex-col md:flex-row items-center mt-16">
      <div className="h-full w-full flex flex-col items-center p-8">
        {/* Title */}
        <p className="text-center text-lg md:text-2xl">{t("title")}</p>

        {/* Image */}
        <Image
          className="drop-shadow-xl"
          src={globKofi}
          alt={t("alt")}
          width={256}
          height={256}
        />

        {/* Text */}
        <p className="text-center text-base md:text-xl max-w-xl">
          {t("description")}
        </p>
      </div>
      <iframe
        id="kofiframe"
        src="https://ko-fi.com/221bbakerscript/?hidefeed=true&widget=true&embed=true&preview=true"
        className="h-[712px] md:h-page"
        title="221bbakerscript"
      ></iframe>
    </MaxWidthWrapper>
  );
}
