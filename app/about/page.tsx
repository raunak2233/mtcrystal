import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About Miracle Touch Crystals</h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Our journey in bringing healing crystals to people around the world.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Miracle Touch Crystals Workshop"
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 mx-auto max-w-3xl">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Our Story</h2>
              <p className="text-gray-500">
                Miracle Touch Crystals was founded in 2017 by Maria Thompson, a crystal enthusiast and holistic healer
                with over 15 years of experience in energy work. What began as a small passion project has grown into a
                beloved brand trusted by thousands of customers worldwide.
              </p>
              <p className="text-gray-500">
                Maria's journey with crystals began during a challenging period in her life when she discovered the
                healing properties of various stones. Amazed by their impact on her well-being, she dedicated herself to
                studying crystal healing and eventually started creating handcrafted crystal bracelets for friends and
                family.
              </p>
              <p className="text-gray-500">
                The positive feedback was overwhelming, and Maria realized she could help more people by sharing her
                creations with a wider audience. Thus, MT Crystals was born with a mission to bring the healing power of
                crystals to everyone seeking balance and positive energy in their lives.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="text-gray-500">
                At Miracle Touch Crystals, our mission is to create high-quality crystal bracelets that not only look
                beautiful but also serve as powerful tools for personal growth, healing, and transformation. We believe
                that everyone deserves to experience the benefits of crystal energy in their daily lives.
              </p>
              <p className="text-gray-500">
                We are committed to ethical sourcing, sustainable practices, and maintaining the highest standards of
                craftsmanship in every piece we create. Each bracelet is handcrafted with intention and care, ensuring
                that the natural energy of the crystals is preserved and enhanced.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Our Values</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-500">
                <li>
                  <strong>Quality:</strong> We use only genuine, high-quality crystals and materials in our products.
                </li>
                <li>
                  <strong>Integrity:</strong> We are honest about the properties of our crystals and never make
                  exaggerated claims.
                </li>
                <li>
                  <strong>Sustainability:</strong> We strive to minimize our environmental impact through eco-friendly
                  packaging and responsible sourcing.
                </li>
                <li>
                  <strong>Education:</strong> We believe in empowering our customers with knowledge about crystal
                  properties and how to work with them effectively.
                </li>
                <li>
                  <strong>Community:</strong> We foster a supportive community of crystal enthusiasts who share
                  experiences and inspire each other.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Our Team</h2>
              <p className="text-gray-500">
                What started as a one-woman operation has grown into a small but dedicated team of crystal enthusiasts,
                artisans, and customer service specialists. Each team member brings their unique skills and passion to
                MT Crystals, united by a shared belief in the power of crystals to transform lives.
              </p>
              <p className="text-gray-500">
                Our artisans are trained in traditional beading techniques and energy work, ensuring that each bracelet
                is not only beautiful but also energetically aligned. Our customer service team is knowledgeable about
                our products and always ready to assist you in finding the perfect crystal match for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
