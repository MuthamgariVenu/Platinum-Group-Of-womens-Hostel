"use client";

import { motion } from "framer-motion";

export default function StickyCallBar() {
  return (
    <div className="fixed bottom-4 left-0 w-full flex justify-center pointer-events-none z-50">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-auto bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg"
      >
        📞 Call Now
      </motion.div>
    </div>
  );
}
