"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Banner } from "@/lib/types";

const AUTOPLAY_MS = 6000;

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (!banners.length) return;
      setCurrentSlide(((index % banners.length) + banners.length) % banners.length);
    },
    [banners.length]
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1 || paused) {
      return;
    }

    const interval = setInterval(nextSlide, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [banners.length, nextSlide, paused]);

  if (!banners.length) {
    return null;
  }

  const multiple = banners.length > 1;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative h-[360px] w-full overflow-hidden sm:h-[460px] lg:h-[580px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {banners.map((banner, index) => {
        const active = index === currentSlide;
        // Copy is admin-editable and often baked into the artwork instead, so the
        // overlay only renders for the fields that are actually filled in.
        const hasCopy = Boolean(banner.title || banner.subtitle || banner.ctaText);

        return (
          <div
            key={banner.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${banners.length}`}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              active ? "z-10 opacity-100" : "z-0 opacity-0"
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

            {hasCopy ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
                <div className="container relative mx-auto flex h-full items-center px-4">
                  <div className="max-w-xl text-white">
                    {banner.title ? (
                      <h2 className="text-balance text-3xl font-bold leading-tight drop-shadow-sm sm:text-4xl lg:text-5xl">
                        {banner.title}
                      </h2>
                    ) : null}
                    {banner.subtitle ? (
                      <p className="mt-4 text-pretty text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
                        {banner.subtitle}
                      </p>
                    ) : null}
                    {banner.ctaText || banner.secondaryCtaText ? (
                      <div className="mt-7 flex flex-wrap gap-3">
                        {banner.ctaText ? (
                          <Link href={banner.ctaLink || "/products"} tabIndex={active ? 0 : -1}>
                            <Button size="lg" className="bg-purple-600 font-semibold hover:bg-purple-700">
                              {banner.ctaText}
                            </Button>
                          </Link>
                        ) : null}
                        {banner.secondaryCtaText ? (
                          <Link
                            href={banner.secondaryCtaLink || "/benefits"}
                            tabIndex={active ? 0 : -1}
                          >
                            <Button
                              size="lg"
                              variant="outline"
                              className="border-white/70 bg-white/10 font-semibold text-white backdrop-blur hover:bg-white/20 hover:text-white"
                            >
                              {banner.secondaryCtaText}
                            </Button>
                          </Link>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        );
      })}

      {multiple ? (
        <>
          <button
            type="button"
            onClick={() => goTo(currentSlide - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/30 bg-black/30 p-2.5 text-white backdrop-blur transition hover:bg-black/55 sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(currentSlide + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/30 bg-black/30 p-2.5 text-white backdrop-blur transition hover:bg-black/55 sm:right-6"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-7 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
