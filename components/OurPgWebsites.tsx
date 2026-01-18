"use client";

import { useRouter } from "next/navigation";
import { Sparkles, Crown, Building2, Star } from "lucide-react";

const sites = [
  {
    name: "Platinum Bloom",
    desc: "Premium women’s PG with comfort living",
    icon: Sparkles,
    href: "/bloom",
    bg: "from-rose-50 to-white",
  },
  {
    name: "Platinum Elite",
    desc: "Luxury women’s PG experience",
    icon: Crown,
    href: "/elite",
    bg: "from-indigo-50 to-white",
  },
  {
    name: "Platinum Grand",
    desc: "Spacious & elegant women’s PG",
    icon: Building2,
    href: "/grand",
    bg: "from-purple-50 to-white",
  },
  {
    name: "Platinum Prime",
    desc: "Affordable premium women’s PG",
    icon: Star,
    href: "/prime",
    bg: "from-blue-50 to-white",
  },
];

export default function OurPgWebsites() {
  const router = useRouter();

  return (
    <section className="w-full px-4 py-16 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-primary mb-8">
          Our Women’s PG Websites
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sites.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                onClick={() => router.push(item.href)}
                className={`rounded-3xl p-6 cursor-pointer
                bg-gradient-to-br ${item.bg}
                shadow-sm hover:shadow-lg
                transition-all hover:-translate-y-1`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white shadow">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>

                  <div>
                    <p className="text-base font-semibold text-primary">
                      {item.name}
                    </p>
                    <p className="text-sm text-muted mt-1">
                      {item.desc}
                    </p>
                    <p className="text-xs text-indigo-600 mt-3 font-medium">
                      Visit website →
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
