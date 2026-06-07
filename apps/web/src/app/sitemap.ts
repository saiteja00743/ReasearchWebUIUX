import type { MetadataRoute } from "next";
import { featuredPublications } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://researchhub.app";
  return [
    "",
    "/discover",
    "/publish",
    "/login",
    "/register",
    ...featuredPublications.map((publication) => `/publication/${publication.slug}`)
  ].map((path) => ({
    url: `${appUrl}${path}`,
    lastModified: new Date()
  }));
}
