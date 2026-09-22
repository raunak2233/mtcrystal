import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import type { SiteSettings } from "@/lib/types";

/**
 * Closing CTA band. Contact routes come from admin settings, and each one is
 * only rendered when it has actually been filled in, so the panel never shows a
 * dead link.
 */
export function GuidanceCta({ settings }: { settings: SiteSettings }) {
  const phone = settings.phonePrimary?.trim();
  const email = settings.contactEmail?.trim();
  const whatsapp = settings.whatsappUrl?.trim();

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 px-6 py-12 text-white shadow-premium-lg sm:px-12 sm:py-16">
          <span
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-pink-300/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr,1fr]">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-purple-100">
                Not sure where to start?
              </p>
              <h2 className="text-balance text-3xl font-bold sm:text-4xl">
                Tell us what you need, we&apos;ll pick the crystal
              </h2>
              <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-purple-50">
                Share what you are working through - sleep, focus, anxiety, money blocks or a fresh
                start - and we will suggest a bracelet or a combination that fits. No pressure to buy.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/contact" size="lg" variant="secondary" className="font-semibold">
                  Get a recommendation
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink
                  href="/products"
                  size="lg"
                  variant="outline"
                  className="border-white/60 bg-transparent font-semibold text-white hover:bg-white/10 hover:text-white"
                >
                  Browse the collection
                </ButtonLink>
              </div>
            </div>

            <div className="space-y-3">
              {whatsapp ? (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur transition hover:bg-white/20"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">Chat on WhatsApp</span>
                    <span className="block text-xs text-purple-100">Fastest way to reach us</span>
                  </span>
                </a>
              ) : null}

              {phone ? (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur transition hover:bg-white/20"
                >
                  <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{phone}</span>
                    <span className="block text-xs text-purple-100">Mon-Sat, 10am - 6pm IST</span>
                  </span>
                </a>
              ) : null}

              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur transition hover:bg-white/20"
                >
                  <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{email}</span>
                    <span className="block text-xs text-purple-100">We reply within a day</span>
                  </span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
