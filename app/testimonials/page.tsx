import Image from "next/image";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import testimonials from "@/data/testimonials.json";

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Customer Reviews</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Read what our customers have to say about their experience with MT Crystals
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t">
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

              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-purple-600 font-medium">
                  Purchased: {testimonial.product}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(testimonial.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">5000+</p>
              <p className="text-purple-100">Happy Customers</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">4.9</p>
              <p className="text-purple-100">Average Rating</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">98%</p>
              <p className="text-purple-100">Satisfaction Rate</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">7+</p>
              <p className="text-purple-100">Years in Business</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
