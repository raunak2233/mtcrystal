import Image from "next/image";
import Link from "next/link";
import { Heart, Shield, Sparkles, Star, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { readContent } from "@/lib/server/store";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "About Miracle Touch Crystals",
  description:
    "Meet the team behind MT Crystals. Handcrafting authentic gemstone bracelets in India since 2017, with every piece cleansed and energised before it ships.",
  path: "/about",
});

export default async function AboutPage() {
  const content = await readContent();
  const t = (key: string) => content[key] ?? "";

  const values = [
    { icon: Heart, title: t("about.values.1.title"), copy: t("about.values.1.copy") },
    { icon: Shield, title: t("about.values.2.title"), copy: t("about.values.2.copy") },
    { icon: Sparkles, title: t("about.values.3.title"), copy: t("about.values.3.copy") },
    { icon: Star, title: t("about.values.4.title"), copy: t("about.values.4.copy") },
    { icon: Users, title: t("about.values.5.title"), copy: t("about.values.5.copy") },
    { icon: Award, title: t("about.values.6.title"), copy: t("about.values.6.copy") },
  ];

  const reasons = [
    t("about.why.item1"),
    t("about.why.item2"),
    t("about.why.item3"),
    t("about.why.item4"),
    t("about.why.item5"),
  ];

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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{t("about.hero.title")}</h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl">
              {t("about.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold mb-6">{t("about.mission.title")}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{t("about.mission.paragraph1")}</p>
            <p className="text-lg text-gray-700 leading-relaxed">{t("about.mission.paragraph2")}</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">{t("about.values.title")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {values.map(({ icon: Icon, title, copy }) => (
              <Card key={title} className="p-6 hover:shadow-lg transition-shadow">
                <Icon className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-gray-600">{copy}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-6">{t("about.journey.title")}</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                {t("about.journey.paragraph1")}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                {t("about.journey.paragraph2")}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t("about.journey.paragraph3")}
              </p>
            </div>

            <div className="bg-purple-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">{t("about.why.title")}</h3>
              <ul className="space-y-3 text-gray-700">
                {reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">{t("about.cta.title")}</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            {t("about.cta.subtitle")}
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary">
              {t("about.cta.button")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
