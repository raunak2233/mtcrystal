import Image from "next/image"
import { Star } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Yoga Instructor",
    content:
      "I've been wearing my Amethyst bracelet from MT Crystals for over a year now, and I can truly feel the difference in my energy during yoga sessions. The quality is exceptional, and the customer service is outstanding. Maria took the time to help me choose the perfect bracelet for my needs.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Business Executive",
    content:
      "The Clear Quartz bracelet has been a game-changer for my focus at work. I was skeptical at first, but I'm now a firm believer in the power of these crystals. Miracle Touch Crystals delivers quality products, and their packaging is eco-friendly, which I greatly appreciate.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Therapist",
    content:
      "I recommend MT Crystals to many of my clients seeking additional support for emotional healing. The Rose Quartz bracelet in particular has received wonderful feedback. Great customer service too! The team is knowledgeable and genuinely cares about helping people find the right crystal match.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "David Thompson",
    role: "Artist",
    content:
      "As someone who works in a creative field, I find that my Lapis Lazuli bracelet from MT Crystals helps me tap into my creativity and overcome creative blocks. The craftsmanship is beautiful, and I love the energy of the stones. Will definitely be purchasing more in the future!",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Jennifer Lee",
    role: "Teacher",
    content:
      "I purchased the Black Tourmaline bracelet to help with protection from negative energies in my classroom, and I've noticed a significant difference in the overall atmosphere. The bracelet is comfortable to wear all day, and the elastic is strong and durable.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4,
  },
  {
    name: "Robert Garcia",
    role: "Financial Advisor",
    content:
      "I bought the Citrine Abundance bracelet on a whim, and within weeks of wearing it, I landed two major clients! Coincidence? Maybe, but I'm not taking it off! The quality of MT Crystals' products is evident, and their shipping was fast and secure.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Olivia Wilson",
    role: "Student",
    content:
      "As a college student dealing with exam stress, my Tiger's Eye bracelet has been a constant companion. It helps me stay focused and confident during exams. The price point is perfect for students, and the quality exceeds expectations. Thank you, MT Crystals!",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "James Miller",
    role: "Fitness Trainer",
    content:
      "I was gifted a Green Aventurine bracelet from MT Crystals, and I've had nothing but good luck since wearing it! The craftsmanship is excellent, and the energy of the stone is palpable. I've since purchased several more as gifts for friends and family.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
]

export default function TestimonialsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 bg-purple-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Customer Testimonials</h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                Read what our customers have to say about their experiences with MT Crystals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
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
                    {Array(5 - testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gray-300" />
                      ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">"{testimonial.content}"</p>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">Verified Purchase</CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
