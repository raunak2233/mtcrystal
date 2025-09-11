import Image from "next/image";
import { Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Yoga Instructor",
    content:
      "I've been wearing the Amethyst bracelet for almost a year now. It really helps me stay calm and balanced during my yoga practice. The quality is amazing and the team guided me patiently while choosing.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Neha Gupta",
    role: "Corporate Professional",
    content:
      "Clear Quartz bracelet mujhe kaam ke time focus rehne mein bahut help karta hai. Pehle socha bas fashion hoga, but ab genuinely feel hota hai difference. Packaging bhi eco-friendly thi, loved it!",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Rohit Verma",
    role: "Therapist",
    content:
      "I often recommend Rose Quartz bracelets to my clients for emotional healing, and the feedback has been fantastic. MT Crystals' service is warm and knowledgeable, which makes the whole experience better.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Artist",
    content:
      "Mere creative blocks kaafi kam ho gaye hain since I started wearing the Lapis Lazuli bracelet. Bracelet ka finish aur design classy hai. Definitely ordering more pieces soon!",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Kunal Singh",
    role: "School Teacher",
    content:
      "I purchased a Black Tourmaline bracelet to keep negativity away in my classroom. Honestly, the atmosphere feels lighter now. The band is strong, but I wish the design was a little trendier.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4,
  },
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

export default function TestimonialsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 bg-purple-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Customer Testimonials
              </h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                Read what our customers have to say about their experiences with
                MT Crystals.
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
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
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
                <CardFooter className="text-sm text-gray-500">
                  Verified Purchase
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
