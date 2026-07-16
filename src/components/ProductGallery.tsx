"use client";

import { useState } from "react";
import Image from "next/image";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZoomed, setIsZoomed] = useState(false);

  const activeMedia = images[activeIndex];
  const isVideo = activeMedia && activeMedia.endsWith(".mp4");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isVideo) return; // Disable zoom on video reels
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(2)" });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Media Box */}
      <div
        className={`relative w-full aspect-square bg-sand/30 overflow-hidden rounded-sm ${
          isVideo ? "cursor-default" : "cursor-zoom-in"
        }`}
        onMouseEnter={() => !isVideo && setIsZoomed(true)}
        onMouseLeave={() => {
          setIsZoomed(false);
          setZoomStyle({ transform: "scale(1)" });
        }}
        onMouseMove={handleMouseMove}
      >
        {/* object-contain, not object-cover: several of the Wix shots are taller
            infographics whose text ran off the top and bottom of this square box.
            Containing letterboxes them against bg-sand instead of cropping. */}
        {isVideo ? (
          <video
            src={activeMedia}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <Image
            src={activeMedia}
            alt={`${productName} - View ${activeIndex + 1}`}
            fill
            className="object-contain transition-transform duration-200 ease-out"
            style={isZoomed ? zoomStyle : { transform: "scale(1)" }}
            priority
          />
        )}

        {/* Badge counter */}
        <div className="absolute bottom-4 left-4 bg-midnight-navy text-champagne-gold text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails. Centred under the main image, but the row still scrolls if a
          product ever carries more shots than fit. `w-max mx-auto` is what allows
          both: plain `justify-center` centres fine until the row overflows, at which
          point it pushes the first thumbnail past the scroll origin and it can never
          be reached. */}
      <div className="overflow-x-auto pb-2 hide-scrollbar">
        <div className="flex w-max mx-auto items-center gap-3">
        {images.map((img, idx) => {
          const isThumbVideo = img.endsWith(".mp4");
          return (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`View ${isThumbVideo ? "video reel" : `image ${idx + 1}`} of ${productName}`}
              className={`relative w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all duration-300 ${
                activeIndex === idx
                  ? "border-champagne-gold opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {isThumbVideo ? (
                <div className="relative w-full h-full bg-midnight-navy flex flex-col items-center justify-center text-champagne-gold">
                  <video
                    src={img}
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                  <span className="relative text-lg z-10">✦</span>
                  <span className="relative text-[9px] uppercase tracking-wider font-semibold z-10">Reel</span>
                </div>
              ) : (
                <Image
                  src={img}
                  alt={`${productName} — thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              )}
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}
