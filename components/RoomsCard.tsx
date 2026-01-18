"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type RoomPrice = {
  type: string;
  price: string;
};

type RoomsData = {
  subtitle: string;
  prices: RoomPrice[];
  note?: string; // optional blinking note
};

export default function RoomsCard({ data }: { data: RoomsData }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔹 MAIN CARD */}
      <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="bg-white rounded-2xl shadow-lg p-4 mt-4 cursor-pointer"
      >
        <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
          🛏️ Rooms & Rent
        </h2>

        <p className="text-sm text-gray-700 mt-1">
          {data.subtitle}
        </p>

        <p className="text-xs text-indigo-600 font-medium mt-2">
          👉 Tap to view room details
        </p>
      </motion.div>

      {/* 🔹 MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-3"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* 🔹 HEADER (NO BORDER) */}
              <div className="flex justify-between items-center px-5 py-4">
                <h3 className="text-lg font-extrabold text-gray-900">
                  🛏️ Room Details
                </h3>

                <button
                  onClick={() => setOpen(false)}
                  className="text-xl text-gray-700 hover:text-black"
                >
                  ✕
                </button>
              </div>

              {/* 🔹 ROOM LIST */}
              <div className="px-5 pb-4 space-y-3">
                {data.prices?.length > 0 ? (
                  data.prices.map((room, i) => (
                    <div
                      key={i}
                      className="rounded-xl px-4 py-3 
                      bg-gradient-to-r from-slate-50 to-slate-100"
                    >
                      <p className="font-semibold text-gray-900">
                        {room.type}
                      </p>
                      <p className="text-sm text-gray-700 mt-[2px]">
                        Rent: {room.price}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600 font-medium">
                    Room details not available
                  </p>
                )}
              </div>

              {/* 🔹 BLINKING NOTE (OPTIONAL) */}
              {data.note && (
                <motion.div
                  className="mx-5 mb-5 rounded-xl bg-red-50 
                  text-red-700 text-sm font-semibold text-center px-4 py-3"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                >
                  ⚠️ {data.note}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
