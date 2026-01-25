"use client";

import { Phone, Mail, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopContactBar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="w-full bg-indigo-900 text-white text-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

        {/* LEFT – exact same order as Sai Baba */}
        <div className="flex flex-wrap items-center gap-6 justify-center sm:justify-start">

          {/* Contact 1 – SAME */}
          <a
            href="tel:8978499854"
            className="flex items-center gap-1 font-semibold animate-pulse cursor-pointer text-yellow-300 hover:text-yellow-200 transition"
          >
            <Phone className="w-4 h-4" />
            89784 99854
          </a>

          {/* Contact 2 – SAME */}
          <a
            href="tel:9985499864"
            className="flex items-center gap-1 font-semibold animate-pulse cursor-pointer text-green-300 hover:text-green-200 transition"
          >
            <Phone className="w-4 h-4" />
            99854 99864
          </a>

          {/* Landing → Site Name | Other pages → Home */}
          {isHomePage ? (
            <span className="font-semibold text-white">
              Platinum Women’s Hostel
            </span>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-1 font-semibold text-white hover:text-yellow-300 transition"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center sm:justify-end gap-2">
          <Mail className="w-4 h-4" />
          <a
            href="mailto:info@saibabagroupofhostels.in"
            className="hover:text-yellow-300 transition"
          >
            info@saibabagroupofhostels.in
          </a>
        </div>

      </div>
    </div>
  );
}
