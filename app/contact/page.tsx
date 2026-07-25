import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { readSettings } from "@/lib/server/store";
import { formatSettingsAddress } from "@/lib/site-settings";

export default async function ContactPage() {
  const settings = await readSettings();
  const addressLines = formatSettingsAddress(settings);
  const emails = [settings.contactEmail, settings.supportEmail].filter(Boolean);
  const phones = [settings.phonePrimary, settings.phoneSecondary].filter(Boolean);
  const businessHours = settings.businessHours
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Contact Us</h1>
          <p className="mx-auto max-w-3xl text-lg text-purple-100 sm:text-xl">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            {emails.length ? (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-1 text-lg font-semibold">Email</h3>
                    {emails.map((email) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="block break-all text-gray-600 hover:text-purple-600"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              </Card>
            ) : null}

            {phones.length ? (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Phone</h3>
                    {phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="block text-gray-600 hover:text-purple-600"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </Card>
            ) : null}

            {addressLines.length ? (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Address</h3>
                    {addressLines.map((line) => (
                      <p key={line} className="text-gray-600">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </Card>
            ) : null}

            {businessHours.length ? (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Business Hours</h3>
                    {businessHours.map((line) => (
                      <p key={line} className="text-gray-600">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </Card>
            ) : null}
          </div>

          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
