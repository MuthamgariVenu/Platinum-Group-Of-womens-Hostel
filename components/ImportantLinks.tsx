"use client";

import { Globe, MapPin, Phone, Image } from "lucide-react";
import { useRouter } from "next/navigation";

const links = [
  {
    title: "Official Website",
    subtitle: "Complete PG information",
    icon: Globe,
    href: "https://your-website-link.com",
  },
  {
    title: "Google Maps",
    subtitle: "View exact location",
    icon: MapPin,
    href: "https://maps.google.com",
  },
  {
    title: "Contact & Enquiry",
    subtitle: "Call or WhatsApp us",
    icon: Phone,
    href: "tel:+919999999999",
  },
  {
    title: "Photo Gallery",
    subtitle: "Rooms & facilities",
    icon: Image,
    href: "#gallery",
  },
];

export default function ImportantLinks() {
  const router = useRouter();

  return (
    <section className="w-full px-4 py-14 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-primary mb-6">
          Useful Links
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {links.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                onClick={() => window.open(item.href, "_blank")}
                className="flex items-center gap-4 p-4 rounded-2xl
                bg-gray-50 cursor-pointer
                shadow-sm hover:shadow-md transition"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>

                <div>
                  <p className="font-medium text-primary">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
