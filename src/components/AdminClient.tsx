"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AdminClient() {
  const t = useTranslations("AdminPage");

  return (
    <>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <div className="relative w-full h-48 md:h-112">
        <Image
          src="/cover.png"
          alt="BakerScript Cover Picture"
          objectFit="cover"
          fill
        />
      </div>
    </>
  );
}
