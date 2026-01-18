"use client";

import { useRouter } from "next/navigation";
import { Sparkles, Crown, Building2, Star } from "lucide-react";

const categories = [
  { title: "Platinum Bloom", icon: Sparkles, bg: "from-pink-50 to-pink-100", href: "/bloom" },
  { title: "Platinum Elite", icon: Crown, bg: "from-indigo-50 to-indigo-100", href: "/elite" },
  { title: "Platinum Grand", icon: Building2, bg: "from-purple-50 to-purple-100", href: "/grand" },
  { title: "Platinum Prime", icon: Star, bg: "from-blue-50 to-blue-100", href: "/prime" },
];

export default function PlatinumCategories() {
  const router = useRouter();

  return (
    <section className="mt-20 px-4">
      <h2 className="text-xl font-semibold text-gray-900 text-center">
        Our Premium Women’s PG Categories
      </h2>
      <p className="text-sm text-gray-600 text-center mt-1">
        Choose the lifestyle that fits you best
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {categories.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              onClick={() => router.push(item.href)}
              className={`cursor-pointer rounded-3xl p-6 bg-gradient-to-r ${item.bg} shadow-md hover:shadow-lg transition`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    View details →
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
