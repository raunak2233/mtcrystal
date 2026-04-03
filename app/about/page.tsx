import Image from "next/image";
import Link from "next/link";
import { Heart, Shield, Sparkles, Star, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <Image
          src="/images/aboutimg.jpg"
          alt="About MT Crystals"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Story</h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl">
              Bringing the healing power of crystals to people around the world since 2017
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At Miracle Touch Crystals, our mission is to create high-quality crystal bracelets 
              that not only look beautiful but also serve as powerful tools for personal growth, 
              healing, and transformation. We believe that everyone deserves to experience the 
              benefits of crystal energy in their daily lives.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Founded in 2017, MT Crystals has grown from a small passion project into a beloved 
              brand trusted by thousands of customers worldwide. Each bracelet is handcrafted with 
              genuine gemstones, carefully selected for their unique properties and beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Heart className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Handcrafted with Love</h3>
              <p className="text-gray-600">
                Every bracelet is carefully handcrafted with intention and care, 
                ensuring the natural energy of the crystals is preserved.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">100% Authentic</h3>
              <p className="text-gray-600">
                We use only genuine, high-quality crystals and materials. 
                No synthetic or fake stones, ever.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Sparkles className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Energetically Cleansed</h3>
              <p className="text-gray-600">
                All crystals are cleansed and charged before shipping to ensure 
                they arrive with positive, pure energy.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Star className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                We maintain the highest standards of craftsmanship and quality 
                in every piece we create.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Community Focused</h3>
              <p className="text-gray-600">
                We foster a supportive community of crystal enthusiasts who 
                share experiences and inspire each other.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Award className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Customer Satisfaction</h3>
              <p className="text-gray-600">
                Your happiness is our priority. We stand behind every product 
                with excellent customer service.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-6">The Journey</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Miracle Touch Crystals was founded by a crystal enthusiast and holistic healer 
                with over 15 years of experience in energy work. What began as a small passion 
                project has grown into a beloved brand trusted by thousands of customers worldwide.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                The journey with crystals began during a challenging period when the founder 
                discovered the healing properties of various stones. Amazed by their impact on 
                well-being, she dedicated herself to studying crystal healing and eventually 
                started creating handcrafted crystal bracelets for friends and family.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                The positive feedback was overwhelming, and she realized she could help more 
                people by sharing her creations with a wider audience. Thus, MT Crystals was 
                born with a mission to bring the healing power of crystals to everyone seeking 
                balance and positive energy in their lives.
              </p>
            </div>

            <div className="bg-purple-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Why Choose MT Crystals?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Ethically sourced crystals from trusted suppliers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Sustainable and eco-friendly packaging</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Expert knowledge and guidance on crystal properties</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Fast and secure shipping worldwide</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>30-day satisfaction guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Crystal Journey?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Explore our collection and find the perfect crystal bracelet for your needs
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
