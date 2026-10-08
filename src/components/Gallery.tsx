"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryImageData = {
  url: string;
  alt: string;
  tag: "BEFORE" | "AFTER" | "NONE";
};

function tagLabel(tag: GalleryImageData["tag"]) {
  if (tag === "BEFORE") return "Before";
  if (tag === "AFTER") return "After";
  return null;
}

export default function Gallery({ images }: { images: GalleryImageData[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    closeButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, prev, next]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={img.url + i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="relative h-40 sm:h-48 rounded-md overflow-hidden group focus-visible:outline-2 focus-visible:outline-accent"
            aria-label={`View image ${i + 1} of ${images.length}${img.alt ? `: ${img.alt}` : ""}`}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {tagLabel(img.tag) && (
              <span className="absolute top-2 left-2 bg-ink/80 text-white text-xs font-semibold px-2 py-0.5 rounded">
                {tagLabel(img.tag)}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={images[activeIndex].url}
                alt={images[activeIndex].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            {tagLabel(images[activeIndex].tag) && (
              <span className="absolute top-2 left-2 bg-white text-ink text-xs font-semibold px-2 py-0.5 rounded">
                {tagLabel(images[activeIndex].tag)}
              </span>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center"
            aria-label="Close image viewer"
          >
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
