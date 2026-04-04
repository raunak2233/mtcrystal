import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 overflow-hidden rounded-full border border-purple-100 bg-white shadow-sm">
        <Image src="/images/image1.png" alt="MT Crystals" fill className="object-cover" />
      </div>
      <div className="leading-tight">
        <p className="bg-gradient-to-r from-purple-700 to-pink-500 bg-clip-text text-lg font-bold text-transparent">
          MT Crystals
        </p>
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Miracle Touch</p>
      </div>
    </div>
  );
}
