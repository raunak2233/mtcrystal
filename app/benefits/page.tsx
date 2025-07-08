import Image from "next/image"
import { Heart, Shield, Sparkles, Sun, Zap, Brain, Coins, Smile } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const benefits = [
  {
    title: "Emotional Healing",
    description:
      "Crystal bracelets can help balance emotions, reduce stress, and promote a sense of calm and well-being. Crystals like Amethyst, Rose Quartz, and Moonstone are particularly effective for emotional healing.",
    icon: Heart,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    title: "Energy Alignment",
    description:
      "Each crystal has unique vibrational properties that can help align and balance your body's energy centers or chakras. This alignment can improve overall well-being and vitality.",
    icon: Sparkles,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    title: "Protection",
    description:
      "Certain crystals act as protective shields, helping to block negative energies and promote positive vibrations. Black Tourmaline, Obsidian, and Hematite are known for their protective qualities.",
    icon: Shield,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    title: "Spiritual Growth",
    description:
      "Crystals can enhance meditation practices and support your journey of spiritual development and self-discovery. Clear Quartz, Amethyst, and Labradorite are excellent for spiritual growth.",
    icon: Sun,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    title: "Physical Wellness",
    description:
      "While not a replacement for medical treatment, many people use crystals as complementary tools for physical healing. Different crystals are associated with different parts of the body and physical systems.",
    icon: Zap,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    title: "Mental Clarity",
    description:
      "Crystals like Clear Quartz, Fluorite, and Sodalite can help clear mental fog, enhance concentration, and improve decision-making abilities.",
    icon: Brain,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    title: "Abundance & Prosperity",
    description:
      "Citrine, Green Aventurine, and Pyrite are known as prosperity stones that can help attract wealth, abundance, and success in business ventures.",
    icon: Coins,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    title: "Confidence & Self-Esteem",
    description:
      "Tiger's Eye, Carnelian, and Sunstone can boost confidence, courage, and self-esteem, helping you to overcome challenges and pursue your goals with determination.",
    icon: Smile,
    image: "/placeholder.svg?height=300&width=400",
  },
]

export default function BenefitsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 bg-purple-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Crystal Benefits</h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                Discover the many ways crystal bracelets can enhance your physical, emotional, and spiritual well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`grid gap-6 items-center ${index % 2 === 0 ? "lg:grid-cols-[1fr_1.5fr]" : "lg:grid-cols-[1.5fr_1fr]"}`}
              >
                <div className={`space-y-4 ${index % 2 !== 0 && "lg:order-2"}`}>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                      <benefit.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold">{benefit.title}</h2>
                  </div>
                  <p className="text-gray-500">{benefit.description}</p>
                </div>
                <div className={`${index % 2 !== 0 && "lg:order-1"}`}>
                  <Image
                    src={benefit.image || "/placeholder.svg"}
                    alt={benefit.title}
                    width={400}
                    height={300}
                    className="rounded-lg object-cover w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-purple-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How to Use Crystal Bracelets</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                Get the most out of your crystal bracelets with these simple practices.
              </p>
            </div>
            <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl">
              <Card>
                <CardHeader>
                  <CardTitle>Set an Intention</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    When you first receive your crystal bracelet, hold it in your hands, close your eyes, and set a
                    clear intention for what you want to achieve with it. This helps to program the crystal with your
                    specific energy.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Wear Consistently</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    For maximum benefit, wear your crystal bracelet regularly. The consistent contact with your skin
                    allows the crystal's energy to work with your own energy field continuously.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Cleanse Regularly</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Crystals absorb energy, so it's important to cleanse them regularly. You can do this by placing them
                    in moonlight, sunlight (for some crystals), or using methods like sound cleansing or smudging.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
