"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Heart, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { BannerCarousel } from "@/components/banner-carousel";
import products from "@/data/products.json";
import testimonials from "@/data/testimonials.json";

export default function Home() {
  const bestSellers = products.filter(p => p.bestSeller).slice(0, 6);
  const newArrivals = products.filter(p => p.newArrival).slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero Banner Carousel */}
      <BannerCarousel />

      {/* Best Sellers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Best Sellers</h2>
            <p className="text-gray-600 text-lg">Our most loved crystal bracelets</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/products">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Shop All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">New Arrivals</h2>
            <p className="text-gray-600 text-lg">Fresh additions to our collection</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 text-lg">Real experiences from real people</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/testimonials">
              <Button variant="outline" size="lg">
                Read More Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
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
                  <Heart className="h-6 w-6 text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Handcrafted</h3>
                    <p className="text-sm text-gray-600">Made with love and care</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Authentic</h3>
                    <p className="text-sm text-gray-600">100% genuine crystals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="h-6 w-6 text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Energized</h3>
                    <p className="text-sm text-gray-600">Cleansed and charged</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-6 w-6 text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Quality</h3>
                    <p className="text-sm text-gray-600">Premium materials</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/aboutimg.jpg"
                alt="Our Story"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Have Questions?</h2>
          <p className="text-xl mb-8 text-purple-100">
            We're here to help you find the perfect crystal for your needs
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
