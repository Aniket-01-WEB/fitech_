import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The portal routes are auth-gated and redirect signed-out visitors, so
// there is nothing there for a crawler to index — keep them out of
// search results and out of the crawl budget.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin-portal",
        "/super-admin",
        "/student-portal",
        "/dashboard",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
