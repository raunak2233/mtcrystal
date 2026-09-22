import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private and transactional routes: no ranking value, and crawling them
        // only burns budget on pages that redirect to login anyway.
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/account",
          "/cart",
          "/checkout",
          "/login",
          "/signup",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
