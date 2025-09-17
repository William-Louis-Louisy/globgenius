import { Link } from "@/i18n/navigation";
import Image from "next/image";
import React from "react";

export default function Logo() {
  return (
    <Link href={"/"} className="inline-flex items-center gap-4">
      <div className="relative size-12 rounded-full overflow-hidden">
        <Image src="/bakerscript.png" alt="logo" fill />
      </div>
      <span className="text-2xl font-black hidden md:inline">BakerScript</span>
    </Link>
  );
}
