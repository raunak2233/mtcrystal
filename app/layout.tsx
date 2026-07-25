import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppShell } from "@/components/app-shell"
import { EcommerceHeader } from "@/components/ecommerce-header"
import { SiteFooter } from "@/components/site-footer"
import { InitialLoadOverlay, RouteProgress } from "@/components/route-progress"
import { readCategories } from "@/lib/server/store"
import { Toaster } from "sonner"

// Categories, banners, testimonials and contact details are all editable from the
// admin panel, so nothing below this layout may be baked in at build time.
export const dynamic = "force-dynamic"

export const metadata = {
  title: "MT Crystals - Handcrafted Crystal Bracelets",
  description:
    "Discover the healing power of crystal bracelets at Miracle Touch Crystals. Handcrafted with love since 2017.",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Read here so the category dropdown is in the first paint instead of popping
  // in after a client-side request.
  const categories = await readCategories()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
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
