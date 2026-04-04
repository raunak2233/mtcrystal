"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { Banner } from "@/lib/types";

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length, nextSlide]);

  if (!banners.length) {
    return null;
  }

  return (
    <section className="relative h-[320px] w-full overflow-hidden sm:h-[420px] lg:h-[560px]">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={banner.image}
            alt={banner.title || `Homepage banner ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}
    </section>
  );
}
