import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gaufrle from "../../../public/gaufrle.png";
import { navigationLinks } from "@/lib/navigation";

export default function Footer() {
  const t = useTranslations("Header");
  return (
    <footer className="bg-element">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav
          aria-label="Footer"
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
        >
          {navigationLinks.map((item) => (
            <div key={item.tradKey} className="pb-6">
              <Link
                href={item.url}
                className="text-sm leading-6 text-neutral hover:text-foreground hover:font-semibold duration-200"
              >
                {t(`navigation.${item.tradKey}`)}
              </Link>
            </div>
          ))}
        </nav>

        <div className="mt-10 text-sm text-neutral flex items-center justify-center space-x-10">
          {t("myOtherGames")} :{" "}
          <Link
            href="https://gaufrle.vercel.app/"
            target="_blank"
            className="inline-flex items-center gap-1 font-semibold text-foreground/60 ml-3 p-1.5 rounded-md border border-foreground/40 hover:border-foreground hover:text-foreground duration-150"
          >
            <Image src={gaufrle} alt="Gaufrlelogo" width={24} height={24} />{" "}
            Gaufrle
          </Link>
        </div>

        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; 2025{" "}
          <Link
            href="https://williamlouislouisy.com"
            target="_blank"
            className="hover:font-semibold duration-200"
          >
            BakerScript
          </Link>
          , Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
