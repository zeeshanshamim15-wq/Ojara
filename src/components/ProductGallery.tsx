"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Product image gallery: one large main image with a row of clickable
 * thumbnails beneath. On desktop, hovering the main image triggers a magnifier
 * that zooms and pans with the cursor to reveal the raw texture of the stone.
 * For now every thumbnail reuses the same photograph — pass more URLs to show
 * real multi-angle imagery.
 */
export default function ProductGallery({
  image,
  alt,
}: {
  image: string;
  alt: string;
}) {
  // Placeholder set — swap for distinct angles per product later.
  const images = [image, image, image];
  const [active, setActive] = useState(0);

  // Magnifier state: whether we're zoomed, and the cursor-driven origin.
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div>
      <div
        onMouseEnter={() => setZoomed(true)}
        onMouseMove={handleMove}
        onMouseLeave={() => setZoomed(false)}
        className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand lg:cursor-zoom-in"
      >
        {/* Inner wrapper carries the zoom transform so object-cover is preserved */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
          style={{
            transformOrigin: origin,
            transform: zoomed ? "scale(2)" : "scale(1)",
          }}
        >
          <Image
            src={images[active]}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Desktop hover hint */}
        <span className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full bg-midnight-navy/70 px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-champagne-gold backdrop-blur-sm transition-opacity duration-300 ease-out group-hover:opacity-0 lg:block">
          Hover to zoom
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {images.map((thumb, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            aria-current={active === i}
            className={`relative aspect-square overflow-hidden rounded-xl bg-sand ring-2 transition-all duration-300 ease-out ${
              active === i
                ? "ring-champagne-gold"
                : "ring-transparent hover:ring-champagne-gold/40"
            }`}
          >
            <Image
              src={thumb}
              alt=""
              fill
              sizes="(max-width: 1024px) 30vw, 160px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
