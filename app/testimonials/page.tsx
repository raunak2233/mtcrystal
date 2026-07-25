import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { readTestimonials } from "@/lib/server/store";

function formatReviewDate(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function TestimonialsPage() {
  const testimonials = await readTestimonials();
  const averageRating = testimonials.length
    ? (
        testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0) /
        testimonials.length
      ).toFixed(1)
    : "5.0";

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Customer Reviews</h1>
          <p className="mx-auto max-w-3xl text-lg text-purple-100 sm:text-xl">
            Read what our customers have to say about their experience with MT Crystals
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:py-16">
        {testimonials.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 transition-shadow duration-300 hover:shadow-xl">
                <div className="mb-4 flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="mb-6 italic leading-relaxed text-gray-700">
                  &ldquo;{testimonial.message}&rdquo;
                </p>

                <div className="flex items-center gap-3 border-t pt-4">
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
                    {testimonial.location ? (
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    ) : null}
                  </div>
                </div>

                {testimonial.product || testimonial.reviewDate ? (
                  <div className="mt-4 border-t pt-4">
                    {testimonial.product ? (
                      <p className="text-sm font-medium text-purple-600">
                        Purchased: {testimonial.product}
                      </p>
                    ) : null}
                    {testimonial.reviewDate ? (
                      <p className="mt-1 text-xs text-gray-500">
                        {formatReviewDate(testimonial.reviewDate)}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="mb-4 text-xl text-gray-600">No reviews published yet</p>
            <Link href="/products">
              <Button className="bg-purple-600 hover:bg-purple-700">Browse Products</Button>
            </Link>
          </div>
        )}
      </section>

      <section className="bg-purple-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <p className="mb-2 text-4xl font-bold sm:text-5xl">5000+</p>
              <p className="text-purple-100">Happy Customers</p>
            </div>
            <div>
              <p className="mb-2 text-4xl font-bold sm:text-5xl">{averageRating}</p>
              <p className="text-purple-100">Average Rating</p>
            </div>
            <div>
              <p className="mb-2 text-4xl font-bold sm:text-5xl">98%</p>
              <p className="text-purple-100">Satisfaction Rate</p>
            </div>
            <div>
              <p className="mb-2 text-4xl font-bold sm:text-5xl">7+</p>
              <p className="text-purple-100">Years in Business</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
