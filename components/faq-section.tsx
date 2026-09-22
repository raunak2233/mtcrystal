import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { faqSchema } from "@/lib/seo";
import type { Faq } from "@/lib/content";

/**
 * FAQ accordion that also emits FAQPage structured data, so the same answers can
 * win rich results instead of only living in the DOM.
 */
export function FaqSection({
  faqs,
  eyebrow = "Good to know",
  title = "Frequently asked questions",
  subtitle,
  withSchema = true,
  className = "bg-white py-16 sm:py-20",
}: {
  faqs: Faq[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** Only one FAQPage block should appear per page. */
  withSchema?: boolean;
  className?: string;
}) {
  if (!faqs.length) {
    return null;
  }

  return (
    <section className={className} aria-labelledby="faq-title">
      <div className="container mx-auto max-w-3xl px-4">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <h2 id="faq-title" className="sr-only">
          {title}
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white px-5 shadow-sm transition-colors data-[state=open]:border-purple-200 data-[state=open]:bg-purple-50/40"
            >
              <AccordionTrigger className="text-left text-base font-semibold text-gray-900 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {withSchema ? <JsonLd id="schema-faq" data={faqSchema(faqs)} /> : null}
    </section>
  );
}
