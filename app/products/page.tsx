import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const products = [
  {
    id: 1,
    name: "Amethyst Harmony",
    description: "Promotes calm and balance, perfect for stress relief and meditation.",
    price: "$29.99",
    image: "/placeholder.svg?height=200&width=200",
    category: "Emotional Healing",
  },
  {
    id: 2,
    name: "Rose Quartz Love",
    description: "Opens the heart chakra and attracts love and compassion.",
    price: "$32.99",
    image: "/placeholder.svg?height=200&width=200",
    category: "Love & Relationships",
  },
  {
    id: 3,
    name: "Clear Quartz Clarity",
    description: "Amplifies energy and thought, bringing mental clarity and focus.",
    price: "$27.99",
    image: "/placeholder.svg?height=200&width=200",
    category: "Mental Clarity",
  },
  {
    id: 4,
    name: "Black Tourmaline Protection",
    description: "Creates a protective shield against negative energies and electromagnetic radiation.",
    price: "$34.99",
    image: "/placeholder.svg?height=200&width=200",
    category: "Protection",
  },
  {
    id: 5,
    name: "Citrine Abundance",
    description: "Attracts wealth, prosperity, and success in business ventures.",
    price: "$31.99",
    image: "/placeholder.svg?height=200&width=200",
    category: "Prosperity",
  },
  {
    id: 6,
    name: "Lapis Lazuli Wisdom",
    description: "Enhances intellectual ability, truth-seeking, and self-awareness.",
    price: "$36.99",
    image: "/placeholder.svg?height=200&width=200",
    category: "Wisdom & Truth",
  },
  {
    id: 7,
    name: "Green Aventurine Luck",
    description: "Known as the 'Stone of Opportunity,' bringing good luck and fortune.",
    price: "$29.99",
    image: "/placeholder.svg?height=200&width=200",
    category: "Luck & Opportunity",
  },
  {
    id: 8,
    name: "Moonstone Intuition",
    description: "Enhances intuition, promotes inner growth and strength.",
    price: "$33.99",
    image: "/placeholder.svg?height=200&width=200",
    category: "Intuition",
  },
  {
    id: 9,
    name: "Tiger's Eye Confidence",
    description: "Builds courage, confidence, and personal power.",
    price: "$30.99",
    image: "/placeholder.svg?height=200&width=200",
    category: "Confidence",
  },
]

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 bg-purple-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Crystal Bracelets</h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                Explore our collection of handcrafted crystal bracelets, each designed to bring specific energies into
                your life.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="flex justify-center p-6 bg-purple-50">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      {product.category}
                    </span>
                  </div>
                  <CardTitle className="mb-2">{product.name}</CardTitle>
                  <p className="text-sm text-gray-500">{product.description}</p>
                  <p className="mt-4 font-bold text-lg">{product.price}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Add to Cart</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
