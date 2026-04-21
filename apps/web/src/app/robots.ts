import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/login", "/register", "/cart", "/checkout"],
    },
    sitemap: "https://gharsamma.com/sitemap.xml",
  };
}
