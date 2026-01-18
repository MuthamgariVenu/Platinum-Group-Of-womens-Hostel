"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type HeroProps = {
  image: string;
  rating: string;
  area: string;
  address: string;
  title: string;
  subtitle: string;
  primaryPhone: string;
  secondaryPhone: string;
};

export default function HeroCard({
  image,
  rating,
  area,
  address,
  title,
  subtitle,
  primaryPhone,
  secondaryPhone,
}: HeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
     {/* IMAGE */}
<div className="relative w-full max-h-[420px] bg-black">
  <Image
    src={image}
    alt={title}
    width={1200}
    height={800}
    className="w-full h-[420px] object-cover"
    priority
  />

  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

  {/* Rating */}
  <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-900">
    ⭐ {rating}
  </div>

  {/* Area */}
  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-900">
    📍 {area}
  </div>
</div>

      {/* 🔹 CONTENT */}
      <div className="p-4 text-center">
        {/* Address */}
        <p className="text-xs text-gray-700 font-medium">
          {address}
        </p>

        {/* Title */}
        <h1 className="text-xl font-extrabold text-gray-900 mt-2">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-gray-700 font-medium mt-1">
          {subtitle}
        </p>

        {/* Primary Call */}
        <a
          href={`tel:${primaryPhone}`}
          className="inline-flex items-center gap-2 mt-4 px-6 py-2 rounded-full
          bg-green-600 text-white font-bold shadow animate-pulse"
        >
          📞 Call Now: {primaryPhone}
        </a>

        {/* Secondary Contact */}
        <p className="text-sm mt-2 text-gray-800 font-medium">
          Alternate Contact:{" "}
          <a
            href={`tel:${secondaryPhone}`}
            className="text-green-700 font-bold"
          >
            {secondaryPhone}
          </a>
        </p>
      </div>
    </motion.div>
  );
}
