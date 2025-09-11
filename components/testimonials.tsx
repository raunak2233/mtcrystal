import Image from "next/image";
import { Star } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

const testimonials = [
  {
    name: "Meera Joshi",
    role: "Financial Advisor",
    content:
      "Citrine Abundance bracelet liya aur kuch hi din mein do bade clients mile. Coincidence ho ya magic, I’m definitely keeping it! Shipping was quick and product quality solid hai.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Aditya",
    role: "College Student",
    content:
      "As a student, exam stress is constant. Tiger Eye bracelet really helps me stay confident and focused during my studies. Affordable bhi hai aur quality bhi superb nikli.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Ritika Mehra",
    role: "Fitness Trainer",
    content:
      "I received a Green Aventurine bracelet as a gift. Since then, I’ve genuinely felt more positivity and luck in my workouts and daily life. The stone feels powerful, though delivery was a little late.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              What Our Customers Say
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Don't just take our word for it - hear from those who have
              experienced the power of our crystal bracelets.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mt-2">
                  {Array(testimonial.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
