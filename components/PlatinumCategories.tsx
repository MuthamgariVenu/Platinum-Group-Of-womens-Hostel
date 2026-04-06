"use client";

import { useRouter } from "next/navigation";
import {
  Sparkles,
  Crown,
  Building2,
  Star,
  Home,
  MapPin,
  Hotel,
  Wifi,
  Utensils,
  Shield,
  Phone,
  type LucideIcon,
} from "lucide-react";

type Branch = {
  id: string;
  title: string;
  location: string;
  badge: string;
  icon: string;
  bg: string;
  href: string;
  startingPrice?: number | string;
};

/** Strip non-digits, format with Indian thousands separator, prefix ₹.
 *  Returns null when the value is empty/missing so the caller can hide the section. */
function formatPrice(raw: string | number | undefined | null): string | null {
  if (raw == null || raw === "") return null;
  const num = typeof raw === "number"
    ? raw
    : parseInt(String(raw).replace(/[^0-9]/g, ""), 10);
  if (isNaN(num) || num <= 0) return null;
  return "₹" + num.toLocaleString("en-IN");
}

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  Crown,
  Building2,
  Star,
  Home,
  MapPin,
  Hotel,
};

const CALL_NUMBER = "tel:+918978499854";
const WHATSAPP_NUMBER = "919985499864";

export default function PlatinumCategories({ branches }: { branches: Branch[] }) {
  const router = useRouter();

  const getWhatsAppLink = (title: string) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Hi, I want details about ${title}`
    )}`;

  return (
    <section className="mt-20 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 text-center">
        Our Premium Women&apos;s PG Categories
      </h2>
      <p className="text-gray-500 text-center mt-2">
        Choose the lifestyle that fits you best
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        {branches.map((pg) => {
          const Icon: LucideIcon = ICON_MAP[pg.icon] ?? Building2;

          return (
            <div
              key={pg.id}
              className="
                group relative rounded-3xl bg-white p-6
                shadow-[0_6px_25px_rgba(0,0,0,0.06)]
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-[0_14px_45px_rgba(0,0,0,0.12)]
              "
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 blur-xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{pg.title}</h3>
                  </div>
                  {pg.badge && (
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                      {pg.badge}
                    </span>
                  )}
                </div>

                {pg.location && (
                  <p className="text-xs text-gray-400 mt-1 ml-9">{pg.location}</p>
                )}

                {formatPrice(pg.startingPrice) && (
                  <p className="mt-3">
                    <span className="text-sm text-gray-500">Starting from </span>
                    <span className="text-2xl font-bold text-purple-700">
                      {formatPrice(pg.startingPrice)}
                    </span>
                    <span className="text-xs text-gray-400"> / month</span>
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                    <Wifi size={12} /> WiFi
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
                    <Utensils size={12} /> Food
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                    <Shield size={12} /> 24/7 Security
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <a
                    href={CALL_NUMBER}
                    className="flex items-center justify-center gap-1 border border-purple-600 text-purple-700 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition"
                  >
                    <Phone size={14} /> Call
                  </a>
                  <a
                    href={getWhatsAppLink(pg.title)}
                    target="_blank"
                    className="text-center py-2 rounded-lg text-sm font-medium text-white bg-[#128C7E] hover:bg-[#0f7a6d] shadow-md hover:shadow-lg transition"
                  >
                    WhatsApp
                  </a>
                </div>

                <button
                  onClick={() => router.push(pg.href)}
                  className="w-full mt-3 border border-purple-600 text-purple-700 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
