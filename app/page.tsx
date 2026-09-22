import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Shield, Sparkles, Star } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { BannerCarousel } from "@/components/banner-carousel";
import { CategoryShowcase } from "@/components/category-showcase";
import { FaqSection } from "@/components/faq-section";
import { GuidanceCta } from "@/components/guidance-cta";
import { JsonLd } from "@/components/json-ld";
import { RitualGuide } from "@/components/ritual-guide";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCities } from "@/components/service-cities";
import { StatsBand } from "@/components/stats-band";
import { TrustFeatures } from "@/components/trust-features";
import {
  readBanners,
  readCategories,
  readProducts,
  readSettings,
  readTestimonials,
} from "@/lib/server/store";
import { GENERAL_FAQS } from "@/lib/content";
import { SITE_DESCRIPTION, buildPageMetadata, itemListSchema } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Handcrafted Crystal Bracelets Online in India",
  description: SITE_DESCRIPTION,
  path: "/",
});

export default async function Home() {
  const [products, banners, allTestimonials, categories, settings] = await Promise.all([
    readProducts(),
    readBanners(),
    readTestimonials(),
    readCategories(),
    readSettings(),
  ]);

  const bestSellers = products.filter((product) => product.bestSeller).slice(0, 8);
  const newArrivals = products.filter((product) => product.newArrival).slice(0, 8);
  const featured = allTestimonials.filter((testimonial) => testimonial.featured);
  const testimonials = (featured.length ? featured : allTestimonials).slice(0, 3);

  return (
    <div className="flex flex-col">
      <BannerCarousel banners={banners} />

      <TrustFeatures compact />

      <CategoryShowcase categories={categories} products={products} />

      {bestSellers.length ? (
        <section className="bg-purple-50/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Loved The Most"
              title="Best sellers"
              subtitle="The bracelets our customers keep coming back for, and gifting on."
              align="left"
              action={{ href: "/products?sort=featured", label: "See all best sellers" }}
            />
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {bestSellers.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <ButtonLink href="/products" size="lg" className="bg-purple-600 hover:bg-purple-700">
                Shop all products
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </section>
      ) : null}

      <StatsBand />

      <RitualGuide />

      {newArrivals.length ? (
        <section className="bg-white py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Just In"
              title="New arrivals"
              subtitle="Fresh designs strung this month, in limited quantities."
              align="left"
              action={{ href: "/products", label: "View the full catalogue" }}
            />
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-gradient-to-r from-purple-100 to-pink-100 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-700">
                Our Story
              </p>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Handcrafted in India, worn every day
              </h2>
              <p className="text-pretty text-lg leading-relaxed text-gray-700">
                Since 2017, MT Crystals has been dedicated to bringing the ancient wisdom of crystal
                healing to modern life. Each bracelet is handcrafted with genuine gemstones, carefully
                selected for their unique properties and beauty.
              </p>
              <p className="text-pretty text-lg leading-relaxed text-gray-700">
                We believe in the transformative power of crystals to enhance well-being, promote
                positive energy, and support your journey toward balance and harmony.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { icon: Heart, title: "Handcrafted", copy: "Strung by hand, one at a time" },
                  { icon: Shield, title: "Authentic", copy: "100% genuine gemstones" },
                  { icon: Sparkles, title: "Energised", copy: "Cleansed and charged" },
                  { icon: Star, title: "Quality", copy: "Premium beads and cord" },
                ].map(({ icon: Icon, title, copy }) => (
                  <div key={title} className="flex items-start gap-3">
                    <Icon className="h-6 w-6 flex-shrink-0 text-purple-600" aria-hidden="true" />
                    <div>
                      <h3 className="mb-1 font-semibold">{title}</h3>
                      <p className="text-sm text-gray-600">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <ButtonLink
                  href="/about"
                  variant="outline"
                  className="border-purple-300 bg-white/70 text-purple-700"
                >
                  Read our story
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-3xl shadow-premium-lg">
              <Image
                src="/images/aboutimg.jpg"
                alt="Crystal bracelets being handcrafted at the MT Crystals studio"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {testimonials.length ? (
        <section className="bg-white py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Real Stories"
              title="What our customers say"
              subtitle="Unedited words from people wearing our crystals every day."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <figure
                  key={testimonial.id}
                  className="flex h-full flex-col rounded-3xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-premium"
                >
                  <div
                    className="mb-4 flex items-center gap-1"
                    aria-label={`${testimonial.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index < testimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-stone-200"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote className="mb-6 flex-1 text-pretty leading-relaxed text-gray-700">
                    &ldquo;{testimonial.message}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3 border-t border-stone-100 pt-4">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="truncate text-sm text-gray-600">
                        {[testimonial.location, testimonial.product].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-10 text-center">
              <ButtonLink href="/testimonials" variant="outline" size="lg">
                Read more reviews
              </ButtonLink>
            </div>
          </div>
        </section>
      ) : null}

      <ServiceCities />

      <section className="bg-purple-50/60 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="The MT Crystals Promise"
            title="Why thousands of wrists trust us"
            subtitle="Sourcing, energising, packing and after-sales - the parts that are easy to cut corners on are the parts we don't."
          />
          <TrustFeatures />
        </div>
      </section>

      <FaqSection
        faqs={GENERAL_FAQS}
        subtitle="Sizing, shipping, authenticity and care - answered."
      />

      <GuidanceCta settings={settings} />

      <JsonLd
        id="schema-home-products"
        data={itemListSchema([...bestSellers, ...newArrivals], {
          name: "Featured crystal bracelets",
          path: "/",
        })}
      />
    </div>
  );
}
