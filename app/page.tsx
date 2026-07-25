import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Heart, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { BannerCarousel } from "@/components/banner-carousel";
import { readBanners, readProducts, readTestimonials } from "@/lib/server/store";

export default async function Home() {
  const [products, banners, allTestimonials] = await Promise.all([
    readProducts(),
    readBanners(),
    readTestimonials(),
  ]);
  const bestSellers = products.filter((product) => product.bestSeller).slice(0, 6);
  const newArrivals = products.filter((product) => product.newArrival).slice(0, 6);
  const featured = allTestimonials.filter((testimonial) => testimonial.featured);
  const testimonials = (featured.length ? featured : allTestimonials).slice(0, 3);

  return (
    <div className="flex flex-col">
      <BannerCarousel banners={banners} />

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">Best Sellers</h2>
            <p className="text-lg text-gray-600">Our most loved crystal bracelets</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/products">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Shop All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">New Arrivals</h2>
            <p className="text-lg text-gray-600">Fresh additions to our collection</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real experiences from real people</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                <div className="mb-4 flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic text-gray-700">&ldquo;{testimonial.message}&rdquo;</p>
                <div className="flex items-center gap-3">
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
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/testimonials">
              <Button variant="outline" size="lg">
                Read More Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-purple-100 to-pink-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Our Story</h2>
              <p className="text-lg text-gray-700">
                Since 2017, MT Crystals has been dedicated to bringing the ancient wisdom of crystal healing to modern life. Each bracelet is handcrafted with genuine gemstones, carefully selected for their unique properties and beauty.
              </p>
              <p className="text-lg text-gray-700">
                We believe in the transformative power of crystals to enhance well-being, promote positive energy, and support your journey toward balance and harmony.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <Heart className="h-6 w-6 flex-shrink-0 text-purple-600" />
                  <div>
                    <h3 className="mb-1 font-semibold">Handcrafted</h3>
                    <p className="text-sm text-gray-600">Made with love and care</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 flex-shrink-0 text-purple-600" />
                  <div>
                    <h3 className="mb-1 font-semibold">Authentic</h3>
                    <p className="text-sm text-gray-600">100% genuine crystals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="h-6 w-6 flex-shrink-0 text-purple-600" />
                  <div>
                    <h3 className="mb-1 font-semibold">Energized</h3>
                    <p className="text-sm text-gray-600">Cleansed and charged</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-6 w-6 flex-shrink-0 text-purple-600" />
                  <div>
                    <h3 className="mb-1 font-semibold">Quality</h3>
                    <p className="text-sm text-gray-600">Premium materials</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-lg shadow-xl">
              <Image src="/images/aboutimg.jpg" alt="Our Story" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold">Have Questions?</h2>
          <p className="mb-8 text-xl text-purple-100">
            We&apos;re here to help you find the perfect crystal for your needs
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary">
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
