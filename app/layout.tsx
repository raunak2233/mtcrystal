import type React from "react"
import type { Metadata, Viewport } from "next"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppShell } from "@/components/app-shell"
import { EcommerceHeader } from "@/components/ecommerce-header"
import { SiteFooter } from "@/components/site-footer"
import { InitialLoadOverlay, RouteProgress } from "@/components/route-progress"
import { JsonLd } from "@/components/json-ld"
import { readCategories, readSettings } from "@/lib/server/store"
import {
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_LEGAL_NAME,
  SITE_NAME,
  SITE_URL,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo"
import { Toaster } from "sonner"

// Categories, banners, testimonials and contact details are all editable from the
// admin panel, so nothing below this layout may be baked in at build time.
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Handcrafted Crystal Bracelets Online in India`,
    // Every page passes a short title; the brand suffix is appended here so it
    // never has to be repeated (and never gets doubled up).
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  generator: "Next.js",
  authors: [{ name: SITE_LEGAL_NAME, url: SITE_URL }],
  creator: SITE_LEGAL_NAME,
  publisher: SITE_LEGAL_NAME,
  category: "shopping",
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Handcrafted Crystal Bracelets Online in India`,
    description: SITE_DESCRIPTION,
    locale: "en_IN",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_LEGAL_NAME} handcrafted crystal bracelets`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Handcrafted Crystal Bracelets Online in India`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/images/image1.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7c3aed",
  colorScheme: "light",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Read here so the category dropdown is in the first paint instead of popping
  // in after a client-side request.
  const [categories, settings] = await Promise.all([readCategories(), readSettings()])

  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://imager.assignease.io" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <JsonLd id="schema-organization" data={organizationSchema(settings)} />
        <JsonLd id="schema-website" data={websiteSchema()} />
      </head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-purple-600 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
          >
            Skip to main content
          </a>
          <InitialLoadOverlay />
          <RouteProgress />
          <AppShell
            header={<EcommerceHeader categories={categories} />}
            footer={<SiteFooter />}
          >
            {children}
          </AppShell>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
