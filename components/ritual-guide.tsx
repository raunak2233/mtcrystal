import { SectionHeading } from "@/components/section-heading";
import { RITUAL_STEPS } from "@/lib/content";

/**
 * Four-step "how to use your bracelet" band. Numbered cards on a connecting rule
 * so it reads as a sequence rather than four unrelated tips.
 */
export function RitualGuide() {
  return (
    <section className="bg-gradient-to-b from-white to-purple-50/60 py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Your Crystal Ritual"
          title="Four small habits that keep your crystal working"
          subtitle="A bracelet is a daily reminder of an intention. Here is how our customers get the most out of theirs."
        />

        <ol className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <span
            className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 lg:block"
            aria-hidden="true"
          />
          {RITUAL_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-3xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-premium"
            >
              <span className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-lg font-bold text-white shadow-md">
                {index + 1}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
