import { Link } from "@/i18n/navigation";
import Image from "next/image";
import React from "react";

export default function Logo() {
  return (
    <Link href={"/"} className="inline-flex items-center gap-2">
      <div className="relative size-12 overflow-hidden">
        <Image src="/globo.png" alt="logo" fill className="object-contain" />
      </div>
      <span className="text-2xl font-quicksand font-black hidden md:inline">
        GlobGenius
      </span>
    </Link>
  );
}
