"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export type FoodData = {
  subtitle: string;
  daily: string;
  nonVeg?: string[];   // optional
  snacks?: string;    // optional
  note?: string;      // optional
};

type Props = {
  data: FoodData;
};

export default function FoodMenuCard({ data }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔹 Food Card */}
      <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="bg-gradient-to-br from-white to-slate-50 
        rounded-2xl shadow-lg p-4 mt-4 cursor-pointer"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
          🍽️ Food Menu
        </h2>

        <p className="text-sm text-gray-700 font-medium mt-1">
          {data.subtitle}
        </p>

        <p className="text-xs text-indigo-600 font-medium mt-2">
          👉 Tap to view food details
        </p>
      </motion.div>

      {/* 🔹 Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 
            flex items-center justify-center px-3"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-md w-full 
              rounded-2xl shadow-xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* 🔹 Header (NO divider line) */}
              <div className="flex items-center justify-between px-5 py-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  🍽️ Food Details
                </h3>

                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* 🔹 Content (reduced gaps) */}
              <div className="px-5 pb-5 space-y-2 text-sm text-gray-800">
                
                {/* Daily Food */}
                <div className="bg-green-50 border border-green-200 
                p-3 rounded-xl">
                  <p className="font-semibold text-green-800">
                    🍽️ Daily Food
                  </p>
                  <p className="mt-1 text-gray-700">
                    {data.daily}
                  </p>
                </div>

                {/* Non-Veg (optional) */}
                {data.nonVeg && data.nonVeg.length > 0 && (
                  <div className="bg-rose-50 border border-rose-200 
                  p-3 rounded-xl">
                    <p className="font-semibold text-rose-800">
                      🍗 Non-Vegetarian
                    </p>
                    <ul className="list-disc ml-5 mt-1 text-gray-700">
                      {data.nonVeg.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Snacks (optional – only if exists) */}
                {data.snacks && (
                  <div className="bg-yellow-50 border border-yellow-200 
                  p-3 rounded-xl">
                    <p className="font-semibold text-yellow-800">
                      🍪 Snacks
                    </p>
                    <p className="mt-1 text-gray-700">
                      {data.snacks}
                    </p>
                  </div>
                )}

                {/* Note */}
                {data.note && (
                  <>
                    <div className="h-px bg-gray-200 my-2" />
                    <div className="bg-blue-50 border border-blue-200 
                    p-3 rounded-xl text-xs text-gray-700 font-medium">
                      ℹ️ {data.note}
                    </div>
                  </>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
