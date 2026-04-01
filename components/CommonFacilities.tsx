"use client";

import {
  ShieldCheck,
  BedDouble,
  Utensils,
  Wifi,
  Sparkles,
  UserCheck,
  WashingMachine,
  Refrigerator,
  Flame,
  Droplets,
  Dumbbell,
  Archive,
  BatteryCharging,
  Tv, // ✅ FIX: ADD THIS
} from "lucide-react";

type FacilityItem = {
  title: string;
  subtitle?: string;
  sub?: string; // backward support
  icon: string;
  bg: string;
  iconBg: string;
  badge?: string;
};

type ElectricityInfo = {
  included: boolean;
  text?: string;
};

type CommonFacilitiesProps = {
  data: FacilityItem[];
  electricity?: ElectricityInfo;
};

const iconMap: Record<string, any> = {
  security: ShieldCheck,
  bed: BedDouble,
  food: Utensils,
  wifi: Wifi,
  housekeeping: Sparkles,
  management: UserCheck,
  washing: WashingMachine,
  fridge: Refrigerator,
  geyser: Flame,
  water: Droplets,
  shoe: Archive,
  gym: Dumbbell,
  power: BatteryCharging,
  tv: Tv, // ✅ NOW WORKS
};

export default function CommonFacilities({
  data,
  electricity,
}: CommonFacilitiesProps) {
  return (
    <section className="mt-8">
      {/* TITLE */}
      <h2 className="px-4 text-base font-semibold text-gray-900 mb-4">
        Facilities
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 px-4">
        {data.map((item, index) => {
          const Icon = iconMap[item.icon];
          const subtitleText = item.subtitle || item.sub;

          return (
            <div
              key={index}
              className={`relative h-[96px] rounded-xl bg-gradient-to-br ${item.bg}
              shadow-sm px-2 py-3 flex flex-col items-center justify-center`}
            >
              {/* Badge */}
              {item.badge && (
                <span className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-[1px] rounded-full bg-green-500 text-white font-medium">
                  {item.badge}
                </span>
              )}

              {/* Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${item.iconBg}`}
              >
                {Icon && <Icon className="w-4 h-4 text-gray-800" />}
              </div>

              {/* Title */}
              <p className="mt-1.5 text-[11px] font-medium text-gray-900 text-center leading-tight line-clamp-2">
                {item.title}
              </p>

              {/* Subtitle */}
              {subtitleText && (
                <p className="text-[10px] text-gray-500 text-center mt-0.5">
                  {subtitleText}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ⚡ ELECTRICITY INFO */}
      {electricity?.included && (
        <div
          className="mt-4 mx-4 text-center text-sm font-semibold text-green-700"
          style={{ animation: "blink 1.5s infinite" }}
        >
          ⚡ {electricity.text ?? "Electricity Bill Included"}
        </div>
      )}

      {/* Blink animation */}
      <style jsx>{`
        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
