import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import Testimonials from "@/components/testimonials"
import BenefitsSection from "@/components/benefits-section"
import FeaturedProducts from "@/components/featured-products"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Discover the Healing Power of Crystal Bracelets
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Handcrafted crystal bracelets designed to bring balance, harmony, and positive energy into your life.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/products">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/benefits">
                  <Button variant="outline">Learn About Benefits</Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Crystal Bracelets Collection"
                width={400}
                height={400}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 bg-purple-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Find Your Perfect Crystal Match</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Discover the crystal bracelet that resonates with your energy and intentions.
              </p>
            </div>
            <Link href="/products">
              <Button className="bg-purple-600 hover:bg-purple-700">Explore Our Collection</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
