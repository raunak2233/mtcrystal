import Image from "next/image"
import { Star } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Yoga Instructor",
    content:
      "I've been wearing my Amethyst bracelet from MT Crystals for over a year now, and I can truly feel the difference in my energy during yoga sessions. The quality is exceptional!",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Business Executive",
    content:
      "The Clear Quartz bracelet has been a game-changer for my focus at work. I was skeptical at first, but I'm now a firm believer in the power of these crystals. Miracle Touch Crystals delivers quality products.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Therapist",
    content:
      "I recommend MT Crystals to many of my clients seeking additional support for emotional healing. The Rose Quartz bracelet in particular has received wonderful feedback. Great customer service too!",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">What Our Customers Say</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Don't just take our word for it - hear from those who have experienced the power of our crystal bracelets.
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
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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
  )
}
