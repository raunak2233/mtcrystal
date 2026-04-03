import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import benefits from "@/data/benefits.json";

export default function BenefitsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Crystal Healing Benefits</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Discover the ancient wisdom and modern science behind crystal healing. 
            Each crystal carries unique properties to support your well-being.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="space-y-12">
          {benefits.map((benefit, index) => (
            <Card
              key={benefit.id}
              className={`overflow-hidden ${
                index % 2 === 0 ? "" : "bg-purple-50/50"
              }`}
            >
              <div className={`grid md:grid-cols-2 gap-8 p-8 ${
                index % 2 === 0 ? "" : "md:grid-flow-dense"
              }`}>
                <div className={`space-y-4 ${index % 2 === 0 ? "" : "md:col-start-2"}`}>
                  <h2 className="text-3xl font-bold">{benefit.title}</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {benefit.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {benefit.crystals.map((crystal) => (
                      <Badge key={crystal} variant="secondary" className="text-sm">
                        {crystal}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className={`relative h-80 rounded-lg overflow-hidden ${
                  index % 2 === 0 ? "" : "md:col-start-1 md:row-start-1"
                }`}>
                  <Image
                    src={benefit.image}
                    alt={benefit.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience the Benefits?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Explore our collection of handcrafted crystal bracelets and find the perfect match for your needs.
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary">
              Shop Crystal Bracelets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
