"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type GalleryItem = {
  src: string;
  label: string;
};

type Props = {
  data: GalleryItem[];
};

export default function GalleryCard({ data }: Props) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const openViewer = (index: number) => {
    setCurrent(index);
    setOpen(true);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % data.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + data.length) % data.length);
  };

  return (
    <>
      {/* 🔹 GALLERY CARD */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mt-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-extrabold text-gray-900">
            🖼️ Photo Gallery
          </h2>
          <span className="text-xs text-blue-600 font-medium">
            Tap to view
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto">
          {data.map((img, i) => (
            <button
              key={i}
              onClick={() => openViewer(i)}
              className="relative min-w-[120px] h-[90px] rounded-xl overflow-hidden focus:outline-none"
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                className="object-cover"
              />
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 rounded">
                {img.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 FULLSCREEN VIEWER */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white bg-black/60 p-2 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Previous */}
          <button
            onClick={prev}
            className="absolute left-3 md:left-8 text-white bg-black/60 p-3 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image */}
          <div className="relative w-[90vw] max-w-3xl h-[70vh]">
            <Image
              src={data[current].src}
              alt={data[current].label}
              fill
              className="object-contain rounded-xl"
            />
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 
              text-white text-sm bg-black/60 px-3 py-1 rounded-full">
              {data[current].label}
            </p>
          </div>

          {/* Next */}
          <button
            onClick={next}
            className="absolute right-3 md:right-8 text-white bg-black/60 p-3 rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
}
