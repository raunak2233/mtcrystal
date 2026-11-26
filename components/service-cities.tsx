import Link from "next/link";
import { MapPin, PackageCheck, Plane, Truck } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { readContent } from "@/lib/server/store";
import { SERVICE_CITIES } from "@/lib/content";

const HIGHLIGHTS = [PackageCheck, Truck, Plane];

/**
 * Delivery coverage band. Doubles as local-SEO surface area: the city names give
 * "crystal bracelet delivery in <city>" queries something real to match against.
 */
export async function ServiceCities() {
  const content = await readContent();
  const highlights = HIGHLIGHTS.map((icon, index) => ({
    icon,
    label: content[`shared.cities.highlight${index + 1}.label`] ?? "",
    detail: content[`shared.cities.highlight${index + 1}.detail`] ?? "",
  }));

  return (
    <section className="bg-brand-wash bg-white py-16 sm:py-20" aria-labelledby="service-cities-title">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow={content["shared.cities.eyebrow"]}
          title={content["shared.cities.title"]}
          subtitle={content["shared.cities.subtitle"]}
        />
        <h2 id="service-cities-title" className="sr-only">
          Cities we deliver crystal bracelets to
        </h2>

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, label, detail }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white/80 p-4 shadow-sm backdrop-blur"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-600/10 text-purple-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-600">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SERVICE_CITIES.map((city) => (
            <li
              key={city.name}
              className="group flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-premium"
            >
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-purple-500 transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{city.name}</p>
                <p className="truncate text-xs text-gray-500">{city.region}</p>
                <p className="mt-1 text-xs font-medium text-purple-600">{city.eta}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-sm text-gray-600">
          {content["shared.cities.note"]}{" "}
          <Link href="/contact" className="font-semibold text-purple-700 underline-offset-4 hover:underline">
            {content["shared.cities.link"]}
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
