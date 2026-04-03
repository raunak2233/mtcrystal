import Image from "next/image";

Image
export function Logo() {
  return (
    <div className="flex items-center">
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
<Image
                    src="/images/image1.png"
                    alt="{testimonial.name}"
                    width={70}
                    height={70}
                    className="rounded-full"
                  />      </span>
    </div>
  );
}
