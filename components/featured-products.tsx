import Link from "next/link"
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
  },
  {
    id: 2,
    name: "Rose Quartz Love",
    description: "Opens the heart chakra and attracts love and compassion.",
    price: "$32.99",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Clear Quartz Clarity",
    description: "Amplifies energy and thought, bringing mental clarity and focus.",
    price: "$27.99",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function FeaturedProducts() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Products</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Our most popular crystal bracelets, handcrafted with love and intention.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="flex justify-center mt-8">
          <Link href="/products">
            <Button variant="outline">View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
