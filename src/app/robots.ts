import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://xn--i89a2dz9q2p1bhpb.com/sitemap.xml",
  };
}
