"use client";

import { Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopContactBar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="sticky top-0 z-50">

      {/* Glass gradient background */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-indigo-900/90 border-b border-white/10 shadow-sm">

        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* LEFT — Brand */}
          <div className="flex items-center gap-3">

            <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white shadow-inner">
              P
            </div>

            {isHomePage ? (
              <span className="text-white font-semibold tracking-wide text-sm sm:text-base">
                Platinum Pg's Living
              </span>
            ) : (
              <Link
                href="/"
                className="text-white font-semibold tracking-wide hover:text-yellow-300 transition"
              >
                ← Back to Home
              </Link>
            )}
          </div>

          {/* RIGHT — Contacts */}
          <div className="flex items-center gap-4">

            <a
              href="tel:8978499854"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20 transition text-xs sm:text-sm font-medium"
            >
              <Phone className="w-4 h-4" />
              89784 99854
            </a>

            <a
              href="tel:9985499864"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-400/10 text-green-300 hover:bg-green-400/20 transition text-xs sm:text-sm font-medium"
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
