"use client";

import { motion } from "framer-motion";

type Props = {
  address: string;
  landmark?: string;
  nearby?: string[];
  mapUrl: string;
};

export default function LocationCard({
  address,
  landmark,
  nearby,
  mapUrl,
}: Props) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-lg p-4 mt-4"
    >
      {/* Heading */}
      <h2 className="text-lg font-extrabold text-gray-900 mb-1">
        📍 Location
      </h2>

      {/* Address */}
      <p className="text-sm text-gray-700 font-medium">
        {address}
      </p>

      {/* Landmark */}
      {landmark && (
        <p className="mt-1 text-sm font-semibold text-indigo-700">
          🧭 Landmark: {landmark}
        </p>
      )}

      {/* Nearby */}
      {nearby && nearby.length > 0 && (
        <div className="mt-3 space-y-1 text-sm text-gray-700 font-medium">
          {nearby.map((item, i) => (
            <p key={i}>📌 {item}</p>
          ))}
        </div>
      )}

      {/* Directions */}
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-white font-semibold"
      >
        📍 Get Directions
      </a>
    </motion.div>
  );
}
