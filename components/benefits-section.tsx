import { Heart, Shield, Sparkles, Sun } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const benefits = [
  {
    title: "Emotional Healing",
    description:
      "Crystal bracelets can help balance emotions, reduce stress, and promote a sense of calm and well-being.",
    icon: Heart,
  },
  {
    title: "Energy Alignment",
    description:
      "Each crystal has unique vibrational properties that can help align and balance your body's energy centers.",
    icon: Sparkles,
  },
  {
    title: "Protection",
    description:
      "Certain crystals act as protective shields, helping to block negative energies and promote positive vibrations.",
    icon: Shield,
  },
  {
    title: "Spiritual Growth",
    description:
      "Crystals can enhance meditation practices and support your journey of spiritual development and self-discovery.",
    icon: Sun,
  },
]

export default function BenefitsSection() {
  return (
    <section className="w-full py-12 md:py-24 bg-purple-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Crystal Benefits</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Discover how crystal bracelets can enhance your well-being and bring positive energy into your life.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-white">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
                  <benefit.icon className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{benefit.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
