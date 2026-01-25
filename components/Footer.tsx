"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export default function Footer() {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { margin: "-50px" });

  const name = "Muthamgari Venu";

  const colors = [
    "#6366f1", // indigo
    "#22c55e", // green
    "#f97316", // orange
    "#ec4899", // pink
    "#0ea5e9", // sky
  ];

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  useEffect(() => {
    if (!isInView) return;

    // first play
    controls.start("visible");

    // repeat every 5 seconds
    const interval = setInterval(() => {
      controls.start("hidden").then(() => {
        controls.start("visible");
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isInView, controls]);

  return (
    <footer
      ref={ref}
      className="mt-16 bg-gray-100 py-12 text-center"
    >
      <p className="text-base text-gray-700 mb-2">
        Designed & Developed by
      </p>

      {/* NAME ANIMATION */}
      <motion.div
        className="flex justify-center flex-wrap text-xl font-semibold"
        initial="hidden"
        animate={controls}
      >
        {name.split("").map((char, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            className="mx-[1px]"
            style={{
              color: colors[i % colors.length],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>

      <p className="mt-2 text-sm text-gray-600">
        Full Stack Web Developer
      </p>

      <a
        href="mailto:muthamgarivenu234@gmail.com"
        className="block mt-1 text-sm text-indigo-600 hover:underline"
      >
        muthamgarivenu234@gmail.com
      </a>

      <div className="mx-auto my-4 h-px w-32 bg-gray-300" />

      <p className="text-xs text-gray-500">
        © 2026 Platinum Women’s Living. All rights reserved.
      </p>
    </footer>
  );
}
