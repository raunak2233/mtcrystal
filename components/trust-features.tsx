import { Gem, HeartHandshake, RefreshCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";

const FEATURES = [
  {
    icon: Gem,
    title: "100% Natural Stones",
    description: "Authentic gemstones, never dyed glass or plastic lookalikes.",
  },
  {
    icon: Sparkles,
    title: "Cleansed & Energised",
    description: "Every bracelet is charged before it is packed and shipped.",
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    description: "Free shipping above Rs. 999, tracked door-to-door.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "UPI, cards, net banking and COD via encrypted checkout.",
  },
  {
    icon: RefreshCcw,
    title: "Easy Replacement",
    description: "Damaged in transit? We replace it within 48 hours.",
  },
  {
    icon: HeartHandshake,
    title: "Guidance Included",
    description: "Not sure which crystal? Talk to us before you buy.",
  },
];

/**
 * Trust strip. `compact` renders the four headline promises in a single row for
 * use directly under a hero; the default shows all six as cards.
 */
export function TrustFeatures({ compact = false }: { compact?: boolean }) {
  const items = compact ? FEATURES.slice(0, 4) : FEATURES;

  if (compact) {
    return (
      <section className="border-y border-stone-200 bg-white" aria-label="Why shop with us">
        <div className="container mx-auto grid grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-600">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="group rounded-2xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-premium"
        >
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 transition-transform duration-300 group-hover:scale-110">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <h3 className="mb-1.5 text-base font-semibold text-gray-900">{title}</h3>
          <p className="text-sm leading-relaxed text-gray-600">{description}</p>
        </div>
      ))}
    </div>
  );
}
