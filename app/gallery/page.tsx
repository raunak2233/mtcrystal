import Image from "next/image"

const galleryImages = [
  {
    src: "/placeholder.svg?height=400&width=600",
    alt: "Crystal bracelet collection display",
    width: 600,
    height: 400,
  },
  {
    src: "/placeholder.svg?height=400&width=600",
    alt: "Close-up of amethyst bracelet",
    width: 600,
    height: 400,
  },
  {
    src: "/placeholder.svg?height=400&width=600",
    alt: "Customer wearing rose quartz bracelet",
    width: 600,
    height: 400,
  },
  {
    src: "/placeholder.svg?height=400&width=600",
    alt: "Crystal bracelet making process",
    width: 600,
    height: 400,
  },
  {
    src: "/placeholder.svg?height=400&width=600",
    alt: "Selection of healing crystals",
    width: 600,
    height: 400,
  },
  {
    src: "/placeholder.svg?height=400&width=600",
    alt: "Crystal bracelet gift packaging",
    width: 600,
    height: 400,
  },
  {
    src: "/placeholder.svg?height=400&width=600",
    alt: "MT Crystals workshop",
    width: 600,
    height: 400,
  },
  {
    src: "/placeholder.svg?height=400&width=600",
    alt: "Customer meditation with crystal bracelet",
    width: 600,
    height: 400,
  },
  {
    src: "/placeholder.svg?height=400&width=600",
    alt: "Crystal energy cleansing ritual",
    width: 600,
    height: 400,
  },
]

export default function GalleryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 bg-purple-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Gallery</h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                Explore our collection of crystal bracelets, workshop images, and happy customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {galleryImages.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
