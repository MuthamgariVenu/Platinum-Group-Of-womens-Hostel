"use client";

import { Phone } from "lucide-react";
import Image from "next/image";

export default function TopContactBar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 shadow-lg">

        <div className="w-full px-4 py-3 flex items-center justify-between">

          {/* LEFT — LOGO + LABEL */}
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo7.png"
              alt="Platinum"
              width={120}
              height={120}
              className="rounded-md"
            />

            {/* LABEL */}
            <span className="text-white font-semibold text-sm sm:text-base">
            
            </span>
          </div>

          {/* RIGHT — PHONE BUTTONS */}
          <div className="flex items-center gap-2">

            <a
              href="tel:8978499854"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-400/10 text-yellow-300 text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              89784 99854
            </a>

            <a
              href="tel:9985499864"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-400/10 text-green-300 text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              99854 99864
            </a>

          </div>
        </div>
      </div>
    </header>
  );
}
