import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "Sitemap: https://www.platinumgroupofhostels.in/sitemap.xml",
  };
}
